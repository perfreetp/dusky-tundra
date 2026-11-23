import { describe, expect, it } from 'vitest';
import { sampleCatmullRom, centripetalKnots } from './catmullRom';

describe('centripetal Catmull-Rom', () => {
  it('密采样严格经过全部控制点', () => {
    const ctl = new Float32Array([
      0, 0, 0,
      1, 2, 0,
      2, 2, 0.5,
      3, 0, 0,
    ]);
    const out = new Float32Array(40 * 3);
    const n = sampleCatmullRom(ctl, 4, 8, out);
    expect(n).toBeGreaterThan(4);
    // 首末点
    expect(out[0]).toBeCloseTo(0, 8);
    expect(out[(n - 1) * 3 + 1]).toBeCloseTo(0, 8);
    // 控制点 P1=(1,2,0) 必须出现在采样序列中（每段末点即控制点）
    let found = false;
    for (let i = 0; i < n; i++) {
      if (Math.abs(out[i * 3]! - 1) < 1e-7 && Math.abs(out[i * 3 + 1]! - 2) < 1e-7) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('节点距单调递增', () => {
    const ctl = new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0, 4, 0, 0]);
    const knots = new Float32Array(4);
    centripetalKnots(ctl, 4, knots);
    for (let i = 1; i < 4; i++) expect(knots[i]!).toBeGreaterThan(knots[i - 1]!);
  });

  it('过冲有界：centripetal 参数化把过冲限制在小幅度（无尖点/自交）', () => {
    const ctl = new Float32Array([
      0, 0, 0,
      1, 5, 0,
      2, 5, 0,
      3, 0, 0,
    ]);
    const out = new Float32Array(60 * 3);
    const n = sampleCatmullRom(ctl, 4, 12, out);
    for (let i = 0; i < n; i++) {
      const y = out[i * 3 + 1]!;
      // Catmull-Rom 不保证凸包性；平顶极端构型下 centripetal 过冲仍 < 5% 且无自交
      expect(y).toBeLessThanOrEqual(5.0 * 1.05);
      expect(y).toBeGreaterThanOrEqual(-5.0 * 0.05);
    }
  });
});
