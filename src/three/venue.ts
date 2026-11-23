import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface VenueBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface VenueModel {
  root: THREE.Group;
  /** 参与下探 raycast 的表面对象 */
  raycastTargets: THREE.Object3D[];
  bounds: VenueBounds;
  dispose: () => void;
}

const FIELD_W = 100; // x 方向
const FIELD_D = 70; // z 方向
const TIERS = 8;
const TIER_DEPTH = 3;
const TIER_RISE = 0.8;

/**
 * 程序生成体育场：矩形场地 + 四面阶梯看台（踏步几何，下探射线可自然命中各级踏面）。
 */
export function createStadium(): VenueModel {
  const root = new THREE.Group();
  root.name = 'stadium';
  const disposables: Array<{ dispose(): void }> = [];

  // 场地
  const fieldGeo = new THREE.BoxGeometry(FIELD_W, 0.4, FIELD_D);
  const fieldMat = new THREE.MeshStandardMaterial({ color: 0x2e7d43, roughness: 0.95 });
  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.position.y = -0.2;
  field.name = 'field';
  root.add(field);
  disposables.push(fieldGeo, fieldMat);

  // 看台：每级踏步是从地面垒到踏面高度的箱体，合并为单个网格加速 raycast
  const standGeos: THREE.BufferGeometry[] = [];
  const putTier = (cx: number, cz: number, w: number, d: number, level: number) => {
    const h = level * TIER_RISE;
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(cx, h / 2, cz);
    standGeos.push(g);
  };

  for (let i = 0; i < TIERS; i++) {
    const level = i + 1;
    const offset = FIELD_D / 2 + i * TIER_DEPTH + TIER_DEPTH / 2;
    const longSpan = FIELD_W + 2 * TIER_DEPTH * TIERS;
    putTier(0, -offset, longSpan, TIER_DEPTH, level);
    putTier(0, offset, longSpan, TIER_DEPTH, level);

    const xOffset = FIELD_W / 2 + i * TIER_DEPTH + TIER_DEPTH / 2;
    const sideSpan = FIELD_D;
    putTier(-xOffset, 0, TIER_DEPTH, sideSpan, level);
    putTier(xOffset, 0, TIER_DEPTH, sideSpan, level);
  }

  const merged = mergeGeometries(standGeos, false);
  standGeos.forEach((g) => g.dispose());
  if (!merged) throw new Error('看台几何合并失败');
  const standMat = new THREE.MeshStandardMaterial({ color: 0x8d94a0, roughness: 0.9 });
  const stands = new THREE.Mesh(merged, standMat);
  stands.name = 'stands';
  root.add(stands);
  disposables.push(merged, standMat);

  const standExtentX = FIELD_W / 2 + TIERS * TIER_DEPTH;
  const standExtentZ = FIELD_D / 2 + TIERS * TIER_DEPTH;
  const bounds: VenueBounds = {
    minX: -standExtentX,
    maxX: standExtentX,
    minZ: -standExtentZ,
    maxZ: standExtentZ,
  };

  return {
    root,
    raycastTargets: [field, stands],
    bounds,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
