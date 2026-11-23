import { describe, expect, it } from 'vitest';
import { absoluteBandIndex, diffColor, diffBandLabel } from '../src/acoustics/colors';

describe('色带分级', () => {
  const thresholds = [75, 80, 85, 90, 95];

  it('绝对声压落入正确分级', () => {
    expect(absoluteBandIndex(70, thresholds)).toBe(0);
    expect(absoluteBandIndex(75, thresholds)).toBe(1);
    expect(absoluteBandIndex(88, thresholds)).toBe(3);
    expect(absoluteBandIndex(100, thresholds)).toBe(5);
  });

  it('无数据返回 -1', () => {
    expect(absoluteBandIndex(-999, thresholds)).toBe(-1);
    expect(absoluteBandIndex(NaN, thresholds)).toBe(-1);
  });

  it('差值发散色带：负为蓝侧、正为红侧、近零为中性', () => {
    const neg = diffColor(-5);
    const pos = diffColor(5);
    expect(neg).not.toBe(pos);
    expect(diffColor(0)).toBe(diffColor(0.5));
    expect(diffBandLabel(0)).toContain('1');
    expect(diffBandLabel(-99)).toBe('< -6');
    expect(diffBandLabel(NaN)).toBe('无数据');
  });
});
