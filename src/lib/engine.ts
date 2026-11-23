import { Engine } from '@babylonjs/core/Engines/engine';
import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Plane } from '@babylonjs/core/Maths/math.plane';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Material } from '@babylonjs/core/Materials/material';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Animation } from '@babylonjs/core/Animations/animation';
import { CubicEase } from '@babylonjs/core/Animations/easing';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import type { PointerInfo } from '@babylonjs/core/Events/pointerEvents';
import '@babylonjs/core/Culling/ray';
import '@babylonjs/loaders/glTF';

import type { AnnotationData, InteractionMode, PersonData } from './types';

export interface OverlayItem {
  id: string;
  kind: 'fault' | 'person';
  lines: string[];
  /** 屏幕坐标(引线起点,剖切时已收缩到可见面) */
  x: number;
  y: number;
  visible: boolean;
  clipped: boolean;
}

interface AnnotationEntity { data: AnnotationData; anchor: TransformNode; marker: Mesh; }
interface PersonEntity { data: PersonData; root: TransformNode; }

const FLOOR_HEIGHT = 3;
const FLOOR_COUNT = 8;

let uid = 1;
function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${(uid++).toString(36)}`;
}

export class SceneManager {
  engine!: Engine | WebGPUEngine;
  engineKind = '';
  scene!: Scene;
  camera!: ArcRotateCamera;

  readonly floorHeight = FLOOR_HEIGHT;
  readonly floorCount = FLOOR_COUNT;

  shaftRoot!: TransformNode;
  carRoot!: TransformNode;
  private shaftModelNode: TransformNode | null = null;
  private carModelNode: TransformNode | null = null;

  private annotationEntities = new Map<string, AnnotationEntity>();
  private personEntities = new Map<string, PersonEntity>();

  private carTargetY = 0;
  carFloorCurrent = 1;

  mode: InteractionMode = 'navigate';
  private transparent = false;
  get transparentOn(): boolean {
    return this.transparent;
  }
  clipEnabled = false;
  private clipPlane = new Plane(1, 0, 0, 0);

  shaftModelName = '内置默认模型';
  carModelName = '内置默认模型';

  /** 数据变化时通知外部(Svelte store 同步 / 持久化) */
  onSync: () => void = () => {};
  onStatus: (msg: string) => void = () => {};

  private downPos: { x: number; y: number } | null = null;

  async init(canvas: HTMLCanvasElement): Promise<void> {
    // 优先 WebGPU,失败回退 WebGL
    try {
      if (await WebGPUEngine.IsSupportedAsync) {
        const gpu = new WebGPUEngine(canvas, {
          antialias: true,
          stencil: true,
          adaptToDeviceRatio: true,
          powerPreference: 'high-performance'
        });
        await gpu.initAsync();
        this.engine = gpu;
        this.engineKind = 'WebGPU';
      } else {
        throw new Error('WebGPU not supported');
      }
    } catch {
      this.engine = new Engine(canvas, true, { stencil: true, adaptToDeviceRatio: true }, true);
      this.engineKind = 'WebGL2(回退)';
    }

    const scene = new Scene(this.engine);
    this.scene = scene;
    scene.clearColor = new Color4(0.06, 0.07, 0.09, 1);

    // 透明排序:距离排序 + 深度预通道(防止同一网格双面叠加串色),
    // 引擎支持时开启 OIT 进一步保证井道壁/导轨/轿厢三层叠加顺序正确
    scene.useOrderIndependentTransparency = true;

    const camera = new ArcRotateCamera('cam', -Math.PI / 2.4, Math.PI / 2.6, 16, new Vector3(0, 6, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 1.5;
    camera.upperRadiusLimit = 60;
    camera.wheelDeltaPercentage = 0.01;
    camera.panningSensibility = 80;
    camera.minZ = 0.05;
    this.camera = camera;

    const hemi = new HemisphericLight('hemi', new Vector3(0.2, 1, 0.1), scene);
    hemi.intensity = 0.75;
    const dir = new DirectionalLight('dir', new Vector3(-0.5, -1, -0.4), scene);
    dir.intensity = 0.9;

    this.shaftRoot = new TransformNode('shaftRoot', scene);
    this.carRoot = new TransformNode('carRoot', scene);

    this.buildDefaultShaft();
    this.buildDefaultCar();

    // 轿厢平滑移动
    scene.registerBeforeRender(() => {
      const dy = this.carTargetY - this.carRoot.position.y;
      if (Math.abs(dy) > 0.0005) {
        this.carRoot.position.y += dy * 0.12;
      }
    });

    // 点选(区分拖拽与点击)
    scene.onPointerObservable.add((info: PointerInfo) => {
      if (info.type === PointerEventTypes.POINTERDOWN) {
        this.downPos = { x: info.event.clientX, y: info.event.clientY };
      } else if (info.type === PointerEventTypes.POINTERUP && this.downPos) {
        const dx = info.event.clientX - this.downPos.x;
        const dy = info.event.clientY - this.downPos.y;
        this.downPos = null;
        if (dx * dx + dy * dy < 25 && this.mode !== 'navigate') {
          this.handlePick(info.event.clientX, info.event.clientY);
        }
      }
    });

    window.addEventListener('resize', () => this.engine.resize());
    this.engine.runRenderLoop(() => this.scene.render());
  }

  // ---------- 材质工具 ----------

  private stdMat(name: string, color: Color3, alpha = 1): StandardMaterial {
    const m = new StandardMaterial(name, this.scene);
    m.diffuseColor = color;
    m.specularColor = Color3.Black();
    m.alpha = alpha;
    return m;
  }

  private tag(mesh: AbstractMesh, partName: string, layer: 'wall' | 'rail' | 'car' | 'other'): void {
    mesh.metadata = { ...(mesh.metadata ?? {}), partName, layer, pickable: true };
    mesh.alwaysSelectAsActiveMesh = true;
  }

  // ---------- 默认模型 ----------

  buildDefaultShaft(): void {
    this.shaftModelNode?.dispose();
    const root = new TransformNode('shaftModel', this.scene);
    root.parent = this.shaftRoot;
    this.shaftModelNode = root;
    const H = this.floorHeight * this.floorCount;
    const W = 2.6, D = 2.6, T = 0.12;

    const wallMat = this.stdMat('wallMat', new Color3(0.55, 0.58, 0.62));
    const railMat = this.stdMat('railMat', new Color3(0.75, 0.5, 0.2));
    const doorMat = this.stdMat('doorMat', new Color3(0.35, 0.45, 0.55));

    const mk = (name: string, part: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: StandardMaterial, layer: 'wall' | 'rail' | 'other') => {
      const b = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, this.scene);
      b.position.set(x, y, z);
      b.material = mat;
      b.parent = root;
      this.tag(b, part, layer);
      return b;
    };

    // 三面井道壁(正面留空便于观察,用剖显模式看内部)
    mk('wall-back', '井道壁-后', W, H, T, 0, H / 2, -D / 2, wallMat, 'wall');
    mk('wall-left', '井道壁-左', T, H, D, -W / 2, H / 2, 0, wallMat, 'wall');
    mk('wall-right', '井道壁-右', T, H, D, W / 2, H / 2, 0, wallMat, 'wall');
    mk('wall-top', '井道顶板', W, T, D, 0, H, 0, wallMat, 'wall');
    mk('wall-pit', '井道底坑', W, T, D, 0, -T / 2, 0, wallMat, 'wall');

    // 导轨(轿厢两侧)
    for (const side of [-1, 1]) {
      const rail = mk(`rail-${side}`, side < 0 ? '导轨-左' : '导轨-右', 0.12, H, 0.18, side * 1.05, H / 2, -D / 2 + 0.25, railMat, 'rail');
      rail.metadata.rail = true;
    }

    // 每层层门与门套
    for (let f = 0; f < this.floorCount; f++) {
      const y = f * this.floorHeight;
      const door = mk(`door-${f + 1}`, `层门-${f + 1}F`, 1.1, 2.1, T, 0, y + 1.05, D / 2, doorMat, 'wall');
      door.metadata.floor = f + 1;
      mk(`lintel-${f + 1}`, `门楣-${f + 1}F`, W, this.floorHeight - 2.1, T, 0, y + 2.1 + (this.floorHeight - 2.1) / 2, D / 2, wallMat, 'wall');
      mk(`jamb-l-${f + 1}`, `门垛左-${f + 1}F`, (W - 1.1) / 2, 2.1, T, -(1.1 + (W - 1.1) / 2) / 2, y + 1.05, D / 2, wallMat, 'wall');
      mk(`jamb-r-${f + 1}`, `门垛右-${f + 1}F`, (W - 1.1) / 2, 2.1, T, (1.1 + (W - 1.1) / 2) / 2, y + 1.05, D / 2, wallMat, 'wall');
    }

    // 地面参考网格
    const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 30 }, this.scene);
    ground.position.y = -0.13;
    const gm = this.stdMat('groundMat', new Color3(0.16, 0.17, 0.2));
    ground.material = gm;
    ground.isPickable = false;
    this.shaftModelName = '内置默认模型';
  }

  buildDefaultCar(): void {
    this.carModelNode?.dispose();
    const root = new TransformNode('carModel', this.scene);
    root.parent = this.carRoot;
    this.carModelNode = root;

    const carMat = this.stdMat('carMat', new Color3(0.3, 0.6, 0.75));
    const carDoorMat = this.stdMat('carDoorMat', new Color3(0.25, 0.5, 0.65));
    const CW = 1.6, CH = 2.3, CD = 1.5, T = 0.06;

    const mk = (name: string, part: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: StandardMaterial) => {
      const b = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, this.scene);
      b.position.set(x, y, z);
      b.material = mat;
      b.parent = root;
      this.tag(b, part, 'car');
      return b;
    };

    mk('car-floor', '轿厢-轿底', CW, T, CD, 0, T / 2, 0, carMat);
    mk('car-roof', '轿厢-轿顶', CW, T, CD, 0, CH, 0, carMat);
    mk('car-back', '轿厢-后壁', CW, CH, T, 0, CH / 2, -CD / 2, carMat);
    mk('car-left', '轿厢-左壁', T, CH, CD, -CW / 2, CH / 2, 0, carMat);
    mk('car-right', '轿厢-右壁', T, CH, CD, CW / 2, CH / 2, 0, carMat);
    // 轿门(两扇)
    mk('car-door-l', '轿厢-轿门左', CW / 2, CH * 0.86, T, -CW / 4, CH * 0.45, CD / 2, carDoorMat);
    mk('car-door-r', '轿厢-轿门右', CW / 2, CH * 0.86, T, CW / 4, CH * 0.45, CD / 2, carDoorMat);
    this.carModelName = '内置默认模型';
  }

  // ---------- glTF 模型载入 ----------

  async loadModel(kind: 'shaft' | 'car', file: File): Promise<void> {
    const result = await SceneLoader.ImportMeshAsync('', '', file, this.scene);
    const container = new TransformNode(`${kind}Model`, this.scene);
    container.parent = kind === 'shaft' ? this.shaftRoot : this.carRoot;
    for (const m of result.meshes) {
      if (!m.parent) m.parent = container;
      this.tag(m, m.name || (kind === 'shaft' ? '井道部件' : '轿厢部件'), kind === 'shaft' ? 'wall' : 'car');
    }
    // 归一化:底面贴 y=0,水平居中
    const bounds = container.getHierarchyBoundingVectors(true);
    const size = bounds.max.subtract(bounds.min);
    if (size.length() > 0) {
      container.position.x = -(bounds.min.x + bounds.max.x) / 2;
      container.position.z = -(bounds.min.z + bounds.max.z) / 2;
      container.position.y = -bounds.min.y;
    }
    if (kind === 'shaft') {
      this.shaftModelNode?.dispose();
      this.shaftModelNode = container;
      this.shaftModelName = file.name;
    } else {
      this.carModelNode?.dispose();
      this.carModelNode = container;
      this.carModelName = file.name;
    }
    this.applyTransparency();
    this.onSync();
  }

  // ---------- 半透明与剖切 ----------

  private collectLayerMeshes(): { walls: AbstractMesh[]; rails: AbstractMesh[]; cars: AbstractMesh[] } {
    const walls: AbstractMesh[] = [];
    const rails: AbstractMesh[] = [];
    const cars: AbstractMesh[] = [];
    if (this.shaftModelNode) {
      for (const m of this.shaftModelNode.getChildMeshes(false)) {
        const layer = m.metadata?.layer;
        if (layer === 'rail') rails.push(m);
        else if (layer === 'wall') walls.push(m);
      }
    }
    if (this.carModelNode) cars.push(...this.carModelNode.getChildMeshes(false));
    return { walls, rails, cars };
  }

  setTransparent(on: boolean): void {
    this.transparent = on;
    this.applyTransparency();
  }

  private applyTransparency(): void {
    const { walls, rails, cars } = this.collectLayerMeshes();
    // 三层透明度:井道壁最透,导轨次之,轿厢再次;深度预通道保证自身不串色,
    // 场景透明队列按视距从远到近渲染,保证近处结构正确遮住远处结构
    const apply = (meshes: AbstractMesh[], alpha: number) => {
      for (const mesh of meshes) {
        mesh.visibility = this.transparent ? alpha : 1;
        const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        for (const mat of mats) {
          mat.needDepthPrePass = this.transparent;
          if (this.transparent && 'transparencyMode' in mat) {
            (mat as { transparencyMode: number }).transparencyMode = Material.MATERIAL_ALPHABLEND;
          }
        }
      }
    };
    apply(walls, 0.18);
    apply(rails, 0.45);
    apply(cars, 0.32);
  }

  setClip(on: boolean): void {
    this.clipEnabled = on;
    this.scene.clipPlane = on ? this.clipPlane : null;
  }

  /** 剖切时把引线起点收缩到剖切面(可见面)上 */
  private clipAdjust(world: Vector3): { pos: Vector3; clipped: boolean } {
    if (!this.clipEnabled) return { pos: world, clipped: false };
    const d = this.clipPlane.dotCoordinate(world);
    if (d >= 0) return { pos: world, clipped: false };
    return { pos: world.subtract(this.clipPlane.normal.scale(d)), clipped: true };
  }

  // ---------- 轿厢楼层 ----------

  setCarFloor(floor: number): void {
    this.carFloorCurrent = Math.min(this.floorCount, Math.max(1, floor));
    this.carTargetY = (this.carFloorCurrent - 1) * this.floorHeight;
    this.onSync();
  }

  floorOfY(worldY: number): number {
    return Math.min(this.floorCount, Math.max(1, Math.floor(worldY / this.floorHeight) + 1));
  }

  // ---------- 拾取与标注 ----------

  private handlePick(x: number, y: number): void {
    const pick = this.scene.pick(x, y, (m) => !!m.metadata?.pickable);
    if (!pick?.hit || !pick.pickedPoint || !pick.pickedMesh) {
      this.onStatus('未命中模型,请点击井道或轿厢表面');
      return;
    }
    const mesh = pick.pickedMesh;
    const partName: string = mesh.metadata?.partName ?? mesh.name ?? '未知部件';
    const point = pick.pickedPoint.clone();

    if (this.mode === 'annotate') {
      const layer: string = mesh.metadata?.layer ?? 'wall';
      const attachedTo = layer === 'car' ? 'car' : 'shaft';
      const parent = attachedTo === 'car' ? this.carRoot : this.shaftRoot;
      const local = Vector3.TransformCoordinates(point, parent.getWorldMatrix().clone().invert());
      this.addAnnotation({
        id: nextId('A'),
        kind: 'fault',
        floor: this.floorOfY(point.y),
        partName,
        note: '',
        attachedTo,
        localPosition: [local.x, local.y, local.z],
        createdAt: Date.now()
      });
      this.onStatus(`已添加故障点:${partName}`);
    } else if (this.mode === 'person') {
      // 被困点始终依附轿厢,随轿厢联动
      const local = Vector3.TransformCoordinates(point, this.carRoot.getWorldMatrix().clone().invert());
      const heading = Math.atan2(this.camera.position.x - point.x, this.camera.position.z - point.z);
      this.addPerson({
        id: nextId('P'),
        kind: 'person',
        floor: this.floorOfY(point.y),
        label: `被困人员 ${this.personEntities.size + 1}`,
        attachedTo: 'car',
        localPosition: [local.x, Math.max(local.y, 0.05), local.z],
        heading,
        createdAt: Date.now()
      });
      this.onStatus('已放置被困点');
    }
  }

  addAnnotation(data: AnnotationData): void {
    const parent = data.attachedTo === 'car' ? this.carRoot : this.shaftRoot;
    const anchor = new TransformNode(`anchor-${data.id}`, this.scene);
    anchor.parent = parent;
    anchor.position.set(...data.localPosition);

    const marker = MeshBuilder.CreateSphere(`marker-${data.id}`, { diameter: 0.12, segments: 8 }, this.scene);
    const mat = this.stdMat(`markerMat-${data.id}`, new Color3(1, 0.25, 0.2));
    mat.emissiveColor = new Color3(1, 0.25, 0.2);
    mat.disableLighting = true;
    marker.material = mat;
    marker.parent = anchor;
    marker.isPickable = false;

    this.annotationEntities.set(data.id, { data, anchor, marker });
    this.onSync();
  }

  addPerson(data: PersonData): void {
    const root = new TransformNode(`person-${data.id}`, this.scene);
    root.parent = this.carRoot;
    root.position.set(...data.localPosition);

    // 身体(胶囊,不透明,透过半透明轿厢可见)
    const body = MeshBuilder.CreateCapsule(`personBody-${data.id}`, { height: 1.1, radius: 0.18 }, this.scene);
    body.position.y = 0.55;
    const bodyMat = this.stdMat(`personMat-${data.id}`, new Color3(1, 0.6, 0.1));
    bodyMat.emissiveColor = new Color3(0.9, 0.5, 0.08);
    bodyMat.disableLighting = true;
    body.material = bodyMat;
    body.parent = root;
    body.isPickable = false;

    // 朝向指示:圆形箭头牌,billboard 始终朝向相机
    const tex = new DynamicTexture(`personTex-${data.id}`, { width: 128, height: 128 }, this.scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = '#ffb020';
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('➤', 64, 66);
    tex.update();
    const boardMat = this.stdMat(`personBoardMat-${data.id}`, Color3.White());
    boardMat.emissiveTexture = tex;
    boardMat.opacityTexture = tex;
    boardMat.disableLighting = true;
    const board = MeshBuilder.CreatePlane(`personBoard-${data.id}`, { size: 0.5 }, this.scene);
    board.material = boardMat;
    board.billboardMode = Mesh.BILLBOARDMODE_ALL;
    board.position.y = 1.35;
    board.parent = root;
    board.isPickable = false;

    // 朝向箭头(世界空间,指向被困者面对方向)
    const arrow = MeshBuilder.CreateCylinder(`personArrow-${data.id}`, { diameterTop: 0, diameterBottom: 0.14, height: 0.4, tessellation: 12 }, this.scene);
    const arrowMat = this.stdMat(`personArrowMat-${data.id}`, new Color3(1, 0.85, 0.1));
    arrowMat.emissiveColor = new Color3(1, 0.85, 0.1);
    arrowMat.disableLighting = true;
    arrow.material = arrowMat;
    arrow.rotation.z = -Math.PI / 2;
    arrow.parent = root;
    arrow.position.set(Math.sin(data.heading) * 0.45, 0.12, Math.cos(data.heading) * 0.45);
    arrow.rotation.y = data.heading - Math.PI / 2;
    arrow.isPickable = false;

    this.personEntities.set(data.id, { data, root });
    this.onSync();
  }

  removeItem(id: string): void {
    const a = this.annotationEntities.get(id);
    if (a) {
      a.anchor.dispose();
      this.annotationEntities.delete(id);
    }
    const p = this.personEntities.get(id);
    if (p) {
      p.root.dispose();
      this.personEntities.delete(id);
    }
    this.onSync();
  }

  clearAll(): void {
    for (const id of [...this.annotationEntities.keys()]) this.removeItem(id);
    for (const id of [...this.personEntities.keys()]) this.removeItem(id);
  }

  updateNote(id: string, note: string): void {
    const a = this.annotationEntities.get(id);
    if (a) {
      a.data.note = note;
      this.onSync();
    }
  }

  // ---------- 数据访问 ----------

  listAnnotations(): AnnotationData[] {
    return [...this.annotationEntities.values()].map((e) => {
      const w = e.anchor.getAbsolutePosition();
      return { ...e.data, floor: this.floorOfY(w.y) };
    });
  }

  listPersons(): PersonData[] {
    return [...this.personEntities.values()].map((e) => {
      const w = e.root.getAbsolutePosition();
      return { ...e.data, floor: this.floorOfY(w.y) };
    });
  }

  worldPositionOf(id: string): Vector3 | null {
    const a = this.annotationEntities.get(id);
    if (a) return a.anchor.getAbsolutePosition();
    const p = this.personEntities.get(id);
    if (p) return p.root.getAbsolutePosition();
    return null;
  }

  /** 供 HTML 覆盖层每帧调用:投影锚点到屏幕并应用剖切收缩 */
  getOverlayItems(): OverlayItem[] {
    const items: OverlayItem[] = [];
    const engine = this.engine;
    const w = engine.getRenderWidth();
    const h = engine.getRenderHeight();
    const viewport = this.camera.viewport.toGlobal(w, h);
    const transform = this.scene.getTransformMatrix();
    const camPos = this.camera.position;

    const push = (id: string, kind: 'fault' | 'person', world: Vector3, lines: string[]) => {
      const { pos, clipped } = this.clipAdjust(world);
      const toCam = pos.subtract(camPos);
      const facing = Vector3.Dot(this.camera.getForwardRay().direction, toCam) > 0;
      const sp = Vector3.Project(pos, Matrix.IdentityReadOnly, transform, viewport);
      items.push({
        id,
        kind,
        lines,
        x: sp.x,
        y: sp.y,
        visible: facing && sp.z >= 0 && sp.z <= 1,
        clipped
      });
    };

    for (const e of this.annotationEntities.values()) {
      const wpos = e.anchor.getAbsolutePosition();
      const d = e.data;
      const floor = this.floorOfY(wpos.y);
      push(d.id, 'fault', wpos, [
        `⚠ ${d.partName}`,
        `${floor}F · (${wpos.x.toFixed(2)}, ${wpos.y.toFixed(2)}, ${wpos.z.toFixed(2)})`
      ]);
    }
    for (const e of this.personEntities.values()) {
      const wpos = e.root.getAbsolutePosition().add(new Vector3(0, 1.35, 0));
      const d = e.data;
      push(d.id, 'person', wpos, [`🧍 ${d.label}`, `${this.floorOfY(e.root.getAbsolutePosition().y)}F`]);
    }
    return items;
  }

  // ---------- 相机 ----------

  flyTo(world: Vector3): void {
    const fps = 60;
    const frames = 45;
    const ease = new CubicEase();
    ease.setEasingMode(CubicEase.EASINGMODE_EASEINOUT);
    Animation.CreateAndStartAnimation('flyTarget', this.camera, 'target', fps, frames,
      this.camera.target.clone(), world.clone(), Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
    Animation.CreateAndStartAnimation('flyRadius', this.camera, 'radius', fps, frames,
      this.camera.radius, Math.max(3, this.floorHeight * 1.5), Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
  }

  flyToItem(id: string): void {
    const w = this.worldPositionOf(id);
    if (w) this.flyTo(w.clone());
  }
}
