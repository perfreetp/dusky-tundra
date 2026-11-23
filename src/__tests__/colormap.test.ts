import { describe, it, expect } from 'vitest';
import { pressureColor, speedColor, buildPressureLUT, buildSpeedLUT } from '../render/colormap';

describe('色带', () => {
  it('端点与单调性', () => {
    expect(pressureColor(0)[2]).toBeGreaterThan(pressureColor(0)[0]); // 冷端偏蓝
    expect(pressureColor(1)[0]).toBeGreaterThan(pressureColor(1)[2]); // 暖端偏红
    expect(speedColor(0)[2]).toBeGreaterThan(speedColor(0)[0]);
    // LUT 字节长度与合法范围
    const lut = buildPressureLUT(128);
    expect(lut.length).toBe(512);
    expect(lut[3]).toBe(255);
    for (let i = 0; i < lut.length; i++) expect(lut[i]).toBeGreaterThanOrEqual(0);
    expect(buildSpeedLUT(64).length).toBe(256);
  });

  it('越界 t 被钳制', () => {
    expect(pressureColor(-1)).toEqual(pressureColor(0));
    expect(pressureColor(2)).toEqual(pressureColor(1));
  });
});
