/** 一个车架部件(外壳 / 内部梁 / 导入的整体网格) */
export interface MeshPart {
  id: string;
  name: string;
  /** shell=半透明外壳, beam=内部梁(不透明), solid=普通实体 */
  kind: 'shell' | 'beam' | 'solid';
  /** 当前(可能已变形)顶点坐标,长度 = 顶点数 * 3 */
  positions: Float32Array;
  /** 原始(未变形)顶点坐标,用于对比模式与重置 */
  original: Float32Array;
  /** 三角形索引 */
  indices: Uint32Array;
  /** 每顶点材料分区编号 */
  zoneOfVertex: Uint8Array;
  /** 每顶点累积最大应力 (MPa) */
  stress: Float32Array;
}

/** 材料分区:按车架 X 轴向归一化区间划分 */
export interface MaterialZone {
  id: number;
  name: string;
  /** 归一化起点 [0,1] */
  xMin: number;
  /** 归一化终点 [0,1] */
  xMax: number;
  /** 屈服强度 MPa */
  yieldStrength: number;
  /** 分区标识色 */
  color: string;
}

export type AxisName = 'x' | 'y' | 'z';

export interface CollisionPreset {
  name: string;
  dir: [number, number, number];
}

/** 6 个预设碰撞方向 */
export const COLLISION_PRESETS: CollisionPreset[] = [
  { name: '正面碰撞 (-X)', dir: [1, 0, 0] },
  { name: '追尾碰撞 (+X)', dir: [-1, 0, 0] },
  { name: '左侧碰 (-Y)', dir: [0, 1, 0] },
  { name: '右侧碰 (+Y)', dir: [0, -1, 0] },
  { name: '顶部压溃 (-Z)', dir: [0, 0, 1] },
  { name: '底部托底 (+Z)', dir: [0, 0, -1] },
];

export interface CollisionRecord {
  id: number;
  presetName: string;
  dir: [number, number, number];
  impulse: number;
  maxStress: number;
  timeMs: number;
}

export interface FrameStats {
  vertexCount: number;
  triangleCount: number;
  initialVolume: number;
  currentVolume: number;
  maxStress: number;
  maxStressPoint: [number, number, number];
  maxStressZone: string;
  exceededVertices: number;
  lastComputeMs: number;
  collisionCount: number;
}
