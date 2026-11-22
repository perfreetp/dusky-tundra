import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { EffectComposer, RenderPass, EffectPass, SMAAEffect, BloomEffect, VignetteEffect } from 'postprocessing';
import { buildCarGeometry, applyCylindricalUV, LEVELS } from './carBody';
import { DecalComposer } from './decalComposer';
import { LiveryMaterial } from './materials';
import type { Decal, MaterialState } from '../types';

export const VIEW_PRESETS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  side: { pos: [0, 0.7, 6.8], target: [0, 0.45, 0] },
  top: { pos: [0, 8.2, 0.01], target: [0, 0, 0] },
  threequarter: { pos: [4.4, 2.4, 4.4], target: [0, 0.4, 0] },
  wheelArch: { pos: [2.7, 0.75, 2.1], target: [1.55, 0.35, 0.85] },
  wingEndplate: { pos: [-3.5, 1.35, 1.7], target: [-2.3, 1.0, 0.95] },
};

interface CamTween {
  t: number;
  dur: number;
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTg: THREE.Vector3;
  toTg: THREE.Vector3;
}

export class SceneManager {
  readonly decalComposer = new DecalComposer(2048);
  readonly livery = new LiveryMaterial(this.decalComposer.texture);
  customBody = false;
  onFps: (n: number) => void = () => {};
  onTriangles: (n: number) => void = () => {};

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private composer: EffectComposer;
  private bodyMesh: THREE.Mesh | null = null;
  private wheels = new THREE.Group();
  private wheelTriangles = 0;
  private level = -1;
  private tween: CamTween | null = null;
  private raf = 0;
  private last = performance.now();
  private frames = 0;
  private fpsAcc = 0;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    const p = VIEW_PRESETS.threequarter;
    this.camera.position.set(...p.pos);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(...p.target);
    this.controls.maxDistance = 25;
    this.controls.minDistance = 0.4;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
    this.scene.background = new THREE.Color(0x0d1015);
    this.scene.fog = new THREE.Fog(0x0d1015, 18, 45);

    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(6, 9, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -5;
    sun.shadow.camera.right = 5;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -5;
    sun.shadow.camera.far = 30;
    this.scene.add(sun);
    this.scene.add(new THREE.HemisphereLight(0xbdd2ff, 0x1a1c20, 0.5));

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(30, 64),
      new THREE.MeshStandardMaterial({ color: 0x161a20, roughness: 0.95, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.buildWheels();
    this.scene.add(this.wheels);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(
      new EffectPass(
        this.camera,
        new SMAAEffect(),
        new BloomEffect({ intensity: 0.45, luminanceThreshold: 0.85, mipmapBlur: true }),
        new VignetteEffect({ darkness: 0.4 }),
      ),
    );

    this.setSubdivision(1);
    this.loop();
  }

  private buildWheels(): void {
    const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.42, 48);
    tireGeo.rotateX(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.44, 24);
    rimGeo.rotateX(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.92 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x9aa2ad, roughness: 0.3, metalness: 0.9 });
    const pos: Array<[number, number]> = [
      [1.55, 0.86],
      [1.55, -0.86],
      [-1.55, 0.86],
      [-1.55, -0.86],
    ];
    for (const [x, z] of pos) {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(tireGeo, tireMat);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      tire.castShadow = true;
      rim.castShadow = true;
      g.add(tire, rim);
      g.position.set(x, 0.36, z);
      this.wheels.add(g);
    }
    this.wheelTriangles = (((tireGeo.index?.count ?? 0) + (rimGeo.index?.count ?? 0)) / 3) * 4;
  }

  private replaceBody(geometry: THREE.BufferGeometry): void {
    if (this.bodyMesh) {
      this.scene.remove(this.bodyMesh);
      this.bodyMesh.geometry.dispose();
    }
    this.bodyMesh = new THREE.Mesh(geometry, this.livery.material);
    this.bodyMesh.castShadow = true;
    this.scene.add(this.bodyMesh);
  }

  /** 切换细分档位:重建几何体与 UV,并联动重算贴图分辨率 */
  setSubdivision(level: number): void {
    this.level = level;
    if (this.customBody) return;
    const def = LEVELS[level];
    this.decalComposer.setSize(def.texSize);
    const { geometry, triangles } = buildCarGeometry(level);
    this.replaceBody(geometry);
    this.onTriangles(triangles + this.wheelTriangles);
  }

  renderDecals(decals: Decal[]): void {
    this.decalComposer.render(decals);
  }

  setBaseColor(c: string): void {
    this.decalComposer.baseColor = c;
  }

  updateMaterials(m: MaterialState): void {
    this.livery.update(m);
  }

  setView(name: string): void {
    const p = VIEW_PRESETS[name];
    if (p) this.flyTo(p);
  }

  focusPart(name: string): void {
    const p = VIEW_PRESETS[name];
    if (p) this.flyTo(p);
  }

  private flyTo(preset: { pos: [number, number, number]; target: [number, number, number] }): void {
    this.tween = {
      t: 0,
      dur: 0.9,
      fromPos: this.camera.position.clone(),
      toPos: new THREE.Vector3(...preset.pos),
      fromTg: this.controls.target.clone(),
      toTg: new THREE.Vector3(...preset.target),
    };
  }

  /** 载入 OBJ / GLB / GLTF 车身,自动生成柱面展开 UV */
  async loadCustomBody(file: File): Promise<boolean> {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let geometry: THREE.BufferGeometry | null = null;
      if (ext === 'obj') {
        const text = await file.text();
        const obj = new OBJLoader().parse(text);
        obj.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!geometry && m.isMesh) geometry = m.geometry as THREE.BufferGeometry;
        });
      } else if (ext === 'glb' || ext === 'gltf') {
        const buf = await file.arrayBuffer();
        const gltf = await new Promise<{ scene: THREE.Group }>((res, rej) =>
          new GLTFLoader().parse(buf, '', res, rej),
        );
        gltf.scene.updateMatrixWorld(true);
        let best: THREE.BufferGeometry | null = null;
        let bestCount = 0;
        gltf.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh && (m.geometry.attributes.position?.count ?? 0) > bestCount) {
            bestCount = m.geometry.attributes.position.count;
            best = (m.geometry as THREE.BufferGeometry).clone().applyMatrix4(m.matrixWorld);
          }
        });
        geometry = best;
      } else {
        return false;
      }
      if (!geometry) return false;
      const g: THREE.BufferGeometry = geometry;
      // 归一化:长轴对齐 X,长度 5.2m,落地
      g.computeBoundingBox();
      let bb = g.boundingBox!;
      const size0 = new THREE.Vector3();
      bb.getSize(size0);
      if (size0.z > size0.x) {
        g.rotateY(Math.PI / 2);
        g.computeBoundingBox();
        bb = g.boundingBox!;
        bb.getSize(size0);
      }
      const center = new THREE.Vector3();
      bb.getCenter(center);
      const scale = 5.2 / Math.max(size0.x, 1e-6);
      g.translate(-center.x, -bb.min.y, -center.z);
      g.scale(scale, scale, scale);
      g.translate(0, 0.05, 0);
      if (!g.attributes.normal) g.computeVertexNormals();
      applyCylindricalUV(g);

      this.customBody = true;
      this.decalComposer.custom = true;
      this.decalComposer.setSize(2048);
      this.wheels.visible = false;
      this.replaceBody(g);
      const tris = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
      this.onTriangles(Math.round(tris));
      return true;
    } catch {
      return false;
    }
  }

  resetBuiltin(): void {
    this.customBody = false;
    this.decalComposer.custom = false;
    this.wheels.visible = true;
    const lv = this.level < 0 ? 1 : this.level;
    this.level = -1;
    this.setSubdivision(lv);
  }

  resize(w: number, h: number): void {
    if (w <= 0 || h <= 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
  }

  private stepTween(dt: number): void {
    const tw = this.tween!;
    tw.t = Math.min(1, tw.t + dt / tw.dur);
    const k = tw.t * tw.t * tw.t * (tw.t * (tw.t * 6 - 15) + 10);
    this.camera.position.lerpVectors(tw.fromPos, tw.toPos, k);
    this.controls.target.lerpVectors(tw.fromTg, tw.toTg, k);
    if (tw.t >= 1) this.tween = null;
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = (now - this.last) / 1000;
    this.last = now;
    this.controls.update();
    if (this.tween) this.stepTween(dt);
    this.composer.render();
    this.frames++;
    this.fpsAcc += dt;
    if (this.fpsAcc >= 0.5) {
      this.onFps(Math.round(this.frames / this.fpsAcc));
      this.frames = 0;
      this.fpsAcc = 0;
    }
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.controls.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}
