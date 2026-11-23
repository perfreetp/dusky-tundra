/**
 * 插值与折线-平面求交工具。
 */

/** 线性插值 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function quantize(v: number, step: number): number {
  return Math.round(v / step) * step;
}

/**
 * 二分查找折线（positions，nodeCount 个节点）与水平面 y = h 的第一个跨段。
 * 返回交点信息；无跨段返回 null。
 * 假设节点沿绳顺序排列、Y 坐标在跨段内单调。
 */
export interface PlaneIntersection {
  /** 跨段起始节点下标 */
  nodeIndex: number;
  /** 段内插值参数 0..1 */
  t: number;
  /** 交点世界坐标 */
  point: [number, number, number];
}

export function intersectHorizontalPlane(
  positions: Float32Array,
  nodeCount: number,
  h: number,
): PlaneIntersection | null {
  for (let i = 0; i < nodeCount - 1; i++) {
    const y0 = positions[i * 3 + 1]!;
    const y1 = positions[(i + 1) * 3 + 1]!;
    if ((y0 <= h && y1 >= h) || (y0 >= h && y1 <= h)) {
      const denom = y1 - y0;
      const t = Math.abs(denom) < 1e-12 ? 0 : (h - y0) / denom;
      return {
        nodeIndex: i,
        t,
        point: [
          lerp(positions[i * 3]!, positions[(i + 1) * 3]!, t),
          h,
          lerp(positions[i * 3 + 2]!, positions[(i + 1) * 3 + 2]!, t),
        ],
      };
    }
  }
  return null;
}

/** 按长度在折线节点间求归一化位置 ξ（0..1），用于摆幅模态函数 */
export function spanParametric(
  positions: Float32Array,
  start: number,
  end: number,
  nodeIndex: number,
): number {
  let total = 0;
  let acc = 0;
  for (let i = start; i < end; i++) {
    const dx = positions[(i + 1) * 3]! - positions[i * 3]!;
    const dy = positions[(i + 1) * 3 + 1]! - positions[i * 3 + 1]!;
    const dz = positions[(i + 1) * 3 + 2]! - positions[i * 3 + 2]!;
    const seg = Math.hypot(dx, dy, dz);
    total += seg;
    if (i < nodeIndex) acc += seg;
  }
  return total > 0 ? acc / total : 0;
}
