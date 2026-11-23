// 座席视野评分 Worker:对每个座席用 manifold 几何布尔判断视线通道是否被挡
import type { OccluderBox, ScoreRequest, ScoreResponse, ScoreProgress, SeatScore, Vec3 } from '../types';
import {
  buildBlockerSet,
  buildBlockerUnion,
  channelBlocked,
  channelBlockedBySet,
  createSightChannel,
  initManifoldGeometry,
  type BlockerSet,
  type Manifold,
} from '../geometry/manifold-service';
import { normalize, rayBoxHit, sub } from '../utils/math3d';

let geometryReady: Promise<void>;

/** 中心射线对一批盒体做代数预筛,返回是否存在命中(零几何成本) */
function rayHitsAny(eye: Vec3, target: Vec3, boxes: OccluderBox[]): boolean {
  const dir = normalize(sub(target, eye));
  const targetDist = Math.hypot(target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]);
  for (const box of boxes) {
    const t = rayBoxHit(eye, dir, box.center, box.size, box.yaw ?? 0);
    if (t !== null && t <= targetDist) return true;
  }
  return false;
}

interface CachedBlockers {
  structural: BlockerSet;
  /** 结构原始盒体,用于中心射线代数预筛 */
  structuralBoxes: OccluderBox[];
  /** 观众代理原始盒体(按座席),manifold 懒加载缓存 */
  spectatorBoxes: Map<number, ScoreRequest['spectatorProxies'][number]['boxes']>;
  spectatorUnions: Map<number, Manifold>;
}

/** 结构实体只构建一次;观众代理 manifold 在真正需要时才构建并缓存 */
function prepareBlockers(req: ScoreRequest): CachedBlockers {
  const structural = buildBlockerSet(req.occluders);
  const spectatorBoxes = new Map<number, ScoreRequest['spectatorProxies'][number]['boxes']>();
  for (const g of req.spectatorProxies) spectatorBoxes.set(g.seatId, g.boxes);
  return {
    structural,
    structuralBoxes: req.occluders,
    spectatorBoxes,
    spectatorUnions: new Map(),
  };
}

function disposeBlockers(cached: CachedBlockers): void {
  cached.structural.union.delete();
  for (const t of cached.structural.tagged) t.manifold.delete();
  for (const u of cached.spectatorUnions.values()) u.delete();
}

/**
 * 综合评分:
 * - 每个目标点权重相同,完全可见得满分;
 * - 被栏杆/墙体等结构挡住计 0 分;被前排观众挡住计半分(可从人缝间部分看到);
 * - 最终归一到 0-100。
 * 两层判定:
 *   1. 中心射线代数预筛(零几何成本),射线都不命中则视线通道必然不相交,直接判可见;
 *   2. 射线命中时才构建 manifold 圆柱通道做几何布尔,保证"有厚度"视线的判定精度。
 */
function scoreSeat(
  eye: ScoreRequest['seats'][number]['eye'],
  req: ScoreRequest,
  cached: CachedBlockers,
  seatId: number,
): SeatScore {
  const perTarget: SeatScore['perTarget'] = [];
  let spectatorBlocked = 0;
  let score = 0;

  for (const target of req.targets) {
    // —— 第一层:代数射线预筛 ——
    const structuralRayHit = rayHitsAny(eye, target.position, cached.structuralBoxes);
    const specBoxes = cached.spectatorBoxes.get(seatId);
    const spectatorRayHit = !structuralRayHit && specBoxes
      ? rayHitsAny(eye, target.position, specBoxes)
      : false;

    // 射线都不命中:有厚度的圆柱通道更不可能相交,无需 manifold 布尔
    if (!structuralRayHit && !spectatorRayHit) {
      score += 1;
      perTarget.push({ targetId: target.id, blocked: false });
      continue;
    }

    // —— 第二层:manifold 几何布尔精确判定 ——
    const channel = createSightChannel(eye, target.position, req.channelRadius);
    let blockerLabel: string | null = null;
    if (structuralRayHit) {
      blockerLabel = channelBlockedBySet(channel, cached.structural);
    }
    if (blockerLabel === null && spectatorRayHit && specBoxes) {
      let union = cached.spectatorUnions.get(seatId);
      if (!union) {
        union = buildBlockerUnion(specBoxes);
        cached.spectatorUnions.set(seatId, union);
      }
      if (channelBlocked(channel, union)) {
        blockerLabel = '前排观众';
        spectatorBlocked++;
      }
    }
    channel.delete();

    // 射线命中但圆柱布尔未命中(擦边):视为可见
    const blocked = blockerLabel !== null;
    if (!blocked) score += 1;
    else if ((blockerLabel as string).includes('观众')) score += 0.5;

    perTarget.push({
      targetId: target.id,
      blocked,
      blockerLabel: blocked ? (blockerLabel as string) : undefined,
    });
  }

  return {
    seatId,
    score: Math.round((score / req.targets.length) * 100),
    perTarget,
    spectatorBlocked,
  };
}

self.onmessage = async (ev: MessageEvent<ScoreRequest>) => {
  geometryReady ??= initManifoldGeometry();
  await geometryReady;
  const req = ev.data;
  const t0 = performance.now();
  const cached = prepareBlockers(req);
  const results: SeatScore[] = [];
  const total = req.seats.length;
  const PROGRESS_EVERY = Math.max(1, Math.floor(total / 40));

  for (let i = 0; i < total; i++) {
    const s = req.seats[i];
    results.push(scoreSeat(s.eye, req, cached, s.id));
    if (i % PROGRESS_EVERY === 0 || i === total - 1) {
      const progress: ScoreProgress = { done: i + 1, total };
      (self as unknown as Worker).postMessage({ type: 'progress', progress });
    }
  }

  disposeBlockers(cached);
  const response: ScoreResponse = { results, elapsedMs: performance.now() - t0 };
  (self as unknown as Worker).postMessage({ type: 'done', response });
};
