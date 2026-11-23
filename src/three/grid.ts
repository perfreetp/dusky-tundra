import * as THREE from 'three';
import type { SamplePoint } from '../types';
import type { VenueBounds } from './venue';

/** 密度档位 -> 采样间距（米），在默认体育场上对应约 1k / 3k / 8k 点 */
export const DENSITY_SPACING: Record<'low' | 'medium' | 'high', number> = {
  low: 5,
  medium: 2.8,
  high: 1.7,
};

const RAY_TOP = 300;
const DOWN = new THREE.Vector3(0, -1, 0);
const _ray = new THREE.Raycaster();
const _normal = new THREE.Vector3();
const _normalMatrix = new THREE.Matrix3();

/**
 * 统一下探采样：在包围矩形上铺 XY 规则网格，每点向下 raycast 场馆表面，
 * 命中点（坐标 + 面法线）即为采样点。程序场馆与导入 GLTF 共用。
 */
export function buildSampleGrid(
  bounds: VenueBounds,
  targets: THREE.Object3D[],
  spacing: number,
): SamplePoint[] {
  const points: SamplePoint[] = [];
  const nx = Math.max(1, Math.round((bounds.maxX - bounds.minX) / spacing) + 1);
  const nz = Math.max(1, Math.round((bounds.maxZ - bounds.minZ) / spacing) + 1);
  const stepX = (bounds.maxX - bounds.minX) / (nx - 1);
  const stepZ = (bounds.maxZ - bounds.minZ) / (nz - 1);

  for (let iz = 0; iz < nz; iz++) {
    const z = bounds.minZ + iz * stepZ;
    for (let ix = 0; ix < nx; ix++) {
      const x = bounds.minX + ix * stepX;
      _ray.set(new THREE.Vector3(x, RAY_TOP, z), DOWN);
      _ray.far = RAY_TOP * 2;
      const hits = _ray.intersectObjects(targets, true);
      if (hits.length === 0) continue;
      const hit = hits[0];
      if (!hit.face) continue;

      _normalMatrix.getNormalMatrix(hit.object.matrixWorld);
      _normal.copy(hit.face.normal).applyMatrix3(_normalMatrix).normalize();

      points.push({
        x: hit.point.x,
        y: hit.point.y,
        z: hit.point.z,
        nx: _normal.x,
        ny: _normal.y,
        nz: _normal.z,
      });
    }
  }
  return points;
}
