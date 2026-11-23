/**
 * 自由段节点生成。
 * 基准绳形采用线性插值 + 悬链下垂偏移（单调、无过冲），
 * 碰撞后的局部弯曲在 collisionProject 中用 Catmull-Rom 邻域重拟合完成。
 */
import type { SpanSegment } from './wrapArc';

/** 按 LOD 间距计算自由段节点数（含两端） */
export function spanNodeCount(length: number, spacing: number, min = 3, max = 60): number {
  return Math.max(min, Math.min(max, Math.round(length / spacing) + 1));
}

/**
 * 采样一段自由 span，写入 outPositions（writeOffset 起），并写 spanIds。
 * @param sagScale 下垂系数（0 = 直线；典型 0.002~0.01，张力越大越小）
 * @returns 写入节点数
 */
export function sampleSpan(
  seg: SpanSegment,
  count: number,
  sagScale: number,
  outPositions: Float32Array,
  writeOffset: number,
  outSpanIds: Uint16Array,
  flagOffset: number,
): number {
  const { from, to } = seg;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  // 下垂方向：水平分量的垂直方向（取全局 -Y 在垂直于绳方向上的投影）
  const sagMagnitude = sagScale * len * len;

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const o = (writeOffset + i) * 3;
    outPositions[o] = from[0] + dx * t;
    outPositions[o + 1] = from[1] + dy * t;
    outPositions[o + 2] = from[2] + dz * t;
    // 抛物线下垂 4h·t(1-t)，中点最大
    const sag = 4 * sagMagnitude * t * (1 - t);
    outPositions[o + 1] = outPositions[o + 1]! - sag;
    outSpanIds[flagOffset + i] = seg.spanId;
  }
  return count;
}

/**
 * 邻域 Catmull-Rom 重拟合：碰撞投影后平滑受影响节点 ±window 的局部弯曲。
 * 就地修改 positions。控制点直接取当前节点（投影后的折线），
 * centripetal 参数化保证不产生新的过冲。
 */
export function refitLocalSpline(
  positions: Float32Array,
  nodeCount: number,
  center: number,
  window: number,
  arcFlags: Uint8Array,
): void {
  const lo = Math.max(1, center - window);
  const hi = Math.min(nodeCount - 2, center + window);
  if (hi <= lo) return;
  // 弧段锁定节点不参与：若邻域内含弧节点则收缩范围
  let l = lo;
  let h = hi;
  while (l <= h && arcFlags[l] === 1) l++;
  while (h >= l && arcFlags[h] === 1) h--;
  if (h - l < 2) return;

  const ctlCount = h - l + 1;
  const ctl = positions.subarray(l * 3, (h + 1) * 3);
  const knots = new Float32Array(ctlCount);
  for (let i = 1; i < ctlCount; i++) {
    const ddx = ctl[i * 3]! - ctl[(i - 1) * 3]!;
    const ddy = ctl[i * 3 + 1]! - ctl[(i - 1) * 3 + 1]!;
    const ddz = ctl[i * 3 + 2]! - ctl[(i - 1) * 3 + 2]!;
    knots[i] = knots[i - 1]! + Math.sqrt(Math.hypot(ddx, ddy, ddz));
  }

  const original = new Float32Array(ctl);
  const tmp = new Float32Array(3);
  for (let i = 1; i < ctlCount - 1; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = i;
    const i2 = Math.min(ctlCount - 1, i + 1);
    const i3 = Math.min(ctlCount - 1, i + 2);
    const t = 0.5 * (knots[i1]! + knots[i2]!);
    const eps = 1e-9;
    for (let c = 0; c < 3; c++) {
      const p0 = original[i0 * 3 + c]!;
      const p1 = original[i1 * 3 + c]!;
      const p2 = original[i2 * 3 + c]!;
      const p3 = original[i3 * 3 + c]!;
      const a1 =
        ((knots[i1]! - t) / (knots[i1]! - knots[i0]! || eps)) * p0 +
        ((t - knots[i0]!) / (knots[i1]! - knots[i0]! || eps)) * p1;
      const a2 =
        ((knots[i2]! - t) / (knots[i2]! - knots[i1]! || eps)) * p1 +
        ((t - knots[i1]!) / (knots[i2]! - knots[i1]! || eps)) * p2;
      const a3 =
        ((knots[i3]! - t) / (knots[i3]! - knots[i2]! || eps)) * p2 +
        ((t - knots[i2]!) / (knots[i3]! - knots[i2]! || eps)) * p3;
      const b1 =
        ((knots[i2]! - t) / (knots[i2]! - knots[i0]! || eps)) * a1 +
        ((t - knots[i0]!) / (knots[i2]! - knots[i0]! || eps)) * a2;
      const b2 =
        ((knots[i3]! - t) / (knots[i3]! - knots[i1]! || eps)) * a2 +
        ((t - knots[i1]!) / (knots[i3]! - knots[i1]! || eps)) * a3;
      tmp[c] =
        ((knots[i2]! - t) / (knots[i2]! - knots[i1]! || eps)) * b1 +
        ((t - knots[i1]!) / (knots[i2]! - knots[i1]! || eps)) * b2;
    }
    const target = (l + i) * 3;
    positions[target] = tmp[0]!;
    positions[target + 1] = tmp[1]!;
    positions[target + 2] = tmp[2]!;
  }
}
