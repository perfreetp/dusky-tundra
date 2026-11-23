import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { SamplePoint, Speaker } from '../types';
import { computeCoverage, type CalcHandle, type CalcResult } from '../acoustics/engine';
import {
  captureSnapshotA,
  selectSpeaker,
  setComputing,
  setHover,
  setImporting,
  setInteracting,
  setPoints,
  setResult,
  store,
  updateSpeaker,
} from '../state/store';
import { DENSITY_SPACING, buildSampleGrid } from './grid';
import { loadVenueGltf } from './gltf';
import { createStadium, type VenueModel } from './venue';
import { CoverageLayer } from './coverage';
import { SpeakerManager } from './speakerObjects';

const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();

export class SceneHost {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly orbit: OrbitControls;
  private readonly transform: TransformControls;
  private readonly coverage = new CoverageLayer();
  private readonly speakerMgr = new SpeakerManager();
  private venue: VenueModel;
  private resizeObserver: ResizeObserver;
  private calcHandle: CalcHandle | null = null;
  private recalcTimer = 0;
  private downX = 0;
  private downY = 0;
  private raf = 0;
  private disposed = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x10141a);
    this.scene.fog = new THREE.Fog(0x10141a, 220, 420);
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(95, 78, 120);

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.target.set(0, 4, 0);
    this.orbit.enableDamping = true;
    this.orbit.maxPolarAngle = Math.PI / 2 - 0.03;
    this.orbit.update();

    const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x33363c, 1.1);
    this.scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(70, 110, 40);
    this.scene.add(dir);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(600, 600),
      new THREE.MeshStandardMaterial({ color: 0x1b2027, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    this.scene.add(ground);

    this.venue = createStadium();
    this.scene.add(this.venue.root);
    this.scene.add(this.coverage.object);
    this.scene.add(this.speakerMgr.group);

    this.transform = new TransformControls(this.camera, this.renderer.domElement);
    this.transform.setMode('translate');
    this.transform.showY = false; // 仅水平移动，安装高度由面板精确编辑
    const helper =
      typeof this.transform.getHelper === 'function'
        ? this.transform.getHelper()
        : (this.transform as unknown as THREE.Object3D);
    this.scene.add(helper);

    this.transform.addEventListener('dragging-changed', (e) => {
      const dragging = (e as unknown as { value: boolean }).value;
      this.orbit.enabled = !dragging;
      setInteracting(dragging);
      if (dragging) {
        setComputing(true);
      } else {
        // objectChange 已实时提交位置并调度重算，松手仅保证最终状态再算一次
        this.scheduleRecalc(60);
      }
    });
    this.transform.addEventListener('objectChange', () => {
      // 拖动中实时把水平位置提交到 store，覆盖计算才能跟随（高度保持面板值）
      this.commitTransform();
      if (!this.recalcTimer) this.scheduleRecalc(120);
    });

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointerleave', this.onPointerLeave);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(container);

    this.loop();
  }

  /* ---------------- 供 Solid 响应式层调用的同步方法 ---------------- */

  syncSpeakers(): void {
    this.speakerMgr.sync(
      store.speakers,
      store.selectedId,
      store.displayMode === 'isolate',
    );
    const id = store.selectedId;
    const holder = id ? this.speakerMgr.holderOf(id) : null;
    if (holder) {
      if (this.transform.object !== holder) this.transform.attach(holder);
    } else {
      this.transform.detach();
    }
  }

  rebuildGrid(): void {
    const spacing = DENSITY_SPACING[store.grid.density];
    const points = buildSampleGrid(this.venue.bounds, this.venue.raycastTargets, spacing);
    setPoints(points);
    this.coverage.rebuild(points);
  }

  async importGltf(file: File): Promise<void> {
    setImporting(true);
    try {
      const model = await loadVenueGltf(file);
      this.scene.remove(this.venue.root);
      this.venue.dispose();
      this.venue = model;
      this.scene.add(model.root);
      this.rebuildGrid();
    } finally {
      setImporting(false);
    }
  }

  /* ---------------- 声学调度 ---------------- */

  scheduleRecalc(delayMs: number): void {
    window.clearTimeout(this.recalcTimer);
    this.recalcTimer = window.setTimeout(() => {
      this.recalcTimer = 0;
      void this.runCalc();
    }, delayMs);
  }

  private async runCalc(): Promise<void> {
    this.calcHandle?.cancel();
    const points: SamplePoint[] = store.points;
    const speakers: Speaker[] = store.speakers.map((s) => ({ ...s }));
    if (points.length === 0 || speakers.length === 0) {
      this.calcHandle = null;
      setResult(null);
      setComputing(false);
      return;
    }
    setComputing(true);
    const handle = computeCoverage(points, speakers, store.grid.airAbsorption);
    this.calcHandle = handle;
    const result = await handle.promise;
    if (handle !== this.calcHandle) return; // 已被新任务取代
    setResult(result);
    setComputing(false);
  }

  /** TransformControls 松手后把水平位置写回 store（高度保持面板值） */
  private commitTransform(): void {
    const id = store.selectedId;
    if (!id) return;
    const p = this.speakerMgr.positionOf(id);
    const current = store.speakers.find((s) => s.id === id);
    if (p && current) updateSpeaker(id, { x: p.x, z: p.z, y: current.y });
  }

  /* ---------------- 着色（由 Solid 响应式 effect 驱动，而非每帧重算） ---------------- */

  private isolateCache: { result: CalcResult; speakerId: string; values: Float32Array } | null = null;

  refreshColors(): void {
    const result = store.result;
    if (!result || store.points.length === 0) {
      this.coverage.hide();
      return;
    }
    const mode = store.displayMode;
    const view = store.schemeView;

    if (mode === 'diff' || view === 'diff') {
      const snap = store.snapshotA;
      if (!snap || snap.pointCount !== result.pointCount) {
        this.coverage.hide();
        return;
      }
      this.coverage.colorDiff(result.total, snap.total);
      return;
    }

    if (mode === 'isolate' && store.selectedId) {
      const idx = store.speakers.findIndex((s) => s.id === store.selectedId);
      if (idx < 0) {
        this.coverage.hide();
        return;
      }
      if (!this.isolateCache || this.isolateCache.result !== result || this.isolateCache.speakerId !== store.selectedId) {
        const values = new Float32Array(result.pointCount);
        for (let i = 0; i < result.pointCount; i++) {
          values[i] = result.contributions[idx * result.pointCount + i];
        }
        this.isolateCache = { result, speakerId: store.selectedId, values };
      }
      this.coverage.colorAbsolute(result, this.isolateCache.values, store.grid.thresholds);
      return;
    }
    this.isolateCache = null;

    // 方案 A 视图：显示快照绝对色带
    if (view === 'A' && store.snapshotA) {
      this.coverage.colorAbsolute(result, store.snapshotA.total, store.grid.thresholds);
      return;
    }
    this.coverage.colorAbsolute(result, result.total, store.grid.thresholds);
  }

  /* ---------------- 交互 ---------------- */

  private setNDC(e: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onPointerDown = (e: PointerEvent): void => {
    this.downX = e.clientX;
    this.downY = e.clientY;
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.transform.dragging) return;
    if (Math.hypot(e.clientX - this.downX, e.clientY - this.downY) > 5) return; // 拖动视角不算点击
    this.setNDC(e);
    _raycaster.setFromCamera(_pointer, this.camera);
    const hits = _raycaster.intersectObjects(this.speakerMgr.pickables(), false);
    if (hits.length > 0) {
      selectSpeaker(hits[0].object.userData.speakerId as string);
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.transform.dragging || e.buttons !== 0) {
      setHover(null);
      return;
    }
    this.setNDC(e);
    _raycaster.setFromCamera(_pointer, this.camera);
    const covHits = _raycaster.intersectObject(this.coverage.object, false);
    if (covHits.length > 0 && covHits[0].instanceId !== undefined) {
      setHover({ index: covHits[0].instanceId, clientX: e.clientX, clientY: e.clientY });
    } else {
      setHover(null);
    }
  };

  private onPointerLeave = (): void => {
    setHover(null);
  };

  /* ---------------- 主循环 ---------------- */

  private loop = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    this.orbit.update();
    this.renderer.render(this.scene, this.camera);
  };

  private onResize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  snapshotA(): void {
    captureSnapshotA();
  }

  currentResult(): CalcResult | null {
    return store.result;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.recalcTimer);
    this.calcHandle?.cancel();
    this.resizeObserver.disconnect();
    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.onPointerDown);
    dom.removeEventListener('pointerup', this.onPointerUp);
    dom.removeEventListener('pointermove', this.onPointerMove);
    dom.removeEventListener('pointerleave', this.onPointerLeave);
    this.transform.dispose();
    this.orbit.dispose();
    this.coverage.dispose();
    this.venue.dispose();
    this.renderer.dispose();
    dom.remove();
  }
}
