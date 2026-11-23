/**
 * BVH 碰撞体注册中心。
 * 把 three-mesh-bvh 的 MeshBVH 适配为 core 的 ColliderProvider；
 * 查询在网格局部空间进行，刚体平移不触发 rebuild。
 */
import * as THREE from 'three';
import { MeshBVH, SAH, acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import type { ClosestHit, ColliderProvider, Vec3 } from '../../core/model/types';

// 安装 three-mesh-bvh 原型扩展（模块副作用，幂等）
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export interface RegisteredCollider {
  name: string;
  mesh: THREE.Mesh;
  bvh: MeshBVH;
  /** 复用临时对象，避免查询分配 */
  localPoint: THREE.Vector3;
  localHit: THREE.Vector3;
  worldHit: THREE.Vector3;
}

export class BvhRegistry implements ColliderProvider {
  private colliders: RegisteredCollider[] = [];
  /** 全局粗筛包围盒（世界空间） */
  private worldBox = new THREE.Box3();
  private tmpBox = new THREE.Box3();

  register(name: string, mesh: THREE.Mesh): RegisteredCollider {
    if (!mesh.geometry.boundsTree) {
      mesh.geometry.boundsTree = new MeshBVH(mesh.geometry, {
        strategy: SAH,
        maxDepth: 40,
        targetLeafSize: 8,
        verbose: false,
      });
    }
    const entry: RegisteredCollider = {
      name,
      mesh,
      bvh: mesh.geometry.boundsTree as MeshBVH,
      localPoint: new THREE.Vector3(),
      localHit: new THREE.Vector3(),
      worldHit: new THREE.Vector3(),
    };
    this.colliders.push(entry);
    this.rebuildWorldBox();
    return entry;
  }

  unregister(name: string): void {
    const idx = this.colliders.findIndex((c) => c.name === name);
    if (idx >= 0) this.colliders.splice(idx, 1);
    this.rebuildWorldBox();
  }

  clear(): void {
    this.colliders.length = 0;
    this.worldBox.makeEmpty();
  }

  get count(): number {
    return this.colliders.length;
  }

  private rebuildWorldBox(): void {
    this.worldBox.makeEmpty();
    for (const c of this.colliders) {
      c.mesh.updateWorldMatrix(true, false);
      this.tmpBox.setFromObject(c.mesh);
      this.worldBox.union(this.tmpBox);
    }
  }

  /** 每帧刚体移动后刷新粗筛盒（BVH 本身不 rebuild） */
  updateWorldBox(): void {
    this.rebuildWorldBox();
  }

  boundsMaybeHit(point: Vec3): boolean {
    if (this.colliders.length === 0) return false;
    return (
      point[0] >= this.worldBox.min.x &&
      point[0] <= this.worldBox.max.x &&
      point[1] >= this.worldBox.min.y &&
      point[1] <= this.worldBox.max.y &&
      point[2] >= this.worldBox.min.z &&
      point[2] <= this.worldBox.max.z
    );
  }

  closestPoint(point: Vec3, out: ClosestHit): ClosestHit | null {
    if (this.colliders.length === 0) return null;
    const wp = _world.set(point[0], point[1], point[2]);
    let best: { distance: number; faceIndex: number; world: THREE.Vector3 } | null = null;

    for (const c of this.colliders) {
      c.localPoint.copy(wp);
      c.mesh.worldToLocal(c.localPoint);
      const hit = c.bvh.closestPointToPoint(c.localPoint, {
        point: c.localHit,
        distance: Infinity,
        faceIndex: -1,
      });
      if (!hit) continue;
      c.worldHit.copy(hit.point);
      c.mesh.localToWorld(c.worldHit);
      const d = c.worldHit.distanceTo(wp);
      if (!best || d < best.distance) {
        best = { distance: d, faceIndex: hit.faceIndex, world: c.worldHit };
      }
    }

    if (!best) return null;
    out.point[0] = best.world.x;
    out.point[1] = best.world.y;
    out.point[2] = best.world.z;
    out.distance = best.distance;
    out.faceIndex = best.faceIndex;
    return out;
  }

  segmentIntersects(p0: Vec3, p1: Vec3): boolean {
    if (this.colliders.length === 0) return false;
    const a = _segA.set(p0[0], p0[1], p0[2]);
    const b = _segB.set(p1[0], p1[1], p1[2]);

    for (const c of this.colliders) {
      const localA = c.mesh.worldToLocal(a.clone());
      const localB = c.mesh.worldToLocal(b.clone());
      const localDir = localB.sub(localA);
      const localLen = localDir.length();
      if (localLen < 1e-9) continue;
      const localRay = new THREE.Ray(localA, localDir.normalize());
      const hit = c.bvh.raycastFirst(localRay);
      // Ray 无 far 属性：用命中点距离与线段长度比较
      if (hit && hit.distance <= localLen) return true;
    }
    return false;
  }
}

const _world = new THREE.Vector3();
const _segA = new THREE.Vector3();
const _segB = new THREE.Vector3();
