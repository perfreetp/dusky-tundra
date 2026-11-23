/**
 * 剖切截面环池：每根绳一个池化圆盘/环，定位在折线与剖切平面的交点。
 * 不参与 clipping（无 clippingPlanes），避免被同一平面切没。
 */
import * as THREE from 'three';
import type { RopePose } from '../../core/model/types';
import { intersectHorizontalPlane } from '../../core/math/interpolate';
import { RENDER_ORDER } from '../render/renderOrder';

export class SectionRingPool {
  private items: THREE.Mesh[] = [];
  private capacity: number;

  constructor(capacity: number, material: THREE.MeshStandardMaterial) {
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      const geo = new THREE.CircleGeometry(1, 24);
      const mesh = new THREE.Mesh(geo, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.visible = false;
      mesh.renderOrder = RENDER_ORDER.SECTION;
      this.items.push(mesh);
    }
  }

  /**
   * 更新截面位置。
   * @param rendered 渲染缓冲（含摆幅），用于精确求交
   */
  update(
    poses: Map<string, RopePose>,
    rendered: Map<string, Float32Array>,
    radii: Map<string, number>,
    height: number,
    show: boolean,
  ): void {
    let slot = 0;
    for (const [ropeId, pose] of poses) {
      const mesh = this.items[slot];
      if (!mesh) break;
      const positions = rendered.get(ropeId) ?? pose.positions;
      const hit = intersectHorizontalPlane(positions, pose.nodeCount, height);
      if (!show || !hit) {
        mesh.visible = false;
        slot++;
        continue;
      }
      const radius = radii.get(ropeId) ?? 0.006;
      mesh.visible = true;
      mesh.position.set(hit.point[0], height, hit.point[2]);
      mesh.scale.setScalar(radius);
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
