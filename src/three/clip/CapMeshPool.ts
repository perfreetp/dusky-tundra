/**
 * 剖切封口圆盘池 + 防穿轮三规则：
 *  1) 弧段抑制：交点节点 arcFlag=1（落在绳轮包角区）→ 隐藏封口（轮体自身遮挡开口）
 *  2) 净空收缩：自由段按节点净空把封口半径收缩为 max(0, clearance - margin)，归零则隐藏
 *  3) 平面内推开：邻近碰撞体时圆心在剖切平面内二维平移至无重叠，高度不变
 */
import * as THREE from 'three';
import type { RopePose } from '../../core/model/types';
import { intersectHorizontalPlane } from '../../core/math/interpolate';
import { RENDER_ORDER } from '../render/renderOrder';

export interface CapPlacementOptions {
  margin: number;
}

export class CapMeshPool {
  private items: THREE.Mesh[] = [];
  private capacity: number;

  constructor(capacity: number, material: THREE.Material) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const geo = new THREE.CircleGeometry(1, 24);
      const mesh = new THREE.Mesh(geo, material);
      mesh.rotation.x = -Math.PI / 2; // 法线朝 +Y
      mesh.visible = false;
      mesh.renderOrder = RENDER_ORDER.CAP;
      this.items.push(mesh);
    }
  }

  update(
    poses: Map<string, RopePose>,
    rendered: Map<string, Float32Array>,
    radii: Map<string, number>,
    height: number,
    opts: CapPlacementOptions,
  ): void {
    let slot = 0;
    for (const [ropeId, pose] of poses) {
      const mesh = this.items[slot];
      if (!mesh) break;
      const positions = rendered.get(ropeId) ?? pose.positions;
      const hit = intersectHorizontalPlane(positions, pose.nodeCount, height);

      if (!hit) {
        mesh.visible = false;
        slot++;
        continue;
      }

      // 规则 1：弧段抑制
      const onArc = pose.arcFlags[hit.nodeIndex] === 1 || pose.arcFlags[hit.nodeIndex + 1] === 1;
      if (onArc) {
        mesh.visible = false;
        slot++;
        continue;
      }

      const ropeRadius = radii.get(ropeId) ?? 0.006;

      // 规则 2：净空收缩（取跨段两端节点净空的较小值）
      const c0 = pose.clearances[hit.nodeIndex] ?? Number.POSITIVE_INFINITY;
      const c1 = pose.clearances[hit.nodeIndex + 1] ?? Number.POSITIVE_INFINITY;
      const clearance = Math.min(c0, c1);
      let capRadius = ropeRadius;
      if (Number.isFinite(clearance)) {
        capRadius = Math.max(0, Math.min(ropeRadius, clearance - opts.margin));
      }
      if (capRadius <= 1e-4) {
        mesh.visible = false;
        slot++;
        continue;
      }

      // 规则 3：平面内推开——若净空小于绳半径，圆心沿"远离最近碰撞体"的水平方向平移
      let px = hit.point[0];
      let pz = hit.point[2];
      if (Number.isFinite(clearance) && clearance < ropeRadius) {
        // 用跨段中点的位置梯度近似水平推出方向（向跨段中线回缩）
        const n0 = hit.nodeIndex;
        const n1 = Math.min(pose.nodeCount - 1, n0 + 1);
        const mx = (positions[n0 * 3]! + positions[n1 * 3]!) * 0.5;
        const mz = (positions[n0 * 3 + 2]! + positions[n1 * 3 + 2]!) * 0.5;
        let dx = mx - hit.point[0];
        let dz = mz - hit.point[2];
        const dl = Math.hypot(dx, dz);
        if (dl > 1e-6) {
          dx /= dl;
          dz /= dl;
          const push = ropeRadius - clearance;
          px += dx * push;
          pz += dz * push;
        }
      }

      mesh.visible = true;
      mesh.position.set(px, height, pz);
      mesh.scale.setScalar(capRadius);
      slot++;
    }

    for (let i = slot; i < this.capacity; i++) {
      this.items[i]!.visible = false;
    }
  }

  addTo(parent: THREE.Object3D): void {
    for (const m of this.items) parent.add(m);
  }

  forEachVisible(cb: (mesh: THREE.Mesh) => void): void {
    for (const m of this.items) if (m.visible) cb(m);
  }

  dispose(): void {
    for (const m of this.items) m.geometry.dispose();
  }
}
