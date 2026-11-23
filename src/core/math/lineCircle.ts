/**
 * 线/点-圆切线解析解（轮缘包角核心）。
 * 全部在绳平面（过槽位点、法向为轮轴）内进行。
 */
import type { Vec3 } from '../model/types';
import { v3 } from './vector3';

export interface PlaneFrame {
  /** 槽位点（绳平面内的圆心） */
  center: Vec3;
  /** 平面内正交基 e_u, e_v（均单位向量） */
  eU: Vec3;
  eV: Vec3;
}

/**
 * 由轮心、轮轴与槽位点构造绳平面基架。
 * e_u 取参考方向在平面内的投影归一化（曳引轮通常取全局 X 或入绳方向），
 * e_v = axis × e_u，保证 (e_u, e_v, axis) 正交。
 */
export function buildPlaneFrame(
  grooveCenter: Vec3,
  axis: Vec3,
  referenceDir: Vec3,
  out: PlaneFrame,
): PlaneFrame {
  out.center[0] = grooveCenter[0];
  out.center[1] = grooveCenter[1];
  out.center[2] = grooveCenter[2];
  // e_u = referenceDir - (referenceDir·axis)axis
  const d = v3.dot(referenceDir, axis);
  out.eU[0] = referenceDir[0] - axis[0] * d;
  out.eU[1] = referenceDir[1] - axis[1] * d;
  out.eU[2] = referenceDir[2] - axis[2] * d;
  v3.normalize(out.eU, out.eU);
  // e_v = axis × e_u
  v3.cross(out.eV, axis, out.eU);
  v3.normalize(out.eV, out.eV);
  return out;
}

/** 平面内坐标 -> 世界坐标：P = C + x·e_u + y·e_v */
export function planeToWorld(frame: PlaneFrame, x: number, y: number, out: Vec3): Vec3 {
  out[0] = frame.center[0] + x * frame.eU[0] + y * frame.eV[0];
  out[1] = frame.center[1] + x * frame.eU[1] + y * frame.eV[1];
  out[2] = frame.center[2] + x * frame.eU[2] + y * frame.eV[2];
  return out;
}

/** 世界坐标 -> 平面内 (x, y) */
export function worldToPlane(frame: PlaneFrame, p: Vec3): [number, number] {
  const dx = p[0] - frame.center[0];
  const dy = p[1] - frame.center[1];
  const dz = p[2] - frame.center[2];
  return [
    dx * frame.eU[0] + dy * frame.eU[1] + dz * frame.eU[2],
    dx * frame.eV[0] + dy * frame.eV[1] + dz * frame.eV[2],
  ];
}

export interface TangentPoints {
  /** 两个切点的平面内角 θ1, θ2 */
  theta1: number;
  theta2: number;
}

/**
 * 外点 A（平面内坐标 ax, ay）对圆 |X-C|=R 的两条切线切点角。
 * δ = acos(R / |A-C|)，base = atan2(ay, ax)。
 * 调用方需保证点在圆外（dist > R）。
 */
export function tangentAngles(ax: number, ay: number, radius: number): TangentPoints {
  const dist = Math.hypot(ax, ay);
  if (dist <= radius) {
    // 点在圆内/圆上：退化为指向该点的径向角（理论上绳拓扑不会出现）
    const t = Math.atan2(ay, ax);
    return { theta1: t, theta2: t };
  }
  const base = Math.atan2(ay, ax);
  const delta = Math.acos(Math.min(1, radius / dist));
  return { theta1: base + delta, theta2: base - delta };
}

/**
 * 竖直悬挂特例：自由段为竖直线 x = xLine。
 * 切点角直接为 ±π/2（相对 e_v 方向），零分叉、无 acos 数值问题。
 * 返回沿直线方向的两个候选切点角，调用方按绕行方向选取。
 */
export function verticalTangentAngles(xLine: number, _radius: number): { left: number; right: number } {
  void _radius;
  // 直线 x=xLine 与圆相切要求 |xLine|=R；一般取 sign 决定左右切点
  const sign = xLine >= 0 ? 1 : -1;
  return {
    left: sign * (Math.PI / 2),
    right: sign * (-Math.PI / 2),
  };
}

/** 按平面内角 θ 取圆上点（世界坐标） */
export function pointOnCircle(frame: PlaneFrame, radius: number, theta: number, out: Vec3): Vec3 {
  return planeToWorld(frame, radius * Math.cos(theta), radius * Math.sin(theta), out);
}

/**
 * 计算从 θIn 到 θOut 沿 wrapSign 方向的实际包角（带符号），
 * 结果落在 (-2π, 2π)。full 模式强制取大于 π 的绕行。
 */
export function wrapAngle(thetaIn: number, thetaOut: number, wrapSign: 1 | -1, full: boolean): number {
  let delta = thetaOut - thetaIn;
  // 归一化到 (-2π, 2π) 并选择与 wrapSign 同向的解
  while (wrapSign * delta <= 0) {
    delta += wrapSign * Math.PI * 2;
  }
  if (full && Math.abs(delta) < Math.PI) {
    delta += wrapSign * Math.PI * 2;
  }
  return delta;
}
