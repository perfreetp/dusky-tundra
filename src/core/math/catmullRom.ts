/**
 * Centripetal Catmull-Rom（alpha = 0.5）。
 * 相比 uniform/chordal 参数化，在节点疏密突变时不会过冲或自交。
 * 端点采用切线反射幻影点（P0=2P1-P2, P3=2P2-P1），保证曲线严格经过全部控制点。
 */

/** 计算 centripetal 节点距序列 t_i（ts[0]=0） */
export function centripetalKnots(points: Float32Array, count: number, ts: Float32Array): void {
  ts[0] = 0;
  for (let i = 1; i < count; i++) {
    const dx = points[i * 3]! - points[(i - 1) * 3]!;
    const dy = points[i * 3 + 1]! - points[(i - 1) * 3 + 1]!;
    const dz = points[i * 3 + 2]! - points[(i - 1) * 3 + 2]!;
    // alpha=0.5：弦长的平方根
    ts[i] = ts[i - 1]! + Math.sqrt(Math.hypot(dx, dy, dz));
  }
}

/**
 * 非均匀 Catmull-Rom 单段求值。
 * 控制点 P0..P3（同一数组中的节点下标），节点距 k0..k3，
 * 在 t ∈ [k1, k2] 处求值，写入 out 的分量偏移 o。
 */
export function catmullRomEval(
  p: Float32Array,
  i0: number, i1: number, i2: number, i3: number,
  k0: number, k1: number, k2: number, k3: number,
  t: number,
  out: Float32Array, o: number,
): void {
  const eps = 1e-9;
  for (let c = 0; c < 3; c++) {
    const p0 = p[i0 * 3 + c]!;
    const p1 = p[i1 * 3 + c]!;
    const p2 = p[i2 * 3 + c]!;
    const p3 = p[i3 * 3 + c]!;

    const a1 = ((k1 - t) / (k1 - k0 || eps)) * p0 + ((t - k0) / (k1 - k0 || eps)) * p1;
    const a2 = ((k2 - t) / (k2 - k1 || eps)) * p1 + ((t - k1) / (k2 - k1 || eps)) * p2;
    const a3 = ((k3 - t) / (k3 - k2 || eps)) * p2 + ((t - k2) / (k3 - k2 || eps)) * p3;
    const b1 = ((k2 - t) / (k2 - k0 || eps)) * a1 + ((t - k0) / (k2 - k0 || eps)) * a2;
    const b2 = ((k3 - t) / (k3 - k1 || eps)) * a2 + ((t - k1) / (k3 - k1 || eps)) * a3;
    out[o + c] = ((k2 - t) / (k2 - k1 || eps)) * b1 + ((t - k1) / (k2 - k1 || eps)) * b2;
  }
}

/**
 * 对控制点折线做 centripetal Catmull-Rom 密采样。
 * 输出严格经过每个内部控制点；每段独立处理，幻影端点用切线反射构造。
 * @param ctl 控制点（nodeCount*3）
 * @param samplesPerSeg 每段采样份数
 * @param out 输出数组，容量 >= (1 + (nodeCount-1)*samplesPerSeg)*3
 * @returns 输出节点总数
 */
export function sampleCatmullRom(
  ctl: Float32Array,
  nodeCount: number,
  samplesPerSeg: number,
  out: Float32Array,
): number {
  if (nodeCount < 2) {
    out.set(ctl.subarray(0, nodeCount * 3));
    return nodeCount;
  }

  // 扩展控制点：首尾各加一个切线反射幻影点
  const ext = new Float32Array((nodeCount + 2) * 3);
  ext.set(ctl.subarray(0, nodeCount * 3), 3);
  for (let c = 0; c < 3; c++) {
    // 首幻影 P0 = 2P1 - P2（ext 下标 0；ctl P1 在 ext 下标 1）
    ext[c] = 2 * ext[3 + c]! - ext[6 + c]!;
    // 尾幻影 P_{n+1} = 2P_n - P_{n-1}
    ext[(nodeCount + 1) * 3 + c] =
      2 * ext[nodeCount * 3 + c]! - ext[(nodeCount - 1) * 3 + c]!;
  }
  const knots = new Float32Array(nodeCount + 2);
  centripetalKnots(ext, nodeCount + 2, knots);

  let w = 0;
  out[w++] = ext[3]!;
  out[w++] = ext[4]!;
  out[w++] = ext[5]!;

  // 对每对真实控制点 P1..P2（ext 下标 i, i+1），段索引 i = 1..nodeCount-1
  for (let i = 1; i < nodeCount; i++) {
    const i0 = i - 1;
    const i1 = i;
    const i2 = i + 1;
    const i3 = Math.min(nodeCount + 1, i + 2);
    const k1 = knots[i1]!;
    const k2 = knots[i2]!;
    // s=1 即段末控制点 P2，必须输出（内部控制点因此被严格经过）
    for (let s = 1; s <= samplesPerSeg; s++) {
      const t = k1 + (s / samplesPerSeg) * (k2 - k1);
      catmullRomEval(ext, i0, i1, i2, i3, knots[i0]!, k1, k2, knots[i3]!, t, out, w);
      w += 3;
    }
  }
  return w / 3;
}

/**
 * 端点切线延伸：为与轮缘圆弧 G1 衔接，在端点外构造虚拟控制点。
 * 虚拟点 = 端点 + 切线方向 * chordLen。
 */
export function extendEndpoint(
  endPoint: Float32Array, endIdx: number,
  tangent: Float32Array, tanIdx: number,
  chordLen: number,
  out: Float32Array, outIdx: number,
): void {
  out[outIdx * 3] = endPoint[endIdx * 3]! + tangent[tanIdx * 3]! * chordLen;
  out[outIdx * 3 + 1] = endPoint[endIdx * 3 + 1]! + tangent[tanIdx * 3 + 1]! * chordLen;
  out[outIdx * 3 + 2] = endPoint[endIdx * 3 + 2]! + tangent[tanIdx * 3 + 2]! * chordLen;
}
