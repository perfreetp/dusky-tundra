// 编组站调车作业仿真器 —— 核心领域类型

export interface Vec2 {
  x: number
  z: number
}

/** 拓扑节点（道岔中心、信号点、股道端点等） */
export interface GraphNode {
  id: string
  pos: Vec2
}

export type SwitchState = 0 | 1

/** 道岔：根节点 root，两个方向分支 a / b，当前开通位置 */
export interface SwitchDef {
  id: string
  root: string
  a: string
  b: string
  state: SwitchState
}

/** 拓扑边（一段线路） */
export interface GraphEdge {
  id: string
  /** 所属股道 id */
  trackId: string
  /** 有向端点（无向边，按需要双向遍历） */
  n1: string
  n2: string
  /** 折线采样点（含 n1、n2 端点），世界坐标 x/z */
  polyline: Vec2[]
  /** 边长度（米） */
  length: number
  /** 曲线半径（米），直线为 Infinity */
  radius: number
}

export interface TrackDef {
  id: string
  name: string
  kind: 'receiving' | 'departure' | 'classification' | 'lead' | 'ladder' | 'main'
  /** 按顺序排列的边 id，构成整股道 */
  edgeIds: string[]
  color: number
}

export interface GaugeProfile {
  /** 半宽（米），按高度采样 */
  halfWidths: { y: number; w: number }[]
  /** 高度上限（米） */
  maxHeight: number
}

export interface VehicleStatic {
  id: string
  type: string
  length: number
  width: number
  height: number
  /** 车辆轮廓关键点（相对车辆中心，x 为半宽方向，y 为高度） */
  outline: { x: number; y: number }[]
  /** 是否超限（装载超限货物） */
  outOfGauge: boolean
  color: number
  tare: number
}

/** 车辆在网络上的位置：边 + 沿边偏移（米） */
export interface EdgeLocation {
  edgeId: string
  offset: number
}

/** 轨迹采样点 */
export interface TrajPoint {
  edgeId: string
  offset: number
  pos: Vec2
  /** 沿轨迹累计里程（米） */
  s: number
  /** 该点处切线角（弧度，世界系） */
  heading: number
}

export type MoveStatus = 'idle' | 'moving' | 'waiting' | 'coasting'

/** 车列（连挂在一起的一组车辆，顺序沿运行方向） */
export interface Consist {
  id: string
  vehicleIds: string[]
  /** 第一辆车前端（车钩）位置 */
  head: EdgeLocation
  /** 车列总长（米） */
  totalLength: number
  status: MoveStatus
  /** 当前速度 m/s */
  speed: number
  /** 待执行/执行中的移动令 */
  order: MoveOrder | null
  /** 当前轨迹（采样点数组，按 s 递增） */
  trajectory: TrajPoint[] | null
  /** 前端在轨迹上的累计里程 */
  trajS: number
  /** 等待原因（道岔未开通等） */
  waitReason: string | null
  /** 是否为解钩后自由滑行的后段 */
  isCoasting: boolean
}

export interface MoveOrder {
  id: string
  planId: string
  vehicleId: string
  targetTrackId: string
  /** 目标停车位置（沿目标股道的里程，米） */
  targetOffset: number
  /** 最高限速 m/s */
  maxSpeed: number
  createdAt: number
}

export interface ShuntingJob {
  id: string
  vehicleId: string
  fromTrackId: string
  toTrackId: string
  note: string
  /** 作业类型：摘钩 / 挂运 / 取送 */
  kind: 'uncouple' | 'couple' | 'transfer'
}

export interface ShuntingPlan {
  id: string
  name: string
  description: string
  jobs: ShuntingJob[]
}

/** 车辆运行时状态 */
export interface VehicleRuntime {
  static: VehicleStatic
  consistId: string | null
  location: EdgeLocation
  /** 世界坐标缓存（每帧由仿真写入） */
  worldPos: Vec2
  heading: number
}

export interface YardData {
  version: number
  nodes: GraphNode[]
  switches: SwitchDef[]
  edges: GraphEdge[]
  tracks: TrackDef[]
  gauge: GaugeProfile
  vehicles: VehicleStatic[]
  /** 初始停放：车辆 id -> 停放边与偏移（车列首车前端位置） */
  initialPlacement: Record<string, EdgeLocation>
  plans: ShuntingPlan[]
}

export type SimEventType =
  | 'couple'
  | 'uncouple'
  | 'arrive'
  | 'waiting'
  | 'reroute'
  | 'gauge-violation'
  | 'info'

export interface SimEvent {
  time: number
  type: SimEventType
  message: string
  vehicleIds?: string[]
  trackId?: string
}

/** 连挂判定阈值（米） */
export const COUPLE_THRESHOLD = 0.3
/** 道岔切换后路径重算时限（毫秒） */
export const REROUTE_BUDGET_MS = 200
/** 性能目标车辆数 */
export const PERF_VEHICLE_COUNT = 300
/** 超过该车辆数后启用降级渲染 */
export const PERF_RENDER_THRESHOLD = 200
/** 目标帧率 */
export const TARGET_FPS = 60
