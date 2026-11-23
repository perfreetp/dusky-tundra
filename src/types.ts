// 全局共享类型定义

/** 三维向量(three 与 manifold 之间保持纯数据交换) */
export type Vec3 = [number, number, number];

/** 座席分区定义:一片矩形/扇形看台 */
export interface SeatSectionConfig {
  id: string;
  name: string;
  /** 分区基色(十六进制) */
  color: number;
  /** 看台类型:直线看台 / 弧形看台 */
  kind: 'straight' | 'arc';
  /** 排数 */
  rows: number;
  /** 每排座席数 */
  cols: number;
  /** 排间距(米,沿深度方向) */
  rowSpacing: number;
  /** 座席间距(米,沿排方向) */
  colSpacing: number;
  /** 每排抬升高度(米) */
  rowRise: number;
  /** 座席所在地面高度(米,第一排) */
  baseHeight: number;
  /** 第一排第一个座席的位置 */
  origin: Vec3;
  /** straight:排延伸方向(单位向量);arc:圆心方向由 arcCenter 给出 */
  alongDir?: Vec3;
  /** 深度方向(排推进方向,单位向量,水平分量) */
  depthDir: Vec3;
  /** arc 类型:圆心与起始角/扫角(弧度) */
  arcCenter?: Vec3;
  arcStart?: number;
  arcAngle?: number;
  /** arc 类型下沿弧方向每排座席数对应的弧长由 colSpacing 决定 */
}

/** 单个座席的运行时数据 */
export interface Seat {
  /** 全局唯一编号 */
  id: number;
  sectionId: string;
  row: number;
  col: number;
  /** 座面中心位置(地面/台阶面) */
  position: Vec3;
  /** 就坐眼位(座面 + 坐姿眼高) */
  eye: Vec3;
  /** 分区默认色 */
  sectionColor: number;
}

/** 结构实体遮挡物定义(用于 manifold 布尔与 three 射线) */
export interface OccluderBox {
  kind: 'box';
  /** 中心位置 */
  center: Vec3;
  /** 全尺寸(米) */
  size: Vec3;
  /** 绕 Y 偏航角(弧度),栏杆沿排布置时使用 */
  yaw?: number;
  /** 语义标签:栏杆 / 墙体 / 舞台结构 / 前排观众 */
  tag: 'rail' | 'wall' | 'stage' | 'spectator';
  label?: string;
}

export type Occluder = OccluderBox;

/** 舞台/场地关键观测点 */
export interface ViewTarget {
  id: string;
  label: string;
  position: Vec3;
  kind: 'stage' | 'field';
}

/** 座席视野评分结果 */
export interface SeatScore {
  seatId: number;
  /** 0-100 综合分 */
  score: number;
  /** 每个目标点的遮挡情况 */
  perTarget: { targetId: string; blocked: boolean; blockerLabel?: string }[];
  /** 被前排观众遮挡的目标数 */
  spectatorBlocked: number;
}

/** 导出/导入的座席清单文件格式 */
export interface SeatListFile {
  format: 'venue-seat-list/v1';
  exportedAt: string;
  venueName: string;
  eyeHeight: number;
  seats: {
    seatId: number;
    sectionId: string;
    row: number;
    col: number;
    position: Vec3;
    score?: number;
  }[];
}

/** Worker 评分任务消息 */
export interface ScoreRequest {
  seats: { id: number; eye: Vec3 }[];
  targets: ViewTarget[];
  occluders: Occluder[];
  /** 前排观众代理(随座席行变化,按座席 id 给出) */
  spectatorProxies: { seatId: number; boxes: OccluderBox[] }[];
  eyeHeight: number;
  channelRadius: number;
}

export interface ScoreProgress {
  done: number;
  total: number;
}

export interface ScoreResponse {
  results: SeatScore[];
  elapsedMs: number;
}
