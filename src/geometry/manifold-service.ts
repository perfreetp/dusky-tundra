// manifold-3d 几何布尔服务:视线通道 vs 结构实体
// 纯计算模块,不依赖 DOM,可在 Worker 中运行
import { ensureManifold, getManifold } from './manifold-bootstrap';
import { setCircularSegments } from 'manifold-3d/lib/level-of-detail.js';
import type { Manifold as ManifoldType } from 'manifold-3d/manifoldCAD';
import type { OccluderBox, Vec3 } from '../types';

export type Manifold = ManifoldType;

/** 初始化 wasm 与几何精度(圆柱 8 段,足够视线判定且速度快),幂等 */
export async function initManifoldGeometry(): Promise<void> {
  await ensureManifold();
  setCircularSegments(8);
}

/**
 * 构造沿 eye->target 方向的细长圆柱(视线通道)。
 * Manifold 圆柱默认沿 Z 轴、居中;全局系按 x→y→z 顺序旋转:
 * 先绕 X 俯仰(theta),再绕 Z 偏航(phi)。
 */
export function createSightChannel(
  eye: Vec3,
  target: Vec3,
  radius: number,
  circularSegments = 8,
): Manifold {
  const M = getManifold();
  const dx = target[0] - eye[0];
  const dy = target[1] - eye[1];
  const dz = target[2] - eye[2];
  const len = Math.hypot(dx, dy, dz);
  const theta = Math.acos(Math.max(-1, Math.min(1, dz / len)));
  const phi = Math.atan2(dx, -dy);
  const mid: Vec3 = [
    (eye[0] + target[0]) / 2,
    (eye[1] + target[1]) / 2,
    (eye[2] + target[2]) / 2,
  ];
  return M.cylinder(len, radius, radius, circularSegments, true)
    .rotate([(theta * 180) / Math.PI, 0, (phi * 180) / Math.PI])
    .translate(mid);
}

/** 盒体遮挡物转 Manifold(支持绕 Y 偏航) */
export function createBoxManifold(box: OccluderBox): Manifold {
  const M = getManifold();
  const m = M.cube(box.size, true);
  const yawDeg = ((box.yaw ?? 0) * 180) / Math.PI;
  return yawDeg !== 0 ? m.rotate([0, yawDeg, 0]).translate(box.center) : m.translate(box.center);
}

/** 把一批盒体合并成单个结构实体(供所有座席复用,避免重复布尔) */
export function buildBlockerUnion(boxes: OccluderBox[]): Manifold {
  const M = getManifold();
  if (boxes.length === 0) {
    // 空 manifold:用一个远离场景的极小立方体占位,交集恒空
    return M.cube([0.001, 0.001, 0.001], true).translate([1e6, 1e6, 1e6]);
  }
  const parts = boxes.map(createBoxManifold);
  const unioned = M.union(parts);
  for (const p of parts) p.delete();
  return unioned;
}

/** 带标签的结构实体:评分时需要知道是被谁挡住(栏杆/墙/观众) */
export interface TaggedBlocker {
  tag: OccluderBox['tag'];
  label?: string;
  manifold: Manifold;
}

/** 一组遮挡实体:整体 union 用于快速布尔,分组实体仅在命中后查标签 */
export interface BlockerSet {
  /** 所有盒体合并后的单一实体(快速判定) */
  union: Manifold;
  /** 按标签分组的实体(命中后定位遮挡来源) */
  tagged: TaggedBlocker[];
}

/** 构建遮挡实体集:一次 union + 标签分组 */
export function buildBlockerSet(boxes: OccluderBox[]): BlockerSet {
  return {
    union: buildBlockerUnion(boxes),
    tagged: buildTaggedBlockers(boxes),
  };
}

/** 判定通道是否被该实体集挡住,命中时返回遮挡来源标签 */
export function channelBlockedBySet(channel: Manifold, set: BlockerSet): string | null {
  const hit = channel.intersect(set.union);
  const blocked = !hit.isEmpty();
  hit.delete();
  if (!blocked) return null;
  for (const tb of set.tagged) {
    if (channelBlocked(channel, tb.manifold)) return tb.label ?? tb.tag;
  }
  return '结构实体';
}

/** 按标签分组构建实体,用于区分遮挡来源 */
export function buildTaggedBlockers(boxes: OccluderBox[]): TaggedBlocker[] {
  const groups = new Map<string, OccluderBox[]>();
  for (const b of boxes) {
    const key = `${b.tag}|${b.label ?? ''}`;
    const arr = groups.get(key);
    if (arr) arr.push(b);
    else groups.set(key, [b]);
  }
  const out: TaggedBlocker[] = [];
  for (const [key, arr] of groups) {
    const [tag, label] = key.split('|') as [OccluderBox['tag'], string];
    out.push({ tag, label: label || undefined, manifold: buildBlockerUnion(arr) });
  }
  return out;
}

/** 判断一条视线通道是否与实体相交(相交体积非空即被挡) */
export function channelBlocked(channel: Manifold, blocker: Manifold): boolean {
  const hit = channel.intersect(blocker);
  const blocked = !hit.isEmpty();
  hit.delete();
  return blocked;
}
