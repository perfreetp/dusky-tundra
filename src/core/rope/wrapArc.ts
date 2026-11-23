/**
 * 轮缘包角圆弧采样：构造上保证 |P - C_g| ≡ R，从数学上杜绝穿轮。
 */
import type { Vec3 } from '../model/types';
import type { PlaneFrame } from '../math/lineCircle';
import { pointOnCircle, wrapAngle } from '../math/lineCircle';

export interface ArcSegment {
  kind: 'arc';
  sheaveId: string;
  grooveIndex: number;
  frame: PlaneFrame;
  radius: number;
  thetaIn: number;
  thetaOut: number;
  /** 带符号包角 */
  angle: number;
  wrapSign: 1 | -1;
}

export interface SpanSegment {
  kind: 'span';
  spanId: number;
  /** 起点世界坐标（切点或锚点） */
  from: Vec3;
  /** 终点世界坐标 */
  to: Vec3;
  /** 跟随对象（动态端点），静态为 undefined */
  toFollower?: 'car' | 'counterweight' | 'tensionSheave';
}

export type PathSegment = ArcSegment | SpanSegment;

/**
 * 在圆弧上等弧长采样 K 个点（含入切、出切点），写入 outPositions。
 * 全部节点 arcFlag = 1。
 * @returns 写入的节点数
 */
export function sampleArc(
  seg: ArcSegment,
  samples: number,
  outPositions: Float32Array,
  writeOffset: number,
  outArcFlags: Uint8Array,
  flagOffset: number,
): number {
  const k = Math.max(2, samples);
  const tmp: Vec3 = [0, 0, 0];
  for (let i = 0; i < k; i++) {
    const t = i / (k - 1);
    const theta = seg.thetaIn + seg.angle * t;
    pointOnCircle(seg.frame, seg.radius, theta, tmp);
    const o = (writeOffset + i) * 3;
    outPositions[o] = tmp[0];
    outPositions[o + 1] = tmp[1];
    outPositions[o + 2] = tmp[2];
    outArcFlags[flagOffset + i] = 1;
  }
  return k;
}

/** 计算圆弧节点数（LOD 驱动） */
export function arcNodeCount(samples: number): number {
  return Math.max(2, samples);
}

/** 弧段总弧长 */
export function arcLength(seg: ArcSegment): number {
  return Math.abs(seg.angle) * seg.radius;
}

export { wrapAngle };
