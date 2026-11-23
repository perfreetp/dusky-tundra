// 评分服务:管理 Worker 生命周期、消息协议与进度回调
import type { ScoreProgress, ScoreRequest, ScoreResponse, SeatScore } from '../types';
import ScoreWorker from '../workers/score.worker.ts?worker';

export interface ScoreServiceCallbacks {
  onProgress?: (p: ScoreProgress) => void;
  onDone?: (r: ScoreResponse) => void;
  onError?: (e: Error) => void;
}

export class SeatScoreService {
  private worker: Worker | null = null;

  get running(): boolean {
    return this.worker !== null;
  }

  run(req: ScoreRequest, cb: ScoreServiceCallbacks): void {
    this.cancel();
    const worker = new ScoreWorker();
    this.worker = worker;
    worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data;
      if (msg.type === 'progress') {
        cb.onProgress?.(msg.progress as ScoreProgress);
      } else if (msg.type === 'done') {
        cb.onDone?.(msg.response as ScoreResponse);
        this.teardown(worker);
      }
    };
    worker.onerror = (e) => {
      cb.onError?.(new Error(e.message));
      this.teardown(worker);
    };
    worker.postMessage(req);
  }

  cancel(): void {
    if (this.worker) this.teardown(this.worker);
  }

  private teardown(worker: Worker): void {
    worker.terminate();
    if (this.worker === worker) this.worker = null;
  }
}

/** 统计摘要,供 UI 展示 */
export function summarizeScores(results: SeatScore[]): {
  count: number;
  avg: number;
  min: number;
  max: number;
  blockedSeats: number;
} {
  if (results.length === 0) return { count: 0, avg: 0, min: 0, max: 0, blockedSeats: 0 };
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;
  let blockedSeats = 0;
  for (const r of results) {
    sum += r.score;
    min = Math.min(min, r.score);
    max = Math.max(max, r.score);
    if (r.score < 60) blockedSeats++;
  }
  return {
    count: results.length,
    avg: Math.round(sum / results.length),
    min,
    max,
    blockedSeats,
  };
}
