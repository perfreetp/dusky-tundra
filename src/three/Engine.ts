/**
 * Engine：three 渲染总装与运行时编排。
 * React 仅通过此对象的命令式 API 交互，渲染循环与 React 完全解耦。
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type {
  FloorState,
  RopeDefinition,
  SceneConfig,
  SolveOptions,
} from '../core/model/types';
import { ENGINE_CONFIG } from '../config/engineConfig';
import { RADIAL_SEGMENTS } from '../core/perf/budgets';
import { BvhRegistry } from './bvh/BvhRegistry';
import { buildDefaultScene, type DefaultSceneHandles } from './scene/DefaultSceneFactory';
import {
  createCapMaterial,
  createRopeMaterial,
  createSectionMaterial,
} from './materials/materials';
import { RopeBatchBuilder } from './geometry/RopeBatchBuilder';
import { SectionRingPool } from './geometry/SectionRingPool';
import { CapMeshPool } from './clip/CapMeshPool';
import { ClipPlaneController } from './clip/ClipPlaneController';
import { PoseManager } from './pose/PoseManager';
import { perfProbe } from '../core/perf/perfProbe';
import type { StoreState } from '../state/store';

export interface EngineStats {
  fps: number;
  rebuildMs: number;
  uploadMs: number;
  solveP95: number | null;
  cacheHits: number;
  cacheMisses: number;
  bvhQueries: number;
  ropeCount: number;
  lod: string;
}

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private startTime = performance.now();
  private lastTime = this.startTime;
  private rafId = 0;
  private disposed = false;

  private bvh = new BvhRegistry();
  private clip: ClipPlaneController;
  private ropeBatch: RopeBatchBuilder;
  private sectionPool: SectionRingPool;
  private capPool: CapMeshPool;
  private handles: DefaultSceneHandles;
  private poseManager: PoseManager;

  private ropeMaterial: THREE.MeshStandardMaterial;
  private capMaterial: THREE.MeshStandardMaterial;
  private sectionMaterial: THREE.MeshStandardMaterial;

  private floors: FloorState[];
  private currentFloor: FloorState;
  private solveOptions: SolveOptions;
  private storeState: StoreState;

  private frameCount = 0;
  private fpsAccum = 0;
  private lastRebuildMs = 0;
  private lastUploadMs = 0;
  private statsCb: ((s: EngineStats) => void) | null = null;
  private statsTimer = 0;
  private rebuildDirty = true;
  private lastBvhQueries = 0;

  constructor(
    container: HTMLElement,
    sceneConfig: SceneConfig,
    ropes: RopeDefinition[],
    floors: FloorState[],
    loopLengths: Record<string, number>,
    storeState: StoreState,
  ) {
    this.floors = floors;
    this.currentFloor = floors[0]!;
    this.storeState = storeState;
    this.solveOptions = {
      lod: storeState.lodLevel,
      collisionIterations: 2,
      collisionMargin: 0.005,
    };

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true, // PNG 截图
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(ENGINE_CONFIG.clearColor, 1);
    this.renderer.localClippingEnabled = true;
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      ENGINE_CONFIG.cameraFov,
      container.clientWidth / container.clientHeight,
      ENGINE_CONFIG.cameraNear,
      ENGINE_CONFIG.cameraFar,
    );
    this.camera.position.set(...ENGINE_CONFIG.initialCamera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(...ENGINE_CONFIG.initialTarget);
    this.controls.enableDamping = true;
    this.controls.update();

    // 灯光
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(8, 40, 10);
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.4);
    fill.position.set(-8, 20, -8);
    this.scene.add(ambient, key, fill);

    // 剖切
    this.clip = new ClipPlaneController();
    this.scene.add(this.clip.helper);
    const clipPlanes = [this.clip.plane];

    // 默认钢结构场景 + BVH
    this.handles = buildDefaultScene(sceneConfig, clipPlanes, this.bvh);
    this.scene.add(this.handles.group);

    // 绳体
    this.ropeMaterial = createRopeMaterial({
      opacity: storeState.ropeOpacity,
      clippingPlanes: clipPlanes,
    });
    this.ropeBatch = new RopeBatchBuilder(this.ropeMaterial, {
      maxRopes: ropes.length,
      radialSegments: RADIAL_SEGMENTS[storeState.lodLevel],
    });
    this.scene.add(this.ropeBatch.mesh);

    // 截面与封口
    this.sectionMaterial = createSectionMaterial();
    this.capMaterial = createCapMaterial(clipPlanes);
    this.sectionPool = new SectionRingPool(ropes.length, this.sectionMaterial);
    this.capPool = new CapMeshPool(ropes.length, this.capMaterial);
    this.sectionPool.addTo(this.scene);
    this.capPool.addTo(this.scene);

    // 姿态管理
    this.poseManager = new PoseManager(sceneConfig, ropes, loopLengths);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  start(): void {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.loop();
  }

  requestRebuild(): void {
    this.rebuildDirty = true;
  }

  setFloor(index: number): void {
    if (index < 0 || index >= this.floors.length) return;
    this.currentFloor = this.floors[index]!;
    this.rebuildDirty = true;
  }

  setLoad(loadCoeff: number): void {
    this.currentFloor = { ...this.currentFloor, loadCoeff };
    this.rebuildDirty = true;
  }

  setLod(lod: StoreState['lodLevel']): void {
    this.solveOptions.lod = lod;
    this.rebuildDirty = true;
  }

  setOpacity(opacity: number): void {
    this.ropeMaterial.opacity = opacity;
  }

  setClipHeight(h: number | null): void {
    this.clip.setHeight(h);
  }

  setRopeVisible(v: boolean): void {
    this.ropeBatch.mesh.visible = v;
  }

  setTensionColored(_v: boolean): void {
    // 顶点色始终启用；开关保留用于未来纯色模式
  }

  onStats(cb: (s: EngineStats) => void): void {
    this.statsCb = cb;
  }

  getPoseManager(): PoseManager {
    return this.poseManager;
  }

  getBvhRegistry(): BvhRegistry {
    return this.bvh;
  }

  /** 挂载 GLB 导入对象（碰撞体已在导入管线注册 BVH） */
  attachImportedObject(object: THREE.Object3D): void {
    this.scene.add(object);
    this.bvh.updateWorldBox();
    this.requestRebuild();
  }

  /** 调试钩子：统计剖切截面环/封口可见数（自动化验证用） */
  installDebugHook(): void {
    const w = window as unknown as {
      __ropeDebug?: () => { visibleSections: number; visibleCaps: number };
    };
    w.__ropeDebug = () => {
      let visibleSections = 0;
      let visibleCaps = 0;
      this.sectionPool.forEachVisible(() => visibleSections++);
      this.capPool.forEachVisible(() => visibleCaps++);
      // 诊断：每根绳在当前剖切高度的交点节点与 arcFlag
      const h = this.clip.currentHeight;
      const diag: Record<string, unknown>[] = [];
      for (const [id, pose] of this.poseManager.basePoses) {
        const rendered = this.poseManager.getRendered(id) ?? pose.positions;
        let nodeIndex = -1;
        let arc0 = -1;
        for (let i = 0; i < pose.nodeCount - 1; i++) {
          const y0 = rendered[i * 3 + 1]!;
          const y1 = rendered[(i + 1) * 3 + 1]!;
          if ((y0 <= h && y1 >= h) || (y0 >= h && y1 <= h)) {
            nodeIndex = i;
            arc0 = pose.arcFlags[i]!;
            break;
          }
        }
        diag.push({ id, nodeIndex, arc0, arc1: nodeIndex >= 0 ? pose.arcFlags[nodeIndex + 1] : -1 });
      }
      return { visibleSections, visibleCaps, height: h, diag: diag.slice(0, 3) };
    };
  }

  getFloor(): FloorState {
    return this.currentFloor;
  }

  private rebuild(): void {
    // 先同步刚体位姿并刷新世界矩阵，保证 BVH 局部空间查询的变换正确
    this.syncMovingParts();
    this.scene.updateMatrixWorld(true);
    this.bvh.updateWorldBox();

    const result = this.poseManager.rebuild(
      this.currentFloor,
      this.solveOptions,
      this.bvh,
    );
    this.lastRebuildMs = result.elapsedMs;
    // 拓扑/张力变化时全量重建绳管（位置/法线/颜色/UV/索引）
    this.ropeBatch.rebuild(
      this.poseManager.basePoses,
      this.poseManager.renderedMap,
      this.poseManager.radiusMap,
      [1, 0, 0],
    );
    this.rebuildDirty = false;
  }

  /** 轿厢/对重网格跟随当前档位 */
  private syncMovingParts(): void {
    const f = this.currentFloor;
    this.handles.car.position.set(
      this.handles.car.position.x,
      f.carY - 1.2, // 悬吊点到车体中心偏移
      this.handles.car.position.z,
    );
    this.handles.counterweight.position.set(
      this.handles.counterweight.position.x,
      f.counterweightY - 1.3,
      this.handles.counterweight.position.z,
    );
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    const time = (now - this.startTime) / 1000;
    this.lastTime = now;

    if (this.rebuildDirty) this.rebuild();

    // 逐帧摆幅
    this.poseManager.applyFrameSwing(time, this.currentFloor, this.solveOptions.collisionMargin);

    // 绳管几何：仅位置/法线轻量刷新（拓扑与颜色在 rebuild 时已固定）
    perfProbe.mark('rope.upload');
    this.ropeBatch.updatePositions(
      this.poseManager.basePoses,
      this.poseManager.renderedMap,
      [1, 0, 0],
    );
    this.lastUploadMs = perfProbe.measure('rope.upload', 'rope.upload');

    // 剖切截面/封口
    if (this.clip.isEnabled) {
      const h = this.clip.currentHeight;
      this.sectionPool.update(
        this.poseManager.basePoses,
        this.poseManager.renderedMap,
        this.poseManager.radiusMap,
        h,
        this.storeState.showSectionMarkers,
      );
      this.capPool.update(
        this.poseManager.basePoses,
        this.poseManager.renderedMap,
        this.poseManager.radiusMap,
        h,
        { margin: this.solveOptions.collisionMargin },
      );
    } else {
      this.sectionPool.update(this.poseManager.basePoses, this.poseManager.renderedMap, this.poseManager.radiusMap, 0, false);
      this.capPool.update(this.poseManager.basePoses, this.poseManager.renderedMap, this.poseManager.radiusMap, -9999, { margin: 0.005 });
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // 10Hz 统计
    this.frameCount++;
    this.fpsAccum += dt;
    this.statsTimer += dt;
    if (this.statsTimer >= 0.1) {
      const sample = perfProbe.sample('pose.rebuild');
      const queries = perfProbe.counters.get('collision.queries') ?? 0;
      this.lastBvhQueries = queries;
      this.statsCb?.({
        fps: Math.round(this.frameCount / this.fpsAccum),
        rebuildMs: this.lastRebuildMs,
        uploadMs: this.lastUploadMs,
        solveP95: sample?.p95 ?? null,
        cacheHits: this.poseManager.cache.hits.hit,
        cacheMisses: this.poseManager.cache.hits.miss,
        bvhQueries: this.lastBvhQueries,
        ropeCount: this.poseManager.ropeCount,
        lod: this.solveOptions.lod,
      });
      this.frameCount = 0;
      this.fpsAccum = 0;
      this.statsTimer = 0;
    }
  };

  /** PNG 截图（同帧读取，preserveDrawingBuffer 已开启） */
  screenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  private onResize(): void {
    const el = this.renderer.domElement.parentElement;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.controls.dispose();
    this.clip.dispose();
    this.sectionPool.dispose();
    this.capPool.dispose();
    this.ropeBatch.dispose();
    this.bvh.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
