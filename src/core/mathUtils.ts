import type { CurvePoint, Vec3 } from '../types';

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothstep = (t: number): number => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

export const deg2rad = (d: number): number => (d * Math.PI) / 180;
export const rad2deg = (r: number): number => (r * 180) / Math.PI;

/** 确定性 PRNG（mulberry32），保证布局可复现、可导出还原 */
export function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* 单调三次样条（Fritsch–Carlson）—— 生长曲线保证单调，避免开放度回退   */
/* ------------------------------------------------------------------ */

export class MonotoneCurve {
  private xs: number[];
  private ys: number[];
  private ms: number[];

  constructor(points: CurvePoint[]) {
    const sorted = [...points].sort((a, b) => a.gdd - b.gdd);
    this.xs = sorted.map((p) => p.gdd);
    this.ys = sorted.map((p) => clamp(p.open, 0, 1));
    const n = this.xs.length;
    const delta: number[] = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      delta[i] = (this.ys[i + 1] - this.ys[i]) / (this.xs[i + 1] - this.xs[i]);
    }
    this.ms = new Array(n).fill(0);
    if (n === 2) {
      this.ms[0] = this.ms[1] = delta[0];
    } else if (n > 2) {
      this.ms[0] = delta[0];
      this.ms[n - 1] = delta[n - 2];
      for (let i = 1; i < n - 1; i++) {
        if (delta[i - 1] * delta[i] <= 0) {
          this.ms[i] = 0; // 转折点斜率置零
        } else {
          this.ms[i] = (delta[i - 1] + delta[i]) / 2;
        }
      }
      // 限制切线长度，保证区间单调
      for (let i = 0; i < n - 1; i++) {
        if (delta[i] === 0) {
          this.ms[i] = 0;
          this.ms[i + 1] = 0;
        } else {
          const alpha = this.ms[i] / delta[i];
          const beta = this.ms[i + 1] / delta[i];
          const h = Math.hypot(alpha, beta);
          if (h > 3) {
            const tau = 3 / h;
            this.ms[i] = tau * alpha * delta[i];
            this.ms[i + 1] = tau * beta * delta[i];
          }
        }
      }
    }
  }

  get maxX(): number {
    return this.xs[this.xs.length - 1];
  }

  /** 在积温 x 处取开放度，越界按端点钳制 */
  evaluate(x: number): number {
    const { xs, ys, ms } = this;
    if (x <= xs[0]) return ys[0];
    const n = xs.length;
    if (x >= xs[n - 1]) return ys[n - 1];
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (xs[mid] <= x) lo = mid;
      else hi = mid;
    }
    const h = xs[lo + 1] - xs[lo];
    const t = (x - xs[lo]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return clamp(h00 * ys[lo] + h10 * h * ms[lo] + h01 * ys[lo + 1] + h11 * h * ms[lo + 1], 0, 1);
  }

  /** 反查：给定开放度 y，求对应积温 x（用于采收窗口推算），找不到返回 null */
  invert(y: number): number | null {
    const { xs, ys } = this;
    if (y < ys[0] - 1e-6 || y > ys[ys.length - 1] + 1e-6) return null;
    for (let i = 0; i < xs.length - 1; i++) {
      if (y >= ys[i] && y <= ys[i + 1]) {
        // 二分法在该区间内细化
        let lo = xs[i];
        let hi = xs[i + 1];
        for (let k = 0; k < 24; k++) {
          const mid = (lo + hi) / 2;
          if (this.evaluate(mid) < y) lo = mid;
          else hi = mid;
        }
        return (lo + hi) / 2;
      }
    }
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Catmull-Rom 样条 —— 茎秆轻微弯曲路径                                  */
/* ------------------------------------------------------------------ */

function catmull(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const t2 = t * t;
  const t3 = t2 * t;
  const f0 = -0.5 * t3 + t2 - 0.5 * t;
  const f1 = 1.5 * t3 - 2.5 * t2 + 1;
  const f2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
  const f3 = 0.5 * t3 - 0.5 * t2;
  return {
    x: f0 * p0.x + f1 * p1.x + f2 * p2.x + f3 * p3.x,
    y: f0 * p0.y + f1 * p1.y + f2 * p2.y + f3 * p3.y,
    z: f0 * p0.z + f1 * p1.z + f2 * p2.z + f3 * p3.z
  };
}

export function sampleCatmullRom(control: Vec3[], segments: number): Vec3[] {
  const pts: Vec3[] = [];
  const n = control.length;
  const at = (i: number): Vec3 => control[clamp(i, 0, n - 1)];
  for (let i = 0; i < n - 1; i++) {
    const steps = i === n - 2 ? segments : segments - 1;
    for (let s = 0; s < steps; s++) {
      pts.push(catmull(at(i - 1), at(i), at(i + 1), at(i + 2), s / segments));
    }
  }
  pts.push(control[n - 1]);
  return pts;
}

/* ------------------------------------------------------------------ */
/* 颜色插值（线性 RGB）                                                  */
/* ------------------------------------------------------------------ */

export function mixColor(a: Vec3, b: Vec3, t: number): Vec3 {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t)
  };
}

/** 开放度 0→1 的花青素过渡：深红 → 浅粉（幂次曲线让前段保持饱满红色） */
export function anthocyaninMix(deep: Vec3, pale: Vec3, openness: number): Vec3 {
  return mixColor(deep, pale, smoothstep(openness));
}
