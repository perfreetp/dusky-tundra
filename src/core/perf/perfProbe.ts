/**
 * 性能探针：performance.mark/measure 封装 + 滚动 p50/p95 统计。
 * 非浏览器环境（vitest）自动降级为纯计时。
 */
interface PerfSample {
  p50: number;
  p95: number;
  count: number;
  last: number;
}

const WINDOW = 120;

class PerfProbe {
  private buckets = new Map<string, number[]>();
  private marks = new Map<string, number>();
  counters = new Map<string, number>();
  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  mark(name: string): void {
    this.marks.set(name, this.now());
  }

  measure(name: string, markName?: string): number {
    const start = markName ? this.marks.get(markName) : undefined;
    const t0 = start ?? this.now();
    const elapsed = this.now() - t0;
    this.record(name, elapsed);
    if (markName) this.marks.delete(markName);
    return elapsed;
  }

  record(name: string, ms: number): void {
    let arr = this.buckets.get(name);
    if (!arr) {
      arr = [];
      this.buckets.set(name, arr);
    }
    arr.push(ms);
    if (arr.length > WINDOW) arr.shift();
  }

  increment(counter: string, by = 1): void {
    this.counters.set(counter, (this.counters.get(counter) ?? 0) + by);
  }

  resetCounter(counter: string): void {
    this.counters.set(counter, 0);
  }

  sample(name: string): PerfSample | null {
    const arr = this.buckets.get(name);
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    return {
      p50: sorted[Math.floor(sorted.length * 0.5)]!,
      p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))]!,
      count: sorted.length,
      last: arr[arr.length - 1]!,
    };
  }

  snapshot(): Record<string, PerfSample> {
    const out: Record<string, PerfSample> = {};
    for (const key of this.buckets.keys()) {
      const s = this.sample(key);
      if (s) out[key] = s;
    }
    return out;
  }
}

export const perfProbe = new PerfProbe();
