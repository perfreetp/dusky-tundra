import { describe, expect, it } from 'vitest';
import {
  DI_FLOOR,
  directivityDb,
  exponentFromHalfAngle,
  splAtPoint,
} from '../src/acoustics/directivity';
import type { Speaker } from '../src/types';

const baseSpeaker = (patch: Partial<Speaker> = {}): Speaker => ({
  id: 's1',
  name: 's1',
  x: 0,
  y: 10,
  z: 0,
  yaw: 0,
  tilt: 0,
  halfAngle: 30,
  spl: 110,
  range: 60,
  ...patch,
});

describe('指向性模型 -6dB 标准', () => {
  it('锥边 theta = halfAngle 处恰为 -6 dB', () => {
    const n = exponentFromHalfAngle(30);
    const di = directivityDb((30 * Math.PI) / 180, n);
    expect(di).toBeCloseTo(-6, 4);
  });

  it('轴上指向性衰减为 0，强于锥边', () => {
    const n = exponentFromHalfAngle(30);
    expect(directivityDb(0, n)).toBeCloseTo(0, 6);
    expect(directivityDb(0, n)).toBeGreaterThan(directivityDb(0.4, n));
  });

  it('锥外角度继续平滑衰减，90° 及背面触地板而非硬截断', () => {
    const n = exponentFromHalfAngle(30);
    const outside = directivityDb((60 * Math.PI) / 180, n);
    const edge = directivityDb((30 * Math.PI) / 180, n);
    expect(outside).toBeLessThan(edge);
    expect(outside).toBeGreaterThanOrEqual(DI_FLOOR);
    expect(directivityDb(Math.PI, n)).toBe(DI_FLOOR); // 正后方
  });

  it('更小覆盖角对应更陡的指向性（更大幂次）', () => {
    expect(exponentFromHalfAngle(20)).toBeGreaterThan(exponentFromHalfAngle(45));
  });
});

describe('单点直达声', () => {
  it('轴上 10m 处 = SPL0 - 20dB 距离律（指向性 0）', () => {
    const sp = baseSpeaker({ yaw: 0, tilt: 0 });
    // 音箱在 (0,10,0)，俯角 0 朝 -Z；取正前方 10m、同高点
    const v = splAtPoint(sp, 0, 10, -10, false);
    expect(v).toBeCloseTo(110 - 20 * Math.log10(10), 5);
  });

  it('同距离锥外点 SPL 明显低于轴上点，且差异来自角度项', () => {
    const sp = baseSpeaker();
    const axial = splAtPoint(sp, 0, 10, -20, false);
    // 侧向点：与 -Z 轴夹角 90°
    const side = splAtPoint(sp, 20, 10, 0, false);
    expect(axial - side).toBeGreaterThan(20);
  });

  it('超出覆盖距离后附加滚降，更远点更弱', () => {
    const sp = baseSpeaker({ range: 15 });
    const near = splAtPoint(sp, 0, 10, -16, false);
    const far = splAtPoint(sp, 0, 10, -29, false);
    expect(far).toBeLessThan(near);
  });

  it('俯角指向前下方时，正下方偏前采样点落于锥内', () => {
    const sp = baseSpeaker({ tilt: 45, yaw: 0 });
    // 前向 = (-sin45 in y? ) 朝 -Z/-Y，取 (0, 10-d, -d) 方向同 45°
    const d = 10;
    const v = splAtPoint(sp, 0, 10 - d, -d, false);
    const dist = Math.hypot(d, d);
    expect(v).toBeCloseTo(110 - 20 * Math.log10(dist), 4); // 轴上 DI=0
  });
});
