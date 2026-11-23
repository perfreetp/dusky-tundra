/**
 * L1 基准姿态缓存。
 * 键：ropeId | floorId | loadBand；LRU 兜底 + 全楼层预计算常驻。
 */
import type { RopePose } from '../model/types';
import { float32Pool, uint8Pool, uint16Pool } from '../perf/arrayPool';
import { quantize } from '../math/interpolate';
import { LOAD_BAND_STEP, MAX_NODES_PER_ROPE } from '../perf/budgets';

export function poseCacheKey(ropeId: string, floorId: string, loadCoeff: number): string {
  return `${ropeId}|${floorId}|${quantize(loadCoeff, LOAD_BAND_STEP).toFixed(2)}`;
}

/** 分配一个容量为 maxNodes 的空姿态对象（数组来自池） */
export function allocatePose(ropeId: string, cacheKey: string): RopePose {
  const cap = MAX_NODES_PER_ROPE;
  return {
    ropeId,
    cacheKey,
    nodeCount: 0,
    positions: float32Pool.acquire(cap * 3),
    tangents: float32Pool.acquire(cap * 3),
    arcFlags: uint8Pool.acquire(cap),
    spanIds: uint16Pool.acquire(cap),
    clearances: float32Pool.acquire(cap),
    tension: float32Pool.acquire(cap),
    version: 0,
  };
}

export function releasePose(pose: RopePose): void {
  float32Pool.release(pose.positions);
  float32Pool.release(pose.tangents);
  uint8Pool.release(pose.arcFlags);
  uint16Pool.release(pose.spanIds);
  float32Pool.release(pose.clearances);
  float32Pool.release(pose.tension);
}

interface CacheEntry {
  pose: RopePose;
  lastAccess: number;
}

export class PoseCache {
  private map = new Map<string, CacheEntry>();
  private clock = 0;
  readonly hits = { hit: 0, miss: 0 };

  get(key: string): RopePose | undefined {
    const e = this.map.get(key);
    if (e) {
      e.lastAccess = ++this.clock;
      this.hits.hit++;
      return e.pose;
    }
    this.hits.miss++;
    return undefined;
  }

  set(key: string, pose: RopePose): void {
    const existing = this.map.get(key);
    if (existing) releasePose(existing.pose);
    this.map.set(key, { pose, lastAccess: ++this.clock });
  }

  /** LRU 淘汰到目标容量 */
  evictTo(maxEntries: number): void {
    if (this.map.size <= maxEntries) return;
    const entries = [...this.map.entries()].sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const remove = this.map.size - maxEntries;
    for (let i = 0; i < remove; i++) {
      const [key, entry] = entries[i]!;
      releasePose(entry.pose);
      this.map.delete(key);
    }
  }

  get size(): number {
    return this.map.size;
  }

  clear(): void {
    for (const e of this.map.values()) releasePose(e.pose);
    this.map.clear();
    this.hits.hit = 0;
    this.hits.miss = 0;
  }
}
