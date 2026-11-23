/**
 * 节点净空预计算：基准姿态每个节点到最近碰撞体的距离。
 * 仅在 L1 缓存构建期调用；逐帧摆幅只查此表，零 BVH 开销。
 */
import type { ClosestHit, ColliderProvider, RopePose, Vec3 } from '../model/types';

const _hit: ClosestHit = { point: [0, 0, 0], distance: 0, faceIndex: -1 };
const _p: Vec3 = [0, 0, 0];

export function computeClearanceTable(pose: RopePose, colliders: ColliderProvider): void {
  const n = pose.nodeCount;
  for (let i = 0; i < n; i++) {
    _p[0] = pose.positions[i * 3]!;
    _p[1] = pose.positions[i * 3 + 1]!;
    _p[2] = pose.positions[i * 3 + 2]!;
    const hit = colliders.closestPoint(_p, _hit);
    pose.clearances[i] = hit ? hit.distance : Number.POSITIVE_INFINITY;
  }
}
