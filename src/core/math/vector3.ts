/**
 * 无分配向量运算。两条路径：
 *  - 元组 Vec3（配置期、低频）
 *  - Float32Array + offset（热路径，避免任何临时对象）
 */
import type { Vec3 } from '../model/types';

export const v3 = {
  set(out: Vec3, x: number, y: number, z: number): Vec3 {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  },
  copy(out: Vec3, a: Vec3): Vec3 {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  },
  add(out: Vec3, a: Vec3, b: Vec3): Vec3 {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  },
  sub(out: Vec3, a: Vec3, b: Vec3): Vec3 {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  },
  scale(out: Vec3, a: Vec3, s: number): Vec3 {
    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
    return out;
  },
  addScaled(out: Vec3, a: Vec3, b: Vec3, s: number): Vec3 {
    out[0] = a[0] + b[0] * s;
    out[1] = a[1] + b[1] * s;
    out[2] = a[2] + b[2] * s;
    return out;
  },
  dot(a: Vec3, b: Vec3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  },
  cross(out: Vec3, a: Vec3, b: Vec3): Vec3 {
    const ax = a[0], ay = a[1], az = a[2];
    out[0] = ay * b[2] - az * b[1];
    out[1] = az * b[0] - ax * b[2];
    out[2] = ax * b[1] - ay * b[0];
    return out;
  },
  length(a: Vec3): number {
    return Math.hypot(a[0], a[1], a[2]);
  },
  lengthSq(a: Vec3): number {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
  },
  normalize(out: Vec3, a: Vec3): Vec3 {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    out[0] = a[0] / l;
    out[1] = a[1] / l;
    out[2] = a[2] / l;
    return out;
  },
  lerp(out: Vec3, a: Vec3, b: Vec3, t: number): Vec3 {
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
    out[2] = a[2] + (b[2] - a[2]) * t;
    return out;
  },
  distance(a: Vec3, b: Vec3): number {
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  },
};

/** 读取 Float32Array 中 offset 处的向量到元组 */
export function readVec3(arr: Float32Array, offset: number, out: Vec3): Vec3 {
  out[0] = arr[offset * 3]!;
  out[1] = arr[offset * 3 + 1]!;
  out[2] = arr[offset * 3 + 2]!;
  return out;
}

/** 写入元组到 Float32Array offset 处 */
export function writeVec3(arr: Float32Array, offset: number, a: Vec3): void {
  arr[offset * 3] = a[0];
  arr[offset * 3 + 1] = a[1];
  arr[offset * 3 + 2] = a[2];
}

export function vec3FromArray(arr: Float32Array, offset: number): Vec3 {
  return [arr[offset * 3]!, arr[offset * 3 + 1]!, arr[offset * 3 + 2]!];
}
