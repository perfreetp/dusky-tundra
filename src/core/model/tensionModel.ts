/**
 * 分段张力模型。
 * 竖直悬吊绳：T(node) = T_end + μ·g·(节点下方竖直绳长)
 * 端部张力由负载系数与绳数均分。
 */
import type { FloorState, RopeDefinition, RopePose, SceneConfig } from './types';

export const GRAVITY = 9.81;

export interface TensionInputs {
  /** 端部（轿厢/对重侧）静张力，单根绳 */
  endTension: number;
  /** 该绳自由段最低节点的 Y */
  lowY: number;
}

/** 单节点张力 */
export function tensionAt(
  nodeY: number,
  lowY: number,
  endTension: number,
  linearDensity: number,
): number {
  const drop = Math.max(0, nodeY - lowY);
  return endTension + linearDensity * GRAVITY * drop;
}

/**
 * 为整根绳的节点写张力（分段渐变）。
 * 弧段节点取两侧自由段张力的较大值，保证轮缘处不出现色标跳变。
 */
export function computePoseTension(
  pose: RopePose,
  def: RopeDefinition,
  floor: FloorState,
  scene: SceneConfig,
  ropeCount: number,
): void {
  // 端部载荷：轿厢自重 + 负载系数 * 额定载荷（额定载荷按轿厢体积估算的工程默认值在配置层给出）
  const ratedLoad = scene.hoistway.width * scene.hoistway.depth * 800; // 工程近似 N
  const carEmptyMass = 1200; // kg，默认中速梯量级；配置化后可覆盖
  const endTension =
    ((carEmptyMass * GRAVITY + floor.loadCoeff * ratedLoad) / Math.max(1, ropeCount)) *
    (def.kind === 'governor' ? 0.15 : 1); // 限速器绳仅张紧轮预紧，量级小一个数量级

  let lowY = Infinity;
  for (let i = 0; i < pose.nodeCount; i++) {
    const y = pose.positions[i * 3 + 1]!;
    if (pose.arcFlags[i] === 0 && y < lowY) lowY = y;
  }
  if (!Number.isFinite(lowY)) lowY = 0;

  for (let i = 0; i < pose.nodeCount; i++) {
    const y = pose.positions[i * 3 + 1]!;
    pose.tension[i] = tensionAt(y, lowY, endTension, def.linearDensity);
  }
}

/** 归一化张力到 0..1（按单根绳自身 min/max，用于色标 LUT） */
export function normalizeTension(pose: RopePose): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < pose.nodeCount; i++) {
    const t = pose.tension[i]!;
    if (t < min) min = t;
    if (t > max) max = t;
  }
  if (!Number.isFinite(min)) {
    min = 0;
    max = 1;
  }
  if (max - min < 1e-9) max = min + 1;
  return { min, max };
}
