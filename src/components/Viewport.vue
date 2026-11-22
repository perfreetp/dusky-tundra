<template>
  <div ref="container" class="viewport">
    <div v-if="!state.loaded" class="viewport-hint">
      <p>请在左侧「① 车架导入与材料分区」中导入网格或加载示例车架</p>
    </div>
    <div v-if="state.computing" class="computing-mask">碰撞变形计算中…</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { meshData, state, updateClipRange } from '../lib/store';
import { writeStressColors } from '../lib/colors';
import type { MeshPart } from '../lib/types';

const container = ref<HTMLDivElement>();

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let frameGroup: THREE.Group;
let ghostGroup: THREE.Group;
let clipHandle: THREE.Mesh;
let stressMarker: THREE.Mesh;
let raf = 0;
let resizeObs: ResizeObserver | null = null;

interface PartView {
  part: MeshPart;
  mesh: THREE.Mesh;
  ghost: THREE.Mesh;
  colors: Float32Array;
  material: THREE.Material;
}
let partViews: PartView[] = [];

const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
const AXIS_VEC: Record<string, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

/* 拖拽剖切平面状态 */
let dragging = false;
const dragPlane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();

function init(): void {
  const el = container.value!;
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.localClippingEnabled = true;
  el.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14181f);

  camera = new THREE.PerspectiveCamera(50, 1, 0.01, 200);
  camera.up.set(0, 0, 1);
  camera.position.set(5.5, -6.5, 4);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0.6);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x2a2d33, 1.1));
  const dir = new THREE.DirectionalLight(0xffffff, 1.6);
  dir.position.set(4, -3, 6);
  scene.add(dir);
  const dir2 = new THREE.DirectionalLight(0x88aaff, 0.5);
  dir2.position.set(-4, 3, 2);
  scene.add(dir2);

  const grid = new THREE.GridHelper(12, 24, 0x3a4356, 0x272d3a);
  grid.rotation.x = Math.PI / 2; // Z 轴向上
  scene.add(grid);
  scene.add(new THREE.AxesHelper(1.2));

  frameGroup = new THREE.Group();
  ghostGroup = new THREE.Group();
  scene.add(frameGroup);
  scene.add(ghostGroup);

  // 剖切平面手柄
  clipHandle = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xff8c1a,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  clipHandle.visible = false;
  clipHandle.renderOrder = 20;
  scene.add(clipHandle);

  // 最大应力点标记
  stressMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff2222, depthTest: false }),
  );
  stressMarker.renderOrder = 30;
  stressMarker.visible = false;
  scene.add(stressMarker);

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  resizeObs = new ResizeObserver(resize);
  resizeObs.observe(el);
  resize();
  animate();
}

function resize(): void {
  const el = container.value;
  if (!el || !renderer) return;
  const w = el.clientWidth;
  const h = el.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
}

function animate(): void {
  raf = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/* ---------- 网格构建与更新 ---------- */

function disposeGroup(g: THREE.Group): void {
  for (const child of [...g.children]) {
    const m = child as THREE.Mesh;
    m.geometry?.dispose();
    const mat = m.material as THREE.Material | THREE.Material[];
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose();
    g.remove(child);
  }
}

function buildMeshes(): void {
  disposeGroup(frameGroup);
  disposeGroup(ghostGroup);
  partViews = [];

  for (const part of meshData.parts) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(part.positions, 3));
    const colors = new Float32Array(part.positions.length);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setIndex(new THREE.BufferAttribute(part.indices, 1));
    geo.computeVertexNormals();

    const isShell = part.kind === 'shell';
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: isShell ? 0.35 : 0.55,
      metalness: isShell ? 0.2 : 0.55,
      transparent: isShell,
      opacity: isShell ? state.shellOpacity : 1,
      depthWrite: !isShell,
      side: isShell ? THREE.DoubleSide : THREE.FrontSide,
    });
    const mesh = new THREE.Mesh(geo, material);
    // 不透明梁先渲染并写深度,半透明外壳后渲染 -> 正确遮挡
    mesh.renderOrder = isShell ? 10 : 0;
    frameGroup.add(mesh);

    const ghostGeo = new THREE.BufferGeometry();
    ghostGeo.setAttribute('position', new THREE.BufferAttribute(part.original, 3));
    ghostGeo.setIndex(new THREE.BufferAttribute(part.indices, 1));
    ghostGeo.computeVertexNormals();
    const ghost = new THREE.Mesh(
      ghostGeo,
      new THREE.MeshBasicMaterial({
        color: 0x8fa3bd,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
        wireframe: true,
      }),
    );
    ghost.renderOrder = 5;
    ghost.visible = state.showGhost;
    ghostGroup.add(ghost);

    partViews.push({ part, mesh, ghost, colors, material });
  }
  updateClipRange();
  refreshColors();
  applyClip();
  fitCamera();
}

function fitCamera(): void {
  const box = new THREE.Box3().setFromObject(frameGroup);
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  controls.target.copy(center);
  camera.position
    .copy(center)
    .add(new THREE.Vector3(0.9, -1.1, 0.7).normalize().multiplyScalar(size * 1.1));
  camera.near = size / 500;
  camera.far = size * 20;
  camera.updateProjectionMatrix();
}

function refreshColors(): void {
  const cap =
    state.stressCap > 0
      ? state.stressCap
      : Math.max(state.stats.maxStress, ...state.zones.map((z) => z.yieldStrength), 1);
  for (const view of partViews) {
    if (state.showZoneColors) {
      const c = new THREE.Color();
      for (let i = 0; i < view.part.zoneOfVertex.length; i++) {
        c.set(state.zones[view.part.zoneOfVertex[i]]?.color ?? '#888888');
        view.colors[i * 3] = c.r;
        view.colors[i * 3 + 1] = c.g;
        view.colors[i * 3 + 2] = c.b;
      }
    } else {
      writeStressColors(view.part.stress, view.colors, cap);
    }
    (view.mesh.geometry.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
  }
}

function updateGeometry(): void {
  for (const view of partViews) {
    const posAttr = view.mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    view.mesh.geometry.computeVertexNormals();
    view.mesh.geometry.computeBoundingSphere();
  }
  refreshColors();
  updateClipRange();
  // 最大应力点标记
  if (state.stats.maxStress > 0) {
    stressMarker.position.set(...state.stats.maxStressPoint);
    stressMarker.visible = true;
  } else {
    stressMarker.visible = false;
  }
}

/* ---------- 剖切 ---------- */

function applyClip(): void {
  const enabled = state.clipEnabled;
  const axis = AXIS_VEC[state.clipAxis];
  clipPlane.normal.copy(axis).negate();
  clipPlane.constant = state.clipPos;
  for (const view of partViews) {
    view.material.clippingPlanes = enabled ? [clipPlane] : null;
    view.material.needsUpdate = true;
    const gm = view.ghost.material as THREE.MeshBasicMaterial;
    gm.clippingPlanes = enabled ? [clipPlane] : null;
    gm.needsUpdate = true;
  }
  clipHandle.visible = enabled;
  if (enabled) {
    const box = new THREE.Box3().setFromObject(frameGroup);
    const size = box.getSize(new THREE.Vector3());
    const dims: [number, number] =
      state.clipAxis === 'x'
        ? [size.y, size.z]
        : state.clipAxis === 'y'
          ? [size.x, size.z]
          : [size.x, size.y];
    clipHandle.scale.set(Math.max(dims[0], 0.5) * 1.1, Math.max(dims[1], 0.5) * 1.1, 1);
    clipHandle.rotation.set(0, 0, 0);
    if (state.clipAxis === 'x') clipHandle.rotation.y = Math.PI / 2;
    else if (state.clipAxis === 'y') clipHandle.rotation.x = Math.PI / 2;
    const center = box.getCenter(new THREE.Vector3());
    clipHandle.position.copy(center);
    const idx = { x: 0, y: 1, z: 2 }[state.clipAxis];
    clipHandle.position.setComponent(idx, state.clipPos);
  }
}

/* ---------- 剖切平面拖拽 ---------- */

function setPointer(ev: PointerEvent): void {
  const rect = renderer.domElement.getBoundingClientRect();
  pointerNdc.set(
    ((ev.clientX - rect.left) / rect.width) * 2 - 1,
    -((ev.clientY - rect.top) / rect.height) * 2 + 1,
  );
}

function onPointerDown(ev: PointerEvent): void {
  if (!state.clipEnabled || !clipHandle.visible) return;
  setPointer(ev);
  raycaster.setFromCamera(pointerNdc, camera);
  const hits = raycaster.intersectObject(clipHandle, false);
  if (!hits.length) return;
  dragging = true;
  controls.enabled = false;
  // 拖拽平面:包含剖切轴且尽量面向相机
  const axis = AXIS_VEC[state.clipAxis];
  const camDir = camera.getWorldDirection(new THREE.Vector3());
  const normal = new THREE.Vector3().crossVectors(axis, camDir).cross(axis).normalize();
  dragPlane.setFromNormalAndCoplanarPoint(normal, hits[0].point);
  renderer.domElement.setPointerCapture(ev.pointerId);
}

function onPointerMove(ev: PointerEvent): void {
  if (!dragging) return;
  setPointer(ev);
  raycaster.setFromCamera(pointerNdc, camera);
  const hit = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(dragPlane, hit)) return;
  const axis = AXIS_VEC[state.clipAxis];
  const pos = hit.dot(axis);
  const [mn, mx] = state.clipRange;
  state.clipPos = Math.min(mx, Math.max(mn, pos));
}

function onPointerUp(): void {
  if (dragging) {
    dragging = false;
    controls.enabled = true;
  }
}

/* ---------- 生命周期与监听 ---------- */

onMounted(() => {
  init();
  if (state.loaded) buildMeshes();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  resizeObs?.disconnect();
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  renderer?.dispose();
});

watch(() => state.loaded, (v) => v && buildMeshes());
watch(() => state.viewVersion, updateGeometry);
watch(
  () => [state.showGhost, state.shellOpacity, state.showZoneColors, state.stressCap],
  () => {
    for (const view of partViews) {
      view.ghost.visible = state.showGhost;
      if (view.part.kind === 'shell') {
        (view.material as THREE.MeshStandardMaterial).opacity = state.shellOpacity;
      }
    }
    refreshColors();
  },
);
watch(
  () => [state.clipEnabled, state.clipAxis, state.clipPos],
  () => {
    updateClipRange();
    applyClip();
  },
);
</script>

<style scoped>
.viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.viewport :deep(canvas) {
  display: block;
}
.viewport-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c8698;
  font-size: 14px;
  pointer-events: none;
  text-align: center;
  padding: 0 24px;
}
.computing-mask {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 24, 31, 0.85);
  border: 1px solid #3a4356;
  color: #ffb454;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  pointer-events: none;
}
</style>
