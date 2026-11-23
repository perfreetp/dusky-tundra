/**
 * 16ms 预算与 LOD 分级常量。
 */
import type { LodLevel, SolveOptions } from '../model/types';

export interface LodSpec {
  /** 单绳目标节点总数 */
  targetNodes: number;
  /** 轮缘包角圆弧采样点数 */
  arcSamples: number;
  /** 自由段目标节点间距（米） */
  spanSpacing: number;
  /** 碰撞迭代上限 */
  collisionIterations: number;
}

export const LOD_SPECS: Record<LodLevel, LodSpec> = {
  high: { targetNodes: 128, arcSamples: 16, spanSpacing: 0.18, collisionIterations: 3 },
  mid: { targetNodes: 64, arcSamples: 12, spanSpacing: 0.35, collisionIterations: 2 },
  low: { targetNodes: 32, arcSamples: 8, spanSpacing: 0.7, collisionIterations: 0 },
};

/** 连续拖动楼层时自动降级，停顿后回升 */
export const LOD_DRAG_LEVEL: LodLevel = 'mid';
export const LOD_SETTLE_MS = 200;

/** p95 超此阈值（毫秒）触发自动降档 */
export const BUDGET_WARN_MS = 14;
export const FRAME_BUDGET_MS = 16;

export const DEFAULT_SOLVE_OPTIONS: SolveOptions = {
  lod: 'mid',
  collisionIterations: LOD_SPECS.mid.collisionIterations,
  collisionMargin: 0.005,
};

/** 绳管径向分段（高/中/低） */
export const RADIAL_SEGMENTS: Record<LodLevel, number> = {
  high: 12,
  mid: 8,
  low: 6,
};

/** 负载系数量化步长（缓存键用） */
export const LOAD_BAND_STEP = 0.05;

/** 单绳最大节点容量（几何缓冲一次分配上限） */
export const MAX_NODES_PER_ROPE = 220;
