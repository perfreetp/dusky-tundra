import type { SamplePoint, Speaker } from '../types';
import { splAtPoint } from './directivity';

export interface CalcResult {
  /** 每采样点叠加后总 SPL */
  total: Float32Array;
  /** 每点主导音箱序号（-1 = 无有效贡献） */
  dominant: Int16Array;
  /** 行 = 音箱，列 = 采样点的单点 SPL（隔离模式 / tooltip 复用） */
  contributions: Float32Array;
  pointCount: number;
  speakerCount: number;
}

export interface CalcHandle {
  promise: Promise<CalcResult>;
  cancel: () => void;
}

const CHUNK_SIZE = 256;

/** 浏览器用 rAF 让出主线程；无 rAF 环境（Node 单测）回退到宏任务 */
const schedule: (fn: () => void) => number =
  typeof requestAnimationFrame === 'function'
    ? (fn) => requestAnimationFrame(fn)
    : (fn) => setTimeout(fn, 0) as unknown as number;
const cancelSchedule: (id: number) => void =
  typeof cancelAnimationFrame === 'function'
    ? (id) => cancelAnimationFrame(id)
    : (id) => clearTimeout(id);

/** 能量叠加（dB），同时记录主导音箱 */
function sumPoint(
  point: SamplePoint,
  speakers: Speaker[],
  contributions: Float32Array,
  pointIndex: number,
  pointCount: number,
  airAbsorption: boolean,
): { total: number; dominant: number } {
  let energy = 0;
  let dominant = -1;
  let bestSpl = -Infinity;
  for (let s = 0; s < speakers.length; s++) {
    const v = splAtPoint(speakers[s], point.x, point.y, point.z, airAbsorption);
    contributions[s * pointCount + pointIndex] = v;
    energy += 10 ** (v / 10);
    if (v > bestSpl) {
      bestSpl = v;
      dominant = s;
    }
  }
  return { total: energy > 0 ? 10 * Math.log10(energy) : -999, dominant };
}

/**
 * 分块调度计算：每帧处理 CHUNK_SIZE 个采样点，让出主线程保持交互流畅。
 * 参数变更后旧任务通过 cancel() 作废。
 */
export function computeCoverage(
  points: SamplePoint[],
  speakers: Speaker[],
  airAbsorption: boolean,
): CalcHandle {
  const n = points.length;
  const m = speakers.length;
  const total = new Float32Array(n).fill(-999);
  const dominant = new Int16Array(n).fill(-1);
  const contributions = new Float32Array(m * n);

  if (m === 0 || n === 0) {
    return {
      promise: Promise.resolve({ total, dominant, contributions, pointCount: n, speakerCount: m }),
      cancel: () => undefined,
    };
  }

  let cancelled = false;
  let rafId = 0;
  let resolveFn!: (r: CalcResult) => void;
  const promise = new Promise<CalcResult>((resolve) => {
    resolveFn = resolve;
  });

  let cursor = 0;
  const step = () => {
    if (cancelled) return;
    const end = Math.min(n, cursor + CHUNK_SIZE);
    for (let i = cursor; i < end; i++) {
      const r = sumPoint(points[i], speakers, contributions, i, n, airAbsorption);
      total[i] = r.total;
      dominant[i] = r.dominant;
    }
    cursor = end;
    if (cursor >= n) {
      resolveFn({ total, dominant, contributions, pointCount: n, speakerCount: m });
    } else {
      rafId = schedule(step);
    }
  };
  rafId = schedule(step);

  return {
    promise,
    cancel: () => {
      cancelled = true;
      cancelSchedule(rafId);
    },
  };
}

/** 取某采样点贡献最大的前 k 个音箱（序号 + 单点 SPL），按降序 */
export function topContributions(result: CalcResult, pointIndex: number, k = 3): Array<{ speakerIndex: number; spl: number }> {
  const rows: Array<{ speakerIndex: number; spl: number }> = [];
  for (let s = 0; s < result.speakerCount; s++) {
    rows.push({ speakerIndex: s, spl: result.contributions[s * result.pointCount + pointIndex] });
  }
  rows.sort((a, b) => b.spl - a.spl);
  return rows.slice(0, k);
}
