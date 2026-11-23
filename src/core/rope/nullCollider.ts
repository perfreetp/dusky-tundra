/**
 * 空碰撞体：未导入 GLB / 禁用碰撞时使用，所有查询均无命中。
 */
import type { ClosestHit, ColliderProvider, Vec3 } from '../model/types';

export class NullColliderProvider implements ColliderProvider {
  boundsMaybeHit(_point: Vec3): boolean {
    return false;
  }
  closestPoint(_point: Vec3, _out: ClosestHit): ClosestHit | null {
    return null;
  }
  segmentIntersects(_p0: Vec3, _p1: Vec3): boolean {
    return false;
  }
}
