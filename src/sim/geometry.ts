import type { Vec2 } from '../types'

export const v = (x: number, z: number): Vec2 => ({ x, z })

export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, z: a.z + b.z })
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, z: a.z - b.z })
export const scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, z: a.z * k })

export const dist = (a: Vec2, b: Vec2): number =>
  Math.hypot(a.x - b.x, a.z - b.z)

export const len = (a: Vec2): number => Math.hypot(a.x, a.z)

export const norm = (a: Vec2): Vec2 => {
  const l = Math.hypot(a.x, a.z) || 1
  return { x: a.x / l, z: a.z / l }
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const lerpVec = (a: Vec2, b: Vec2, t: number): Vec2 => ({
  x: lerp(a.x, b.x, t),
  z: lerp(a.z, b.z, t),
})

export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.z * b.z

/** 折线总长度 */
export function polylineLength(points: Vec2[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i])
  return total
}

/**
 * 在折线上按累计里程取点，返回位置与切线角（x-z 平面，相对 +x 轴）。
 * s 超出范围时钳制到对应端点。
 */
export function samplePolyline(
  points: Vec2[],
  s: number,
): { pos: Vec2; heading: number } {
  if (points.length === 1) {
    return { pos: { ...points[0] }, heading: 0 }
  }
  const total = polylineLength(points)
  const clamped = Math.max(0, Math.min(total, s))
  let remaining = clamped
  for (let i = 1; i < points.length; i++) {
    const segLen = dist(points[i - 1], points[i])
    if (remaining <= segLen || i === points.length - 1) {
      const t = segLen === 0 ? 0 : Math.min(1, remaining / segLen)
      const pos = lerpVec(points[i - 1], points[i], t)
      const d = sub(points[i], points[i - 1])
      const heading = Math.atan2(d.z, d.x)
      return { pos, heading }
    }
    remaining -= segLen
  }
  const last = points[points.length - 1]
  const d = sub(last, points[points.length - 2])
  return { pos: { ...last }, heading: Math.atan2(d.z, d.x) }
}

/** 将折线按最大段长重新采样为等距密集点（用于平滑渲染/轨迹） */
export function densify(points: Vec2[], maxSeg: number): Vec2[] {
  const out: Vec2[] = [points[0]]
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const segLen = dist(a, b)
    const n = Math.max(1, Math.ceil(segLen / maxSeg))
    for (let k = 1; k <= n; k++) out.push(lerpVec(a, b, k / n))
  }
  return out
}

/** 角度差，归一化到 [-PI, PI] */
export function angleDelta(a: number, b: number): number {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return d
}

/** 由三点估算圆曲线半径（米），共线时返回 Infinity */
export function curveRadius(p0: Vec2, p1: Vec2, p2: Vec2): number {
  const a = dist(p0, p1)
  const b = dist(p1, p2)
  const c = dist(p0, p2)
  const area = Math.abs(
    (p1.x - p0.x) * (p2.z - p0.z) - (p1.z - p0.z) * (p2.x - p0.x),
  ) / 2
  if (area < 1e-6) return Infinity
  return (a * b * c) / (4 * area)
}

/** 简单唯一 id */
let idCounter = 0
export function uid(prefix = 'id'): string {
  idCounter += 1
  return `${prefix}_${idCounter.toString(36)}_${(Date.now() & 0xffffff).toString(36)}`
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x))
}

/** 限制加减速度的速度积分（m/s），a 为加速度大小 */
export function approachSpeed(
  speed: number,
  target: number,
  accel: number,
  dt: number,
): number {
  if (speed < target) return Math.min(target, speed + accel * dt)
  if (speed > target) return Math.max(target, speed - accel * dt)
  return speed
}

/** 制动距离：当前速度减速到 0 所需距离 */
export function brakingDistance(speed: number, decel: number): number {
  return (speed * speed) / (2 * decel)
}
