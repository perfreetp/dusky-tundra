import { describe, expect, it } from 'vitest';
import {
  buildPlaneFrame,
  pointOnCircle,
  tangentAngles,
  verticalTangentAngles,
  worldToPlane,
  wrapAngle,
} from './lineCircle';
import type { Vec3 } from '../model/types';

describe('lineCircle 线圆解析', () => {
  const center: Vec3 = [0, 10, 0];
  const axis: Vec3 = [0, 0, 1];
  const ref: Vec3 = [1, 0, 0];
  const frame = buildPlaneFrame(center, axis, ref, {
    center: [0, 0, 0],
    eU: [0, 0, 0],
    eV: [0, 0, 0],
  });

  it('平面基架正交归一', () => {
    const { eU, eV } = frame;
    expect(Math.hypot(...eU)).toBeCloseTo(1, 10);
    expect(Math.hypot(...eV)).toBeCloseTo(1, 10);
    expect(eU[0]! * eV[0]! + eU[1]! * eV[1]! + eU[2]! * eV[2]!).toBeCloseTo(0, 10);
  });

  it('圆上任意点到圆心距离恒等于 R（包角不穿轮的数学基础）', () => {
    const R = 0.32;
    for (let k = 0; k <= 64; k++) {
      const theta = (k / 64) * Math.PI * 2;
      const p = pointOnCircle(frame, R, theta, [0, 0, 0]);
      expect(Math.hypot(p[0]! - center[0]!, p[1]! - center[1]!, p[2]! - center[2]!)).toBeCloseTo(
        R,
        9,
      );
    }
  });

  it('外点切线切点落在圆上且连线与半径垂直', () => {
    const R = 0.32;
    const ax = 1.2;
    const ay = -2.0;
    const { theta1, theta2 } = tangentAngles(ax, ay, R);
    for (const theta of [theta1, theta2]) {
      const tx = R * Math.cos(theta);
      const ty = R * Math.sin(theta);
      expect(Math.hypot(tx, ty)).toBeCloseTo(R, 9);
      // 半径与切点->外点向量点积为 0
      const dot = tx * (ax - tx) + ty * (ay - ty);
      expect(dot).toBeCloseTo(0, 9);
    }
  });

  it('竖直悬挂特例切点角为 ±π/2', () => {
    const t = verticalTangentAngles(0.32, 0.32);
    expect(t.left).toBeCloseTo(Math.PI / 2, 10);
    expect(t.right).toBeCloseTo(-Math.PI / 2, 10);
  });

  it('wrapAngle 与 wrapSign 同向且 full 模式大于 π', () => {
    const a1 = wrapAngle(0.2, -0.4, 1, false);
    expect(a1).toBeGreaterThan(0);
    const a2 = wrapAngle(0.2, -0.4, -1, false);
    expect(a2).toBeLessThan(0);
    const full = wrapAngle(0.1, 0.2, 1, true);
    expect(Math.abs(full)).toBeGreaterThan(Math.PI);
  });

  it('worldToPlane / pointOnCircle 互逆', () => {
    const R = 0.32;
    const theta = 0.9;
    const p = pointOnCircle(frame, R, theta, [0, 0, 0]);
    const [x, y] = worldToPlane(frame, p);
    expect(x).toBeCloseTo(R * Math.cos(theta), 9);
    expect(y).toBeCloseTo(R * Math.sin(theta), 9);
  });
});
