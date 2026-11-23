/**
 * 场景总管：渲染器（WebGPU 优先、WebGL 回退）、相机、OrbitControls、
 * 地面/贴地视角、数据装配、store 订阅与每帧循环。
 *
 * 渲染顺序：
 *   地面(0) -> 车身压力网格(1) -> 体渲染(2) -> 粒子线/头(3/4) -> 剖切面(5)
 * 透明对象 depthWrite 按层配置，体渲染读线性深度纹理保证不穿插。
 */

import {
  Fog,
  GridHelper,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
  Scene,
  PerspectiveCamera,
} from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useAppStore, type AxisId, type RegionId } from '../state/store';
import type { LoadedSurface, LoadedVolume } from '../data/loader';
import { buildLutTextures, buildVolumeTextures, type VolumeTextures } from './textures';
import { buildCarModel, type CarModel } from './carModel';
import { createVolumeRaymarcher, type VolumeRaymarcher } from './volumeRaymarch';
import { createClipPlanes, type ClipPlaneSystem } from './clipPlanes';
import { createGpuParticles, type GpuParticleSystem } from './particleGpu';
import { createCpuParticles, type CpuParticleSystem } from './particleCpu';
import type { VolumeGrid } from './volumeSampler';

export interface SceneHandle {
  dispose: () => void;
  backend: 'webgpu' | 'webgl';
  /** 供 TransformControls 接入的剖切面句柄 */
  clipSystem: ClipPlaneSystem | null;
  /** 收集当前帧率等运行信息 */
  getStats: () => { fps: number; backend: string; particles: number; voxels: number };
}

interface SceneDeps {
  surface: LoadedSurface | null;
  volume: LoadedVolume | null;
}

export async function createScene(canvas: HTMLCanvasElement, deps: SceneDeps): Promise<SceneHandle> {
  // ---- 渲染器：WebGPU 优先 ----
  let backend: 'webgpu' | 'webgl' = 'webgpu';
  let renderer: WebGPURenderer;
  try {
    renderer = new WebGPURenderer({ canvas, antialias: true, alpha: false });
    await renderer.init();
    if (!(renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend) backend = 'webgl';
  } catch (e) {
    console.warn('WebGPU 初始化失败，回退 WebGL：', e);
    renderer = new WebGPURenderer({ canvas, antialias: true, forceWebGL: true });
    await renderer.init();
    backend = 'webgl';
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0e14, 1);

  const scene = new Scene();
  scene.fog = new Fog(0x0a0e14, 14, 34);

  const camera = new PerspectiveCamera(50, 1, 0.05, 200);
  const initState = useAppStore.getState();
  camera.position.fromArray(initState.view.cameraPosition);

  const controls = new OrbitControls(camera, canvas);
  controls.target.fromArray(initState.view.cameraTarget);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.minDistance = 1.2;
  controls.maxDistance = 26;
  controls.update();

  // ---- 地面 ----
  const ground = new Mesh(
    new PlaneGeometry(60, 60),
    new MeshStandardMaterial({ color: 0x11161f, roughness: 0.95, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = initState.view.groundHeight;
  ground.renderOrder = 0;
  scene.add(ground);
  const grid = new GridHelper(60, 60, 0x2a3a55, 0x1a2436);
  grid.position.y = initState.view.groundHeight + 0.002;
  scene.add(grid);

  // ---- LUT ----
  const { speedLUT, pressureLUT } = buildLutTextures();

  // ---- 车身 ----
  let car: CarModel | null = null;
  if (deps.surface) {
    car = buildCarModel(deps.surface, pressureLUT);
    scene.add(car.mesh);
    applyPressureState(car);
  }

  // ---- 体数据 ----
  let volumeTex: VolumeTextures | null = null;
  let raymarcher: VolumeRaymarcher | null = null;
  let clipSystem: ClipPlaneSystem | null = null;
  let particles: GpuParticleSystem | CpuParticleSystem | null = null;
  const particleGroup = new Group();
  scene.add(particleGroup);

  if (deps.volume) {
    const grid0: VolumeGrid = deps.volume.grid;
    volumeTex = buildVolumeTextures(grid0);
    raymarcher = createVolumeRaymarcher(
      volumeTex.velocity,
      volumeTex.worldMin,
      volumeTex.worldMax,
      speedLUT,
    );
    scene.add(raymarcher.mesh);
    raymarcher.setParams(useAppStore.getState().volume);
    raymarcher.setEnabled(useAppStore.getState().volume.enabled);

    clipSystem = createClipPlanes(grid0);
    scene.add(clipSystem.group);
    syncClipPlanes(clipSystem);

    // 粒子：WebGPU 走 compute，WebGL 走 CPU 回退
    const seeds = buildSeeds(car, grid0, useAppStore.getState().particles.seedRegions);
    if (backend === 'webgpu') {
      const gpu = createGpuParticles(
        volumeTex.velocity,
        grid0.size,
        volumeTex.worldMin,
        volumeTex.worldMax,
        speedLUT,
        seeds,
      );
      gpu.bindRenderer(renderer);
      gpu.setActiveCount(useAppStore.getState().particles.count);
      gpu.setStepSize(useAppStore.getState().particles.stepSize);
      gpu.setTrailLength(useAppStore.getState().particles.trailLength);
      gpu.group.visible = useAppStore.getState().particles.enabled;
      particles = gpu;
      particleGroup.add(gpu.group);
    } else {
      const cpu = createCpuParticles(grid0, speedLUT, seeds);
      cpu.setActiveCount(useAppStore.getState().particles.count);
      cpu.setStepSize(useAppStore.getState().particles.stepSize);
      cpu.setTrailLength(useAppStore.getState().particles.trailLength);
      cpu.group.visible = useAppStore.getState().particles.enabled;
      particles = cpu;
      particleGroup.add(cpu.group);
    }
  }

  // ---- store 订阅 ----
  const unsubscribers: (() => void)[] = [];
  unsubscribers.push(
    useAppStore.subscribe((state, prev) => {
      if (state.pressure !== prev.pressure || state.highlight !== prev.highlight) {
        if (car) applyPressureState(car);
      }
      if (state.volume !== prev.volume && raymarcher) {
        raymarcher.setParams(state.volume);
        raymarcher.setEnabled(state.volume.enabled);
      }
      if (state.clipPlanes !== prev.clipPlanes && clipSystem) syncClipPlanes(clipSystem);
      if (state.particles !== prev.particles && particles) {
        particles.setActiveCount(state.particles.count);
        particles.setStepSize(state.particles.stepSize);
        particles.setTrailLength(state.particles.trailLength);
        particles.group.visible = state.particles.enabled;
        if (state.particles.seedRegions !== prev.particles.seedRegions && deps.volume && car) {
          const seeds = buildSeeds(car, deps.volume.grid, state.particles.seedRegions);
          particles.reseed(seeds);
        }
      }
      if (state.view.mode !== prev.view.mode) {
        applyViewMode(state.view.mode, camera, controls, new Vector3().fromArray(state.view.cameraTarget));
      }
    }),
  );

  // ---- 尺寸 ----
  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // ---- 主循环 ----
  let raf = 0;
  let last = performance.now();
  let fpsAcc = 0;
  let fpsFrames = 0;
  let fps = 0;
  let cameraSaveTimer = 0;

  // 调试探针：CDP 冒烟测试读取场景图与运行状态（不持有 renderer，避免资源泄漏）
  (globalThis as unknown as { __aeroScene?: unknown }).__aeroScene = { scene, camera, particles };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    controls.update();
    particles?.group.visible && particles.update(dt);

    renderer.render(scene, camera);

    // 相机位姿节流持久化（约 2Hz）
    cameraSaveTimer += dt;
    if (cameraSaveTimer > 0.5) {
      cameraSaveTimer = 0;
      useAppStore.getState().saveCamera(
        camera.position.toArray() as [number, number, number],
        controls.target.toArray() as [number, number, number],
      );
    }
    fpsAcc += dt;
    fpsFrames++;
    if (fpsAcc >= 1) {
      fps = Math.round(fpsFrames / fpsAcc);
      fpsAcc = 0;
      fpsFrames = 0;
    }
  };
  tick();

  return {
    backend,
    clipSystem,
    getStats: () => ({
      fps,
      backend,
      particles: useAppStore.getState().particles.count,
      voxels: volumeTex?.voxelCount ?? 0,
    }),
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      unsubscribers.forEach((u) => u());
      controls.dispose();
      car?.dispose();
      raymarcher?.dispose();
      clipSystem?.dispose();
      particles?.dispose();
      ground.geometry.dispose();
      (ground.material as MeshStandardMaterial).dispose();
      grid.geometry.dispose();
      speedLUT.dispose();
      pressureLUT.dispose();
      renderer.dispose();
    },
  };
}

function applyPressureState(car: CarModel) {
  const s = useAppStore.getState();
  car.setPressureUniforms({
    low: s.pressure.low,
    high: s.pressure.high,
    hide: s.pressure.bandMode === 'hide',
    opacity: s.pressure.opacity,
    highlight: s.highlight,
  });
}

function syncClipPlanes(system: ClipPlaneSystem) {
  const s = useAppStore.getState().clipPlanes;
  (Object.keys(s) as AxisId[]).forEach((axis) => {
    const h = system.handles[axis];
    h.setEnabled(s[axis].enabled);
    h.setNormalized(s[axis].position);
  });
}

/**
 * 撒播点：尾翼/扩散器区域表面采样 + 区域上方体素内补充点，
 * 合并为一张种子表（去重前上限 4096，由粒子系统截断）。
 */
function buildSeeds(
  car: CarModel | null,
  grid: VolumeGrid,
  regions: RegionId[],
): Float32Array {
  const out: number[] = [];
  const perRegion = 1024;
  if (car) {
    for (const r of regions) {
      if (r === 'none') continue;
      const { positions } = car.sampleRegionPoints(r, perRegion);
      for (let i = 0; i < positions.length; i++) out.push(positions[i]);
    }
  }
  // 补充：沿区域中心的体素网格点，保证没有表面数据时也能出流线
  if (out.length < 1024) {
    const center = regions.includes('rearWing')
      ? [2.2, 1.0, 0]
      : regions.includes('diffuser')
        ? [1.9, 0.25, 0]
        : [0, 0.5, 0];
    for (let i = 0; i < 1024 && out.length < 4096 * 3; i++) {
      out.push(
        center[0] + pseudo(i, 0) * 0.8 - 0.4,
        center[1] + pseudo(i, 1) * 0.5,
        center[2] + pseudo(i, 2) * 1.6 - 0.8,
      );
    }
  }
  void grid;
  return new Float32Array(out).subarray(0, 4096 * 3);
}

function pseudo(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 视角切换：自由漫游保持当前位姿；贴地视角把相机压到低角度、
 * 目标沿车身中轴线，限制极角接近水平。
 */
function applyViewMode(
  mode: 'free' | 'ground',
  camera: { position: Vector3 },
  controls: OrbitControls,
  target: Vector3,
) {
  if (mode === 'ground') {
    camera.position.set(target.x - 5.2, 0.32, target.z + 2.4);
    controls.target.set(target.x, 0.45, target.z);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.minPolarAngle = Math.PI * 0.42;
    controls.update();
  } else {
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.update();
  }
}
