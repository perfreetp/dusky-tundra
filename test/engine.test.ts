import { describe, expect, it } from 'vitest';
import { computeCoverage, topContributions } from '../src/acoustics/engine';
import type { SamplePoint, Speaker } from '../src/types';

const point = (x: number, y: number, z: number): SamplePoint => ({ x, y, z, nx: 0, ny: 1, nz: 0 });

const speaker = (id: string, patch: Partial<Speaker> = {}): Speaker => ({
  id,
  name: id,
  x: 0,
  y: 10,
  z: 0,
  yaw: 0,
  tilt: 0,
  halfAngle: 40,
  spl: 110,
  range: 80,
  ...patch,
});

describe('多箱叠加引擎', () => {
  it('两个等权同位置源能量叠加 +3 dB', async () => {
    const points = [point(0, 10, -10)];
    const sps = [speaker('a'), speaker('b')];
    const result = await computeCoverage(points, sps, false).promise;
    const single = result.contributions[0];
    expect(result.total[0]).toBeCloseTo(single + 3.0103, 3);
    expect(result.dominant[0]).toBe(0);
  });

  it('主导音箱为单点 SPL 最大者，topContributions 降序', async () => {
    const points = [point(0, 10, -15)];
    const sps = [
      speaker('quiet', { spl: 95 }),
      speaker('loud', { spl: 120 }),
    ];
    const result = await computeCoverage(points, sps, false).promise;
    expect(result.dominant[0]).toBe(1);
    const top = topContributions(result, 0, 2);
    expect(top[0].speakerIndex).toBe(1);
    expect(top[0].spl).toBeGreaterThan(top[1].spl);
  });

  it('取消任务后 Promise 不 resolve 出新结果', async () => {
    const points = Array.from({ length: 2000 }, (_, i) => point(0, 0, -i * 0.1 - 1));
    const handle = computeCoverage(points, [speaker('a')], false);
    handle.cancel();
    const raced = await Promise.race([
      handle.promise.then(() => 'resolved'),
      new Promise((r) => setTimeout(() => r('timeout'), 50)),
    ]);
    expect(raced).toBe('timeout');
  });

  it('空音箱列表返回 -999 填充与 -1 主导', async () => {
    const result = await computeCoverage([point(0, 0, -5)], [], false).promise;
    expect(result.total[0]).toBe(-999);
    expect(result.dominant[0]).toBe(-1);
  });

  it('空气吸收开启后同点 SPL 更低', async () => {
    const points = [point(0, 10, -30)];
    const dry = await computeCoverage(points, [speaker('a')], false).promise;
    const wet = await computeCoverage(points, [speaker('a')], true).promise;
    expect(wet.total[0]).toBeLessThan(dry.total[0]);
  });
});
