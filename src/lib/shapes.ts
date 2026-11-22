/** 星形等矢量图形在 canvas 与 SVG 间的共享定义(单位坐标,中心在原点) */

export function starPoints(outer = 0.5, inner = 0.22, n = 5): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

export const STAR_SVG_PATH =
  starPoints()
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(4)} ${p[1].toFixed(4)}`)
    .join(' ') + ' Z';

export function drawStar(ctx: CanvasRenderingContext2D): void {
  const pts = starPoints();
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fill();
}
