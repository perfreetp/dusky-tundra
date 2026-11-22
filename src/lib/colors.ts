/** 应力 -> 颜色:蓝 -> 青 -> 绿 -> 黄 -> 红 渐变 */
export function stressColor(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  // 5 段锚点
  const stops: [number, number, number][] = [
    [0.12, 0.23, 0.95], // 蓝
    [0.0, 0.75, 0.95], // 青
    [0.1, 0.85, 0.3], // 绿
    [0.98, 0.85, 0.1], // 黄
    [0.95, 0.12, 0.08], // 红
  ];
  const seg = Math.min(stops.length - 2, Math.floor(x * (stops.length - 1)));
  const f = x * (stops.length - 1) - seg;
  const a = stops[seg];
  const b = stops[seg + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

/** 把应力数组写成顶点颜色数组(就地写入 out,长度 = n*3) */
export function writeStressColors(
  stress: Float32Array,
  out: Float32Array,
  normalize: number,
): void {
  const inv = normalize > 1e-9 ? 1 / normalize : 0;
  for (let i = 0; i < stress.length; i++) {
    const [r, g, b] = stressColor(stress[i] * inv);
    const j = i * 3;
    out[j] = r;
    out[j + 1] = g;
    out[j + 2] = b;
  }
}

/** 图例用的 CSS 线性渐变 */
export const STRESS_LEGEND_GRADIENT =
  'linear-gradient(to right, rgb(31,59,242), rgb(0,191,242), rgb(26,217,77), rgb(250,217,26), rgb(242,31,20))';
