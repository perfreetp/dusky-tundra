import type { Speaker } from '../types';

const DEG2RAD = Math.PI / 180;
/** 锥外（及任何角度）指向性衰减地板 dB，避免 log 域发散 */
export const DI_FLOOR = -25;
/** 空气吸收简化系数 dB/m（约 2kHz 常温常湿量级，可按需扩展为频率表） */
export const AIR_COEF = 0.008;
/** 距离滚降终点相对覆盖距离的倍数：D -> 2D 滚到地板 */
const RANGE_FALLOFF = 2;

/**
 * 由覆盖半角反算余弦幂次 n，使锥边 theta = halfAngle 处恰为 -6 dB：
 * 20 * n * log10(cos(alpha)) = -6
 */
export function exponentFromHalfAngle(halfAngleDeg: number): number {
  const alpha = Math.min(halfAngleDeg * DEG2RAD, Math.PI / 2 - 0.01);
  return 0.3 / Math.log10(1 / Math.cos(alpha));
}

/** 指向性指数衰减（dB），全角度连续：锥边 -6dB，锥外继续平滑滚降，90° 后触地板 */
export function directivityDb(thetaRad: number, exponent: number): number {
  const c = Math.cos(thetaRad);
  if (c <= 0.05) return DI_FLOOR; // 90° 及背面区域，统一触底
  return Math.max(DI_FLOOR, 20 * exponent * Math.log10(c));
}

/** 音箱前向单位向量（与 three.js Object3D 朝向约定一致：默认 -Z） */
export function forwardVector(sp: Speaker): [number, number, number] {
  const yaw = sp.yaw * DEG2RAD;
  const tilt = sp.tilt * DEG2RAD;
  // 先绕 Y 做 yaw，再绕 X 做俯角（+tilt 向前下方）
  const fx = -Math.sin(yaw) * Math.cos(tilt);
  const fy = -Math.sin(tilt);
  const fz = -Math.cos(yaw) * Math.cos(tilt);
  return [fx, fy, fz];
}

export interface PathInput {
  px: number;
  py: number;
  pz: number;
  exponent: number;
  forward: [number, number, number];
  spl: number;
  range: number;
  airAbsorption: boolean;
}

/**
 * 单个音箱对单个采样点的直达声 SPL（dB）。
 * 反平方距离律 + 连续角度指向性 + 可选空气吸收 + 超覆盖距离滚降。
 */
export function splAtPoint(sp: Speaker, sx: number, sy: number, sz: number, airAbsorption: boolean): number {
  const dx = sx - sp.x;
  const dy = sy - sp.y;
  const dz = sz - sp.z;
  const dist = Math.max(1, Math.hypot(dx, dy, dz));

  const [fx, fy, fz] = forwardVector(sp);
  const cosTheta = (dx * fx + dy * fy + dz * fz) / dist;
  const theta = Math.acos(Math.min(1, Math.max(-1, cosTheta)));

  const exponent = exponentFromHalfAngle(sp.halfAngle);
  const di = directivityDb(theta, exponent);
  const distanceDb = -20 * Math.log10(dist);
  const air = airAbsorption ? -AIR_COEF * dist : 0;

  // 超出覆盖距离：D -> 2D 间线性滚到 DI_FLOOR
  let rangePenalty = 0;
  if (dist > sp.range) {
    const t = Math.min(1, (dist - sp.range) / (sp.range * (RANGE_FALLOFF - 1)));
    rangePenalty = t * DI_FLOOR;
  }

  return sp.spl + distanceDb + di + air + rangePenalty;
}
