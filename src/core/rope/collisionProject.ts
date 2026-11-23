/**
 * BVH 碰撞检测与局部弯曲修正。
 * 仅在 L1 基准姿态构建期执行完整迭代；弧段节点（arcFlag=1）锁定不动。
 */
import type {
  ClosestHit,
  ColliderProvider,
  RopePose,
  Vec3,
} from '../model/types';
import { refitLocalSpline } from './freeSpanSpline';
import { perfProbe } from '../perf/perfProbe';

const _hit: ClosestHit = { point: [0, 0, 0], distance: 0, faceIndex: -1 };
const _p: Vec3 = [0, 0, 0];
const _p0: Vec3 = [0, 0, 0];
const _p1: Vec3 = [0, 0, 0];

export interface CollisionResult {
  iterations: number;
  maxCorrection: number;
  queryCount: number;
  correctedNodes: number;
}

/**
 * 迭代投影修正。
 * @param pose 基准姿态（就地修改 positions）
 * @param ropeRadius 绳半径
 * @param margin 安全余量
 * @param maxIter 迭代上限（0 = 跳过）
 */
export function solveCollisions(
  pose: RopePose,
  colliders: ColliderProvider,
  ropeRadius: number,
  margin: number,
  maxIter: number,
): CollisionResult {
  const result: CollisionResult = { iterations: 0, maxCorrection: 0, queryCount: 0, correctedNodes: 0 };
  const n = pose.nodeCount;
  const touched = new Set<number>();

  for (let iter = 0; iter < maxIter; iter++) {
    let maxCorr = 0;
    let moved = 0;

    for (let i = 0; i < n; i++) {
      if (pose.arcFlags[i] === 1) continue; // 轮缘锁定
      const o = i * 3;
      _p[0] = pose.positions[o]!;
      _p[1] = pose.positions[o + 1]!;
      _p[2] = pose.positions[o + 2]!;
      if (!colliders.boundsMaybeHit(_p)) continue;

      // 薄片保险：先做段-三角面相交（低 LOD 节点间距大时）
      if (i > 0 && i < n - 1) {
        _p0[0] = pose.positions[o - 3]!;
        _p0[1] = pose.positions[o - 2]!;
        _p0[2] = pose.positions[o - 1]!;
        _p1[0] = pose.positions[o + 3]!;
        _p1[1] = pose.positions[o + 4]!;
        _p1[2] = pose.positions[o + 5]!;
        if (colliders.segmentIntersects(_p0, _p1)) {
          perfProbe.increment('collision.segmentHit');
        }
      }

      const hit = colliders.closestPoint(_p, _hit);
      result.queryCount++;
      if (!hit) continue;

      const required = ropeRadius + margin;
      if (hit.distance >= required) continue;

      // 沿（点 - 最近点）法向推出
      let nx = _p[0] - hit.point[0];
      let ny = _p[1] - hit.point[1];
      let nz = _p[2] - hit.point[2];
      const nl = Math.hypot(nx, ny, nz);
      if (nl < 1e-9) {
        // 点在面内：退化为沿 Y 推出（导轨场景的合理兜底）
        nx = 0;
        ny = 1;
        nz = 0;
      } else {
        nx /= nl;
        ny /= nl;
        nz /= nl;
      }
      const corr = required - hit.distance;
      pose.positions[o] = pose.positions[o]! + nx * corr;
      pose.positions[o + 1] = pose.positions[o + 1]! + ny * corr;
      pose.positions[o + 2] = pose.positions[o + 2]! + nz * corr;
      touched.add(i);
      moved++;
      if (corr > maxCorr) maxCorr = corr;
    }

    result.iterations = iter + 1;
    result.maxCorrection = Math.max(result.maxCorrection, maxCorr);
    result.correctedNodes += moved;

    // 对受影响邻域做局部样条重拟合
    for (const idx of touched) {
      refitLocalSpline(pose.positions, n, idx, 2, pose.arcFlags);
    }
    touched.clear();

    if (maxCorr < 1e-4 || moved === 0) break;
  }

  perfProbe.increment('collision.queries', result.queryCount);
  return result;
}
