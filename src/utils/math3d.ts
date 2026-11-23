import type { Vec3 } from '../types';

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const length = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
export const normalize = (a: Vec3): Vec3 => {
  const l = length(a);
  return l < 1e-9 ? [0, 0, 0] : [a[0] / l, a[1] / l, a[2] / l];
};
export const distance = (a: Vec3, b: Vec3): number => length(sub(a, b));

/** 线性插值 */
export const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** 绕 Y 轴旋转向量,yaw 为弧度(CCW,从 +Y 俯视) */
export function rotateY(v: Vec3, yaw: number): Vec3 {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]];
}

/** 颜色 HSL(0-1)转 RGB 十六进制 */
export function hslToHex(h: number, s: number, l: number): number {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
}

/** 分数(0-100)映射到红→黄→绿渐变色 */
export function scoreColor(score: number): number {
  // 0 分红 (h=0),100 分绿 (h=0.33)
  return hslToHex(0.33 * Math.max(0, Math.min(100, score)) / 100, 0.85, 0.5);
}

/** 射线(origin, dir 单位向量)与轴对齐(带 yaw)盒体求交,返回 t 距离,未命中返回 null */
export function rayBoxHit(
  origin: Vec3,
  dir: Vec3,
  center: Vec3,
  size: Vec3,
  yaw = 0,
): number | null {
  // 把射线变换到盒体本地系(逆 yaw)
  const local = rotateY(sub(origin, center), -yaw);
  const localDir = rotateY(dir, -yaw);
  const h: Vec3 = [size[0] / 2, size[1] / 2, size[2] / 2];
  let tmin = -Infinity;
  let tmax = Infinity;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(localDir[i]) < 1e-9) {
      if (local[i] < -h[i] || local[i] > h[i]) return null;
    } else {
      let t1 = (-h[i] - local[i]) / localDir[i];
      let t2 = (h[i] - local[i]) / localDir[i];
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return null;
    }
  }
  if (tmax < 0) return null;
  return tmin >= 0 ? tmin : 0;
}

/** 点是否在盒体范围内(用于邻座查询的粗筛) */
export function pointNearBox(p: Vec3, center: Vec3, size: Vec3, yaw = 0, pad = 0): boolean {
  const local = rotateY(sub(p, center), -yaw);
  return (
    Math.abs(local[0]) <= size[0] / 2 + pad &&
    Math.abs(local[1]) <= size[1] / 2 + pad &&
    Math.abs(local[2]) <= size[2] / 2 + pad
  );
}
