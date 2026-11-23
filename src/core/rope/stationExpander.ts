/**
 * 站点展开：RopeDefinition.stations + 场景/档位 → PathSegment[]。
 * 轮缘切点用线-圆解析解，弧段与自由段交替排列。
 */
import type {
  AnchorParam,
  FloorState,
  RopeStation,
  SceneConfig,
  SheaveParam,
  Vec3,
} from '../model/types';
import { v3 } from '../math/vector3';
import {
  buildPlaneFrame,
  pointOnCircle,
  tangentAngles,
  verticalTangentAngles,
  worldToPlane,
  type PlaneFrame,
} from '../math/lineCircle';
import { wrapAngle, type ArcSegment, type PathSegment, type SpanSegment } from './wrapArc';
import { followerPosition } from '../model/floorModel';

/** 槽位点世界坐标 C_g = C + (firstOffset + groove*pitch) * axis */
export function grooveCenter(sheave: SheaveParam, grooveIndex: number, out: Vec3): Vec3 {
  const off = sheave.firstGrooveOffset + grooveIndex * sheave.groovePitch;
  out[0] = sheave.center[0] + sheave.axis[0] * off;
  out[1] = sheave.center[1] + sheave.axis[1] * off;
  out[2] = sheave.center[2] + sheave.axis[2] * off;
  return out;
}

function resolveAnchor(
  anchor: AnchorParam | undefined,
  floor: FloorState,
  scene: SceneConfig,
  tensionSheaveY: number,
): Vec3 {
  if (!anchor) return [0, 0, 0];
  if (anchor.follower) {
    return followerPosition(scene, anchor.follower, floor.position, tensionSheaveY);
  }
  return [anchor.position[0], anchor.position[1], anchor.position[2]];
}

/** 解析 span 终点坐标 */
export function resolveSpanEnd(
  station: Extract<RopeStation, { type: 'span' }>,
  scene: SceneConfig,
  floor: FloorState,
  tensionSheaveY: number,
): Vec3 {
  if (station.toFollower) {
    return followerPosition(scene, station.toFollower, floor.position, tensionSheaveY);
  }
  const anchor = scene.anchors.find((a) => a.id === station.toAnchorId);
  return resolveAnchor(anchor, floor, scene, tensionSheaveY);
}

function findSheave(scene: SceneConfig, id: string): SheaveParam {
  const s = scene.sheaves.find((x) => x.id === id);
  if (!s) throw new Error(`未找到绳轮配置: ${id}`);
  return s;
}

/**
 * 两个候选切点角中选取与"入/出方向"几何一致的一个。
 * 规则：候选切点与外部点连线应与圆相切（解析解已保证），
 * 选取绕行角度最小、且在外部点同侧（x 同号）的候选。
 */
function chooseTangent(
  frame: PlaneFrame,
  radius: number,
  external: Vec3,
  candidates: [number, number],
): number {
  const [ex] = worldToPlane(frame, external);
  // 外部点在圆外：用 acos 解的两个候选本身都合法，取与外部点 x 同侧、角差较小者
  const preferred = ex >= 0 ? candidates[0] : candidates[1];
  const other = ex >= 0 ? candidates[1] : candidates[0];
  // 正下方（ex≈0）时按角度绝对值小者
  if (Math.abs(ex) < radius * 0.05) {
    return Math.abs(candidates[0]) <= Math.abs(candidates[1]) ? candidates[0]! : candidates[1]!;
  }
  return Math.abs(normalizeAngle(preferred)) <= Math.abs(normalizeAngle(other)) + 0.2
    ? preferred
    : other;
}

function normalizeAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

const _groove: Vec3 = [0, 0, 0];
const _ref: Vec3 = [0, 0, 0];

/**
 * 展开整条绳的站点序列为路径段。
 * @param tensionSheaveY 限速器张紧轮闭合解 Y（曳引绳传 0 即可）
 */
export function expandStations(
  stations: RopeStation[],
  scene: SceneConfig,
  floor: FloorState,
  tensionSheaveY: number,
): PathSegment[] {
  const segments: PathSegment[] = [];
  let current: Vec3 | null = null;
  let spanId = 0;

  for (let s = 0; s < stations.length; s++) {
    const st = stations[s]!;

    if (st.type === 'anchor') {
      const anchor = scene.anchors.find((a) => a.id === st.anchorId);
      current = resolveAnchor(anchor, floor, scene, tensionSheaveY);
      continue;
    }

    if (st.type === 'span') {
      if (!current) throw new Error('span 之前必须存在 anchor 或 sheave 站点');
      const to = resolveSpanEnd(st, scene, floor, tensionSheaveY);
      const span: SpanSegment = {
        kind: 'span',
        spanId: spanId++,
        from: [current[0], current[1], current[2]],
        to,
        toFollower: st.toFollower,
      };
      segments.push(span);
      current = to;
      continue;
    }

    // sheave 站点：需要前一个外部点（入绳）与下一个外部点（出绳）
    if (!current) throw new Error('sheave 之前必须存在 anchor 站点');
    const sheave = findSheave(scene, st.sheaveId);
    grooveCenter(sheave, st.grooveIndex, _groove);

    // 找下一个 span 的终点作为出绳外部点
    const nextSpan = stations.slice(s + 1).find((x) => x.type === 'span') as
      | Extract<RopeStation, { type: 'span' }>
      | undefined;
    if (!nextSpan) throw new Error('sheave 站点后必须跟随 span 站点');
    const outPoint = resolveSpanEnd(nextSpan, scene, floor, tensionSheaveY);

    // 绳平面基架：参考方向取入绳点相对槽位点的水平方向
    v3.sub(_ref, current, _groove);
    _ref[1] = 0;
    if (v3.length(_ref) < 1e-6) {
      _ref[0] = 1;
      _ref[1] = 0;
      _ref[2] = 0;
    }
    const frame: PlaneFrame = {
      center: [_groove[0], _groove[1], _groove[2]],
      eU: [0, 0, 0],
      eV: [0, 0, 0],
    };
    buildPlaneFrame(_groove, sheave.axis, _ref, frame);

    // 入切点
    const [inX, inY] = worldToPlane(frame, current);
    const inTan = tangentAngles(inX, inY, sheave.pitchRadius);
    // 竖直悬挂特例（入绳点几乎在正下/正上方）
    let thetaIn: number;
    if (Math.hypot(inX, inY) > sheave.pitchRadius * 1.01) {
      thetaIn = chooseTangent(frame, sheave.pitchRadius, current, [inTan.theta1, inTan.theta2]);
    } else {
      const vt = verticalTangentAngles(inX, sheave.pitchRadius);
      thetaIn = inY >= 0 ? vt.left : vt.right;
    }

    // 出切点
    const [outX, outY] = worldToPlane(frame, outPoint);
    const outTan = tangentAngles(outX, outY, sheave.pitchRadius);
    let thetaOut: number;
    if (Math.hypot(outX, outY) > sheave.pitchRadius * 1.01) {
      thetaOut = chooseTangent(frame, sheave.pitchRadius, outPoint, [
        outTan.theta1,
        outTan.theta2,
      ]);
    } else {
      const vt = verticalTangentAngles(outX, sheave.pitchRadius);
      thetaOut = outY >= 0 ? vt.left : vt.right;
    }

    const full = st.wrap === 'full';
    const angle = wrapAngle(thetaIn, thetaOut, sheave.wrapSign, full);

    const arc: ArcSegment = {
      kind: 'arc',
      sheaveId: sheave.id,
      grooveIndex: st.grooveIndex,
      frame,
      radius: sheave.pitchRadius,
      thetaIn,
      thetaOut,
      angle,
      wrapSign: sheave.wrapSign,
    };
    segments.push(arc);

    // 出切点成为新的 current（世界坐标）
    const exitPoint: Vec3 = [0, 0, 0];
    pointOnCircle(frame, sheave.pitchRadius, thetaOut, exitPoint);
    current = exitPoint;
  }

  return segments;
}
