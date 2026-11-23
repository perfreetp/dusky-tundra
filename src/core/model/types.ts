/**
 * 领域类型定义。纯数据、无 three 依赖，可在 Worker / Node 中直接使用。
 * 坐标约定：单位米，Y 轴向上，原点位于底坑中心。
 */

export type Vec3 = [number, number, number];

export type RopeKind = 'traction' | 'governor' | 'compensation';

/** 绳轮类型：曳引轮 / 限速器轮 / 反绳轮 / 张紧轮 */
export type SheaveKind = 'traction' | 'governor' | 'return' | 'tension';

export interface HoistwayConfig {
  /** 底坑深度（原点到底坑地面以下参考面） */
  pitDepth: number;
  /** 顶层高度 */
  headroomHeight: number;
  /** 轿厢总行程 */
  travel: number;
  width: number;
  depth: number;
}

export interface SheaveParam {
  id: string;
  kind: SheaveKind;
  /** 轮心世界坐标 */
  center: Vec3;
  /** 轮轴单位向量 */
  axis: Vec3;
  /** 节圆半径（绳中心轨迹半径） */
  pitchRadius: number;
  /** 绳槽数 */
  grooveCount: number;
  /** 槽间距（沿轮轴方向） */
  groovePitch: number;
  /** 首槽相对轮心沿轴方向的偏移 */
  firstGrooveOffset: number;
  /** 包角绕行方向 */
  wrapSign: 1 | -1;
  /** GLB 中对应的碰撞网格名（可选） */
  colliderNode?: string;
}

export interface AnchorParam {
  id: string;
  /** 静态锚点坐标；follower 为空时使用 */
  position: Vec3;
  /** 动态跟随对象（轿厢顶 / 对重顶 / 张紧轮） */
  follower?: 'car' | 'counterweight' | 'tensionSheave';
}

export interface RailParam {
  id: string;
  /** 导轨中心线（竖直直线）的 XZ 位置 */
  base: Vec3;
  /** 导轨高度方向跨度 */
  height: number;
  /** 导轨半宽，用于内置碰撞体生成 */
  halfWidth: number;
}

export interface CarParam {
  /** 轿厢参考点（悬吊点）相对底坑原点的偏移 */
  hangerOffset: Vec3;
  /** 轿厢高度 */
  height: number;
  /** 轿厢外形半尺寸 */
  halfExtents: Vec3;
}

export interface CounterweightParam {
  hangerOffset: Vec3;
  height: number;
  halfExtents: Vec3;
  /** 1:1 时为 1，2:1 时为 0.5 —— 对重位移相对轿厢位移的系数 */
  motionRatio: number;
}

export interface SceneConfig {
  version: 1;
  units: 'meter';
  upAxis: 'Y';
  hoistway: HoistwayConfig;
  sheaves: SheaveParam[];
  anchors: AnchorParam[];
  rails: RailParam[];
  car: CarParam;
  counterweight: CounterweightParam;
}

export type RopeStation =
  | { type: 'anchor'; anchorId: string }
  | { type: 'sheave'; sheaveId: string; grooveIndex: number; wrap?: 'short' | 'full' }
  | { type: 'span'; toAnchorId?: string; toFollower?: 'car' | 'counterweight' | 'tensionSheave' };

export interface SwingParams {
  /** 基准摆幅（米） */
  baseAmplitude: number;
  /** 阻尼系数 */
  damping: number;
  /** 初相位 */
  phase: number;
  /** 摆动方向单位向量 */
  lateralDir: Vec3;
}

export interface RopeDefinition {
  id: string;
  kind: RopeKind;
  /** 绳半径（渲染与碰撞共用） */
  radius: number;
  /** 线密度 μ kg/m */
  linearDensity: number;
  /** 有序站点，决定绳拓扑 */
  stations: RopeStation[];
  swing: SwingParams;
}

export interface FloorState {
  floorId: string;
  label: string;
  /** 归一化行程位置 0..1 */
  position: number;
  carY: number;
  counterweightY: number;
  /** 标称速度 m/s */
  speed: number;
  acceleration: number;
  loadCoeff: number;
  /** 每根绳该档位总绳长（可由档位表直接给定） */
  ropeLengths: Record<string, number>;
}

export interface RuntimeSettings {
  selectedFloorId: string;
  loadOverride: number | null;
  /** null = 不剖切 */
  clipHeight: number | null;
  ropeOpacity: number;
  lodLevel: LodLevel;
  showSectionMarkers: boolean;
  showTensionColor: boolean;
  playing: boolean;
}

export type LodLevel = 'high' | 'mid' | 'low';

/**
 * 绳姿态缓存对象。所有数组均池化，按 (ropeId, nodeCount) 借还。
 * positions/tangents 长度均为 nodeCount*3。
 */
export interface RopePose {
  ropeId: string;
  cacheKey: string;
  nodeCount: number;
  positions: Float32Array<ArrayBufferLike>;
  tangents: Float32Array<ArrayBufferLike>;
  /** 1 = 轮缘弧段锁定节点（禁止投影修正、禁止封口） */
  arcFlags: Uint8Array<ArrayBufferLike>;
  /** 节点所属自由段编号，0xFFFF 表示弧段/锚点 */
  spanIds: Uint16Array<ArrayBufferLike>;
  /** 每节点到最近碰撞体的净空（已扣绳半径前的原始距离） */
  clearances: Float32Array<ArrayBufferLike>;
  /** 每节点张力 N */
  tension: Float32Array<ArrayBufferLike>;
  version: number;
}

/** 碰撞查询抽象：core 不依赖 three，由 three 层 BvhRegistry 实现 */
export interface ColliderProvider {
  /** AABB 粗筛，返回该点附近是否可能存在碰撞体 */
  boundsMaybeHit(point: Vec3): boolean;
  /** 最近点查询；无命中返回 null */
  closestPoint(
    point: Vec3,
    out: ClosestHit,
  ): ClosestHit | null;
  /** 线段 p0->p1 是否与任一碰撞三角面相交 */
  segmentIntersects(p0: Vec3, p1: Vec3): boolean;
}

export interface ClosestHit {
  point: Vec3;
  /** 查询点到碰撞面的距离 */
  distance: number;
  faceIndex: number;
}

export interface SolveOptions {
  lod: LodLevel;
  /** 碰撞迭代上限（0 = 仅净空钳制） */
  collisionIterations: number;
  /** 碰撞安全余量（米） */
  collisionMargin: number;
}
