// three.js 场景管理:座席点阵、点选/框选、观众视角、遮挡标记
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { OccluderBox, Seat, SeatScore, Vec3, ViewTarget } from '../types';
import { rayBoxHit, scoreColor } from '../utils/math3d';
import { SEATED_EYE_OFFSET } from '../venue/demo-venue';
import type { LoadedMesh } from './mesh-loader';

const tmpVec3 = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

function toThree(v: Vec3): THREE.Vector3 {
  return new THREE.Vector3(v[0], v[1], v[2]);
}

/** 观众视角环视控制:拖动改 yaw/pitch,滚轮调焦距 */
class LookAroundController {
  yaw = Math.PI; // 默认朝向舞台(+Y)
  pitch = -0.08;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private el: HTMLElement;
  private camera: THREE.PerspectiveCamera;
  private onChange: () => void;

  constructor(camera: THREE.PerspectiveCamera, el: HTMLElement, onChange: () => void) {
    this.camera = camera;
    this.el = el;
    this.onChange = onChange;
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerDown = (e: PointerEvent) => {
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };
  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.yaw -= dx * 0.004;
    this.pitch = THREE.MathUtils.clamp(this.pitch - dy * 0.004, -1.2, 1.2);
    this.apply();
    this.onChange();
  };
  private onPointerUp = () => {
    this.dragging = false;
  };

  apply(): void {
    const cp = Math.cos(this.pitch);
    const dir = new THREE.Vector3(
      Math.sin(this.yaw) * cp,
      Math.sin(this.pitch),
      Math.cos(this.yaw) * cp,
    );
    this.camera.lookAt(tmpVec3.copy(this.camera.position).add(dir));
  }

  dispose(): void {
    this.el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  }
}

export interface SceneCallbacks {
  onSeatClick?: (seatId: number) => void;
  onSelectionChange?: (ids: number[]) => void;
  onEyeViewOcclusion?: (report: EyeOcclusionReport) => void;
}

export interface EyeOcclusionTarget {
  targetId: string;
  label: string;
  blocked: boolean;
  blockerLabel?: string;
  /** 遮挡点(沿视线第一个命中点),未挡为目标点本身 */
  hitPoint: Vec3;
  /** 该关键点当前是否落在观众视野(FOV)内,随环视实时变化 */
  inView: boolean;
  /** 相对视轴的偏角(度),用于面板排序提示 */
  angleFromCenter: number;
}

export interface EyeOcclusionReport {
  targets: EyeOcclusionTarget[];
}

export class VenueScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  private overviewCamera: THREE.PerspectiveCamera;
  private eyeCamera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private lookAround: LookAroundController | null = null;
  private container: HTMLElement;
  private seats: Seat[] = [];
  private seatMesh!: THREE.InstancedMesh;
  private occluders: OccluderBox[] = [];
  private spectatorBoxes: OccluderBox[] = [];
  private externalMeshes: LoadedMesh[] = [];
  private targets: ViewTarget[] = [];
  private selected = new Set<number>();
  private scores = new Map<number, SeatScore>();
  private scoreMode = false;
  private activeSeatId: number | null = null;
  private eyeHeight = SEATED_EYE_OFFSET;
  private cb: SceneCallbacks;

  // 遮挡标记
  private markerGroup = new THREE.Group();
  private sightLineGroup = new THREE.Group();
  private targetMeshes = new Map<string, THREE.Mesh>();

  // 框选
  private marquee: HTMLDivElement;
  private marqueeing = false;
  private marqueeStart = { x: 0, y: 0 };
  private pointerDownPos = { x: 0, y: 0 };
  private downOnCanvas = false;

  private raycaster = new THREE.Raycaster();
  private dummy = new THREE.Object3D();
  private resizeObserver: ResizeObserver;
  private raf = 0;
  private disposed = false;

  constructor(container: HTMLElement, cb: SceneCallbacks = {}) {
    this.container = container;
    this.cb = cb;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction = 'none';

    this.scene.background = new THREE.Color(0x10141d);
    this.scene.fog = new THREE.Fog(0x10141d, 120, 260);

    this.overviewCamera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      600,
    );
    // 场馆数据为 Z-up(x=横,y=纵深,z=高),three.js 为 Y-up,统一映射 (x,z,y)
    // 相机在南看台斜后上方,适度拉近使单个座席在屏幕上足够大可点击
    this.overviewCamera.position.set(0, 62, -48);

    this.eyeCamera = new THREE.PerspectiveCamera(
      72,
      container.clientWidth / container.clientHeight,
      0.05,
      400,
    );

    this.controls = new OrbitControls(this.overviewCamera, this.renderer.domElement);
    // 对准座席云重心(three 系约 (0,1.6,-0.25))
    this.controls.target.set(0, 1.6, -0.25);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 220;

    this.setupLights();
    this.scene.add(this.markerGroup, this.sightLineGroup);

    // 框选框(覆盖在 canvas 上的 DOM)
    this.marquee = document.createElement('div');
    this.marquee.className = 'marquee';
    this.marquee.hidden = true;
    container.style.position = 'relative';
    container.appendChild(this.marquee);

    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    this.animate();
  }

  private setupLights(): void {
    const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x2a2f3a, 0.9);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    // 数据坐标 (-40 横, -50 纵深, 80 高) -> three (x, y=高, z=纵深)
    sun.position.set(-40, 80, -50);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const s = 70;
    sun.shadow.camera.left = -s;
    sun.shadow.camera.right = s;
    sun.shadow.camera.top = s;
    sun.shadow.camera.bottom = -s;
    sun.shadow.camera.far = 220;
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.4);
    // (50 横, 40 纵深, 30 高) -> (50, 30, 40)
    fill.position.set(50, 30, 40);
    this.scene.add(fill);
  }

  // ---------- 场馆装载 ----------

  loadVenue(opts: {
    seats: Seat[];
    occluders: OccluderBox[];
    targets: ViewTarget[];
    stageBox: { center: Vec3; size: Vec3 };
    field: { center: Vec3; size: Vec3 };
  }): void {
    this.seats = opts.seats;
    this.occluders = opts.occluders;
    this.targets = opts.targets;
    this.selected.clear();
    this.scores.clear();
    this.scoreMode = false;
    this.activeSeatId = null;

    this.buildStaticVenue(opts.stageBox, opts.field);
    this.buildOccluderMeshes();
    this.buildSeatMesh();
    this.buildTargetMarkers();
    this.clearMarkers();
  }

  private buildStaticVenue(
    stageBox: { center: Vec3; size: Vec3 },
    field: { center: Vec3; size: Vec3 },
  ): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshStandardMaterial({ color: 0x1b2230, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.06;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const fieldMesh = new THREE.Mesh(
      new THREE.BoxGeometry(field.size[0], field.size[2], field.size[1]),
      new THREE.MeshStandardMaterial({ color: 0x2e7d4f, roughness: 0.9 }),
    );
    fieldMesh.position.set(field.center[0], field.center[2], field.center[1]);
    fieldMesh.receiveShadow = true;
    this.scene.add(fieldMesh);

    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(stageBox.size[0], stageBox.size[2], stageBox.size[1]),
      new THREE.MeshStandardMaterial({ color: 0x3a3f4d, roughness: 0.7, metalness: 0.2 }),
    );
    stage.position.set(stageBox.center[0], stageBox.center[2], stageBox.center[1]);
    stage.castShadow = true;
    stage.receiveShadow = true;
    this.scene.add(stage);

    // 舞台背景屏(自发光)
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(stageBox.size[0] * 0.9, 4, 0.2),
      new THREE.MeshStandardMaterial({
        color: 0x113355,
        emissive: 0x2277dd,
        emissiveIntensity: 0.7,
      }),
    );
    screen.position.set(stageBox.center[0], 3.4, stageBox.center[1] + stageBox.size[1] / 2 - 0.2);
    this.scene.add(screen);
  }

  private buildOccluderMeshes(): void {
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xdedede,
      transparent: true,
      opacity: 0.55,
      roughness: 0.4,
      metalness: 0.6,
    });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x707785, roughness: 0.8 });
    for (const oc of this.occluders) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(oc.size[0], oc.size[2], oc.size[1]),
        oc.tag === 'rail' ? railMat : wallMat,
      );
      mesh.position.set(oc.center[0], oc.center[2], oc.center[1]);
      mesh.rotation.y = -(oc.yaw ?? 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  }

  private buildSeatMesh(): void {
    if (this.seatMesh) {
      this.scene.remove(this.seatMesh);
      this.seatMesh.geometry.dispose();
      (this.seatMesh.material as THREE.Material).dispose();
    }
    const geo = new THREE.BoxGeometry(0.42, 0.1, 0.42);
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.75 });
    const mesh = new THREE.InstancedMesh(geo, mat, this.seats.length);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for (let i = 0; i < this.seats.length; i++) {
      const s = this.seats[i];
      this.dummy.position.set(s.position[0], s.position[2] + 0.05, s.position[1]);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.scale.setScalar(1);
      this.dummy.updateMatrix();
      mesh.setMatrixAt(i, this.dummy.matrix);
      mesh.setColorAt(i, new THREE.Color(s.sectionColor));
    }
    mesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);
    mesh.computeBoundingSphere();
    this.scene.add(mesh);
    this.seatMesh = mesh;
  }

  private buildTargetMarkers(): void {
    for (const [, m] of this.targetMeshes) {
      this.scene.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
    this.targetMeshes.clear();
    for (const t of this.targets) {
      const geo =
        t.kind === 'stage'
          ? new THREE.ConeGeometry(0.35, 0.9, 16)
          : new THREE.SphereGeometry(0.28, 16, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: t.kind === 'stage' ? 0xffd54a : 0x66e0ff,
        emissive: t.kind === 'stage' ? 0x886611 : 0x116677,
        emissiveIntensity: 0.6,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(t.position[0], t.position[2] + 0.5, t.position[1]);
      this.scene.add(m);
      this.targetMeshes.set(t.id, m);
    }
  }

  // ---------- 选择与高亮 ----------

  getSelectedIds(): number[] {
    return [...this.selected];
  }

  getSeat(id: number): Seat | undefined {
    return this.seats[id];
  }

  /** 恢复导入的选择集与评分着色 */
  restoreSelection(ids: number[], importedScores?: { seatId: number; score: number }[]): void {
    this.selected = new Set(ids);
    if (importedScores && importedScores.length) {
      for (const { seatId, score } of importedScores) {
        this.scores.set(seatId, {
          seatId,
          score,
          perTarget: [],
          spectatorBlocked: 0,
        });
      }
      this.scoreMode = true;
    }
    this.refreshSeatColors();
    this.cb.onSelectionChange?.([...this.selected]);
  }

  clearSelection(): void {
    this.selected.clear();
    this.refreshSeatColors();
    this.cb.onSelectionChange?.([]);
  }

  /** 应用批量评分结果并按分数重着色 */
  applyScores(results: SeatScore[]): void {
    this.scores.clear();
    for (const r of results) this.scores.set(r.seatId, r);
    this.scoreMode = true;
    this.refreshSeatColors();
  }

  clearScores(): void {
    this.scores.clear();
    this.scoreMode = false;
    this.refreshSeatColors();
  }

  /**
   * 刷新座席颜色,优先级:
   * 活动座席(白) > 选中/邻座高亮 > 评分色 > 分区色
   */
  private refreshSeatColors(): void {
    const neighborIds = this.activeSeatId !== null ? this.neighborIds(this.activeSeatId) : new Set<number>();
    const color = new THREE.Color();
    for (let i = 0; i < this.seats.length; i++) {
      const s = this.seats[i];
      if (this.activeSeatId === s.id) {
        color.set(0xffffff);
      } else if (neighborIds.has(s.id)) {
        color.set(0xfff27a);
      } else if (this.selected.has(s.id)) {
        color.set(0x42e8f5);
      } else if (this.scoreMode && this.scores.has(s.id)) {
        color.set(scoreColor(this.scores.get(s.id)!.score));
      } else {
        color.set(s.sectionColor);
      }
      this.seatMesh.setColorAt(i, color);
      // 选中的席稍放大,强化相对位置
      const emphasize = this.activeSeatId === s.id || neighborIds.has(s.id);
      this.dummy.position.set(s.position[0], s.position[2] + 0.05, s.position[1]);
      this.dummy.scale.setScalar(emphasize ? 1.35 : this.selected.has(s.id) ? 1.15 : 1);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.seatMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.seatMesh.instanceMatrix.needsUpdate = true;
    if (this.seatMesh.instanceColor) this.seatMesh.instanceColor.needsUpdate = true;
  }

  /** 同分区相邻座席(前后排 ±1、同排 ±2),用于相对位置高亮 */
  private neighborIds(seatId: number): Set<number> {
    const seat = this.seats[seatId];
    const out = new Set<number>();
    if (!seat) return out;
    for (const s of this.seats) {
      if (s.id === seatId || s.sectionId !== seat.sectionId) continue;
      const dr = s.row - seat.row;
      const dc = s.col - seat.col;
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 2) out.add(s.id);
    }
    return out;
  }

  // ---------- 点选/框选 ----------

  private onPointerDown = (e: PointerEvent) => {
    if (this.lookAround) return; // 观众视角下拖动交给环视
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    this.downOnCanvas = e.target === this.renderer.domElement;
    if (e.shiftKey || e.button === 2) {
      this.startMarquee(e);
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.marqueeing) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = Math.min(x, this.marqueeStart.x);
    const top = Math.min(y, this.marqueeStart.y);
    const w = Math.abs(x - this.marqueeStart.x);
    const h = Math.abs(y - this.marqueeStart.y);
    this.marquee.style.left = `${left}px`;
    this.marquee.style.top = `${top}px`;
    this.marquee.style.width = `${w}px`;
    this.marquee.style.height = `${h}px`;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.marqueeing) {
      // 普通点选(区分点击与轨道拖拽);pointerup 在 window 上监听,用按下时记录的标志
      const moved = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      if (moved < 5 && this.downOnCanvas && !this.lookAround) {
        this.pickSeat(e);
      }
      this.downOnCanvas = false;
      return;
    }
    this.finishMarquee(e);
  };

  private startMarquee(e: PointerEvent): void {
    this.marqueeing = true;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.marqueeStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.marquee.hidden = false;
    this.marquee.style.left = `${this.marqueeStart.x}px`;
    this.marquee.style.top = `${this.marqueeStart.y}px`;
    this.marquee.style.width = '0px';
    this.marquee.style.height = '0px';
    this.controls.enabled = false;
  }

  private finishMarquee(e: PointerEvent): void {
    this.marqueeing = false;
    this.marquee.hidden = true;
    this.controls.enabled = true;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x0 = this.marqueeStart.x;
    const y0 = this.marqueeStart.y;
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const ids = this.pickSeatsInRect(minX, minY, maxX, maxY);
    if (e.ctrlKey || e.metaKey) {
      for (const id of ids) {
        if (this.selected.has(id)) this.selected.delete(id);
        else this.selected.add(id);
      }
    } else {
      this.selected = new Set(ids);
    }
    this.refreshSeatColors();
    this.cb.onSelectionChange?.([...this.selected]);
  }

  private pickSeat(e: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    // 优先:three 射线精确命中座席几何
    const ndc = new THREE.Vector2((sx / rect.width) * 2 - 1, -(sy / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.overviewCamera);
    const hits = this.raycaster.intersectObject(this.seatMesh);
    if (hits.length && hits[0].instanceId !== undefined) {
      this.cb.onSeatClick?.(hits[0].instanceId);
      return;
    }

    // 回退:把每个座席投影到屏幕,选屏幕像素距离最近且在阈值内的座席
    // 俯视下座席几何被压缩、席间空隙大,屏幕邻近选取比三维射线更稳
    const proj = new THREE.Vector3();
    let bestId: number | null = null;
    let bestDist = 40; // 像素阈值,覆盖俯视下的座席间距与过道
    for (let i = 0; i < this.seats.length; i++) {
      const s = this.seats[i];
      proj.set(s.position[0], s.position[2] + 0.2, s.position[1]).project(this.overviewCamera);
      if (proj.z > 1 || proj.z < -1) continue;
      const px = ((proj.x + 1) / 2) * rect.width;
      const py = ((-proj.y + 1) / 2) * rect.height;
      const d = Math.hypot(px - sx, py - sy);
      if (d < bestDist) {
        bestDist = d;
        bestId = i;
      }
    }
    if (bestId !== null) this.cb.onSeatClick?.(bestId);
  }

  /** 屏幕矩形框选:把座席世界位置投影到屏幕后判断包含关系 */
  private pickSeatsInRect(minX: number, minY: number, maxX: number, maxY: number): number[] {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const out: number[] = [];
    const proj = new THREE.Vector3();
    for (let i = 0; i < this.seats.length; i++) {
      const s = this.seats[i];
      proj.set(s.position[0], s.position[2] + 0.2, s.position[1]).project(this.overviewCamera);
      if (proj.z > 1) continue;
      const sx = ((proj.x + 1) / 2) * rect.width;
      const sy = ((-proj.y + 1) / 2) * rect.height;
      if (sx >= minX && sx <= maxX && sy >= minY && sy <= maxY) out.push(i);
    }
    return out;
  }

  // ---------- 观众视角 ----------

  get inEyeView(): boolean {
    return this.lookAround !== null;
  }

  /** 观众视角下的活动座席 id,总览视角为 null */
  getActiveSeatId(): number | null {
    return this.activeSeatId;
  }

  setEyeHeight(h: number): void {
    this.eyeHeight = THREE.MathUtils.clamp(h, 1.0, 1.3);
    if (this.activeSeatId !== null) this.enterEyeView(this.activeSeatId);
  }

  enterEyeView(seatId: number): void {
    const seat = this.seats[seatId];
    if (!seat) return;
    this.activeSeatId = seatId;
    this.controls.enabled = false;

    const eye: Vec3 = [seat.position[0], seat.position[1], seat.position[2] + this.eyeHeight];
    this.eyeCamera.position.set(eye[0], eye[2], eye[1]);
    if (!this.lookAround) {
      this.lookAround = new LookAroundController(this.eyeCamera, this.renderer.domElement, () =>
        this.updateEyeOcclusion(),
      );
      // 进入时朝向舞台:目标点中取舞台中心,否则取 +Y
      const stage = this.targets.find((t) => t.id === 'stage-center') ?? this.targets[0];
      if (stage) {
        tmpDir.set(
          stage.position[0] - eye[0],
          stage.position[2] - eye[2],
          stage.position[1] - eye[1],
        ).normalize();
        this.lookAround.yaw = Math.atan2(tmpDir.x, tmpDir.z);
        this.lookAround.pitch = Math.asin(THREE.MathUtils.clamp(tmpDir.y, -1, 1));
      }
    }
    this.lookAround.apply();
    this.refreshSeatColors();
    this.updateEyeOcclusion();
  }

  exitEyeView(): void {
    this.lookAround?.dispose();
    this.lookAround = null;
    this.controls.enabled = true;
    this.activeSeatId = null;
    this.clearMarkers();
    this.refreshSeatColors();
  }

  /** 设置当前座席的前排观众代理(由外部 venue 数据提供) */
  setSpectatorBoxes(boxes: OccluderBox[]): void {
    this.spectatorBoxes = boxes;
    if (this.lookAround) this.updateEyeOcclusion();
  }

  /** 载入外部场馆/看台网格:展示 + 参与观众视角射线遮挡 */
  addExternalMesh(mesh: LoadedMesh): void {
    this.externalMeshes.push(mesh);
    this.scene.add(mesh.object);
    if (this.lookAround) this.updateEyeOcclusion();
  }

  clearExternalMeshes(): void {
    for (const m of this.externalMeshes) {
      this.scene.remove(m.object);
      m.object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mat = mesh.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        }
      });
    }
    this.externalMeshes = [];
  }

  /**
   * 实时遮挡判定:从眼位向每个关键点发射射线,
   * 与栏杆/结构/前排观众盒体求交,命中点比目标近即被挡。
   * 拖动环视与调眼高都会触发,纯代数计算保证实时。
   */
  private updateEyeOcclusion(): void {
    if (!this.lookAround || this.activeSeatId === null) return;
    const seat = this.seats[this.activeSeatId];
    const eye: Vec3 = [
      this.eyeCamera.position.x,
      this.eyeCamera.position.z,
      this.eyeCamera.position.y,
    ];
    void seat;

    const allBoxes = [...this.occluders, ...this.spectatorBoxes];
    const report: EyeOcclusionReport = { targets: [] };

    for (const t of this.targets) {
      const origin = eye;
      const dirVec = new THREE.Vector3(
        t.position[0] - eye[0],
        t.position[2] - eye[2],
        t.position[1] - eye[1],
      );
      const targetDist = dirVec.length();
      dirVec.normalize();
      const dir: Vec3 = [dirVec.x, dirVec.y, dirVec.z];

      let nearest: { t: number; label?: string } | null = null;
      for (const box of allBoxes) {
        const hit = rayBoxHit(origin, dir, box.center, box.size, box.yaw ?? 0);
        if (hit !== null && hit < targetDist && (!nearest || hit < nearest.t)) {
          nearest = { t: hit, label: box.label ?? box.tag };
        }
      }

      // 外部载入网格:three.js 射线求交
      if (this.externalMeshes.length) {
        this.raycaster.set(
          new THREE.Vector3(eye[0], eye[2], eye[1]),
          new THREE.Vector3(dir[0], dir[2], dir[1]),
        );
        this.raycaster.far = targetDist;
        for (const ext of this.externalMeshes) {
          const hits = this.raycaster.intersectObjects(ext.collidables, false);
          if (hits.length && (!nearest || hits[0].distance < nearest.t)) {
            nearest = { t: hits[0].distance, label: `网格:${ext.name}` };
          }
        }
        this.raycaster.far = Infinity;
      }

      const blocked = nearest !== null;
      const hitPoint: Vec3 = blocked
        ? [
            eye[0] + dir[0] * nearest!.t,
            eye[1] + dir[1] * nearest!.t,
            eye[2] + dir[2] * nearest!.t,
          ]
        : t.position;

      // 视野可见性:把关键点投影到眼相机,落在 NDC 范围内即在当前环视视野内
      const proj = new THREE.Vector3(
        t.position[0],
        t.position[2] + 0.5,
        t.position[1],
      ).project(this.eyeCamera);
      const inView = proj.z < 1 && Math.abs(proj.x) <= 1 && Math.abs(proj.y) <= 1;
      // 相对视轴偏角:视线方向与相机朝向的夹角
      const viewDir = this.eyeCamera.getWorldDirection(new THREE.Vector3());
      const toTarget = new THREE.Vector3(
        t.position[0] - eye[0],
        t.position[2] - eye[2],
        t.position[1] - eye[1],
      ).normalize();
      const angleFromCenter = (Math.acos(THREE.MathUtils.clamp(viewDir.dot(toTarget), -1, 1)) * 180) / Math.PI;

      report.targets.push({
        targetId: t.id,
        label: t.label,
        blocked,
        blockerLabel: blocked ? nearest!.label : undefined,
        hitPoint,
        inView,
        angleFromCenter,
      });
    }

    this.renderOcclusionMarkers(report);
    this.cb.onEyeViewOcclusion?.(report);
  }

  private clearMarkers(): void {
    for (const child of [...this.markerGroup.children]) {
      this.markerGroup.remove(child);
      (child as THREE.Mesh).geometry?.dispose();
    }
    for (const child of [...this.sightLineGroup.children]) {
      this.sightLineGroup.remove(child);
      (child as THREE.Line).geometry?.dispose();
    }
  }

  /** 被挡区域:红色遮挡点标记 + 视线红绿线 + 目标点状态颜色 */
  private renderOcclusionMarkers(report: EyeOcclusionReport): void {
    this.clearMarkers();
    if (this.activeSeatId === null) return;
    const seat = this.seats[this.activeSeatId];
    const eye = new THREE.Vector3(
      seat.position[0],
      seat.position[2] + this.eyeHeight,
      seat.position[1],
    );

    const blockedMat = new THREE.MeshStandardMaterial({
      color: 0xff3b30,
      emissive: 0x881111,
      emissiveIntensity: 0.8,
    });
    const okMat = new THREE.MeshBasicMaterial({ color: 0x38e07f, transparent: true, opacity: 0.5 });

    for (const r of report.targets) {
      const target = this.targets.find((t) => t.id === r.targetId)!;
      const targetVec = toThree(target.position).add(new THREE.Vector3(0, 0.5, 0));
      const hitVec = toThree(r.hitPoint).add(new THREE.Vector3(0, 0.3, 0));

      // 视野外的关键点淡化,突出当前环视真正能看到的区域
      const dim = r.inView ? 1 : 0.22;

      // 视线:眼位 -> 命中点(红)/ 目标点(绿)
      const lineGeo = new THREE.BufferGeometry().setFromPoints([eye, r.blocked ? hitVec : targetVec]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({
          color: r.blocked ? 0xff4433 : 0x33dd66,
          transparent: true,
          opacity: dim,
        }),
      );
      this.sightLineGroup.add(line);

      const tm = this.targetMeshes.get(r.targetId);
      if (tm) {
        const mat = tm.material as THREE.MeshStandardMaterial;
        mat.emissive.set(r.blocked ? 0xff2222 : 0x227744);
        mat.opacity = r.inView ? 1 : 0.35;
        mat.transparent = !r.inView;
      }

      if (r.blocked) {
        const marker = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), blockedMat);
        marker.position.copy(hitVec);
        marker.visible = r.inView;
        this.markerGroup.add(marker);
        // 被挡区域沿命中点再加一圈水平环,突出"区域"
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 8, 24), blockedMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.copy(hitVec);
        ring.visible = r.inView;
        this.markerGroup.add(ring);
      }
    }

    // 眼位小球
    const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), okMat);
    eyeBall.position.copy(eye);
    this.markerGroup.add(eyeBall);
  }

  // ---------- 渲染循环 ----------

  private handleResize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.overviewCamera.aspect = w / h;
    this.overviewCamera.updateProjectionMatrix();
    this.eyeCamera.aspect = w / h;
    this.eyeCamera.updateProjectionMatrix();
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    this.controls.update();
    // 目标标记轻微浮动
    const t = performance.now() * 0.002;
    let i = 0;
    for (const m of this.targetMeshes.values()) {
      m.rotation.y += 0.01;
      m.position.y += Math.sin(t + i) * 0.0025;
      i++;
    }
    this.renderer.render(this.scene, this.lookAround ? this.eyeCamera : this.overviewCamera);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.lookAround?.dispose();
    this.controls.dispose();
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.marquee.remove();
  }
}
