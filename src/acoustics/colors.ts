/**
 * 声压分级 LUT。色带为离散分级（专业声学报告惯例），绝对/差值两套。
 */

export const ABSOLUTE_COLORS = [0x2b58c9, 0x1e96d9, 0x23b26d, 0x9bcf3b, 0xf2c033, 0xe8612d, 0xc0322b];
export const NO_DATA_COLOR = 0x3a3f47;

/**
 * 绝对声压 -> 色带索引（0..6）。
 * thresholds 为 5 个上阈值：[t1..t5]，形成 <=t0? 的 6 个区间：
 * <t1, t1..t2, ..., t4..t5, >=t5（共 6 级时 colors 取前 6；保留第 7 色用于超限）
 */
export function absoluteBandIndex(spl: number, thresholds: readonly number[]): number {
  if (!Number.isFinite(spl) || spl <= -900) return -1;
  for (let i = 0; i < thresholds.length; i++) {
    if (spl < thresholds[i]) return i;
  }
  return thresholds.length; // 最高档（第 6 级，使用 ABSOLUTE_COLORS[5]，超限才用 [6]）
}

export function absoluteColor(spl: number, thresholds: readonly number[]): number {
  const idx = absoluteBandIndex(spl, thresholds);
  if (idx < 0) return NO_DATA_COLOR;
  return ABSOLUTE_COLORS[Math.min(idx, ABSOLUTE_COLORS.length - 1)];
}

/** 差值发散色带：蓝（B 变弱）→ 白（接近 0）→ 红（B 变强） */
export const DIFF_BANDS: Array<{ max: number; color: number; label: string }> = [
  { max: -6, color: 0x2166c2, label: '< -6' },
  { max: -3, color: 0x62a0e0, label: '-6 ~ -3' },
  { max: -1, color: 0xb6d4f2, label: '-3 ~ -1' },
  { max: 1, color: 0xf2f2f2, label: '±1' },
  { max: 3, color: 0xf4b8a8, label: '+1 ~ +3' },
  { max: 6, color: 0xe07a5f, label: '+3 ~ +6' },
  { max: Infinity, color: 0xc0322b, label: '> +6' },
];

export function diffColor(delta: number): number {
  if (!Number.isFinite(delta)) return NO_DATA_COLOR;
  for (const band of DIFF_BANDS) {
    if (delta < band.max) return band.color;
  }
  return DIFF_BANDS[DIFF_BANDS.length - 1].color;
}

export function diffBandLabel(delta: number): string {
  if (!Number.isFinite(delta)) return '无数据';
  for (const band of DIFF_BANDS) {
    if (delta < band.max) return band.label;
  }
  return DIFF_BANDS[DIFF_BANDS.length - 1].label;
}
