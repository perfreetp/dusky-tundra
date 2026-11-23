/**
 * 气动可视化色带：压力色带（蓝-青-绿-黄-红发散型，Cp 负值/正值）
 * 与速度色带（深蓝→青→黄→白，感知均匀的速率映射）。
 * 全部返回线性 sRGB 0..1 分量（three ColorManagement 下材质端做转换）。
 */

export type ColorRGB = [number, number, number];

interface Stop {
  t: number;
  c: ColorRGB;
}

const PRESSURE_STOPS: Stop[] = [
  { t: 0.0, c: [0.05, 0.15, 0.75] }, // 强负压 蓝
  { t: 0.25, c: [0.0, 0.65, 0.95] }, // 青
  { t: 0.45, c: [0.25, 0.85, 0.35] }, // 绿
  { t: 0.55, c: [0.85, 0.9, 0.3] }, // 黄（Cp≈0 附近）
  { t: 0.75, c: [1.0, 0.55, 0.1] }, // 橙
  { t: 1.0, c: [0.85, 0.08, 0.08] }, // 强正压 红
];

const SPEED_STOPS: Stop[] = [
  { t: 0.0, c: [0.02, 0.03, 0.18] },
  { t: 0.25, c: [0.05, 0.35, 0.75] },
  { t: 0.5, c: [0.1, 0.8, 0.85] },
  { t: 0.75, c: [0.85, 0.9, 0.35] },
  { t: 1.0, c: [1.0, 1.0, 0.95] },
];

function sampleStops(stops: Stop[], t: number): ColorRGB {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (x <= b.t) {
      const f = b.t === a.t ? 0 : (x - a.t) / (b.t - a.t);
      // 线性插值足够平滑（色带连续性由 stops 保证）
      return [
        a.c[0] + (b.c[0] - a.c[0]) * f,
        a.c[1] + (b.c[1] - a.c[1]) * f,
        a.c[2] + (b.c[2] - a.c[2]) * f,
      ];
    }
  }
  return stops[stops.length - 1].c;
}

export function pressureColor(t: number): ColorRGB {
  return sampleStops(PRESSURE_STOPS, t);
}

export function speedColor(t: number): ColorRGB {
  return sampleStops(SPEED_STOPS, t);
}

/** 生成 1D LUT Uint8（RGBA，sRGB 编码后的字节），可直接喂给 DataTexture */
export function buildLUT(stops: Stop[], samples = 256): Uint8ClampedArray {
  const out = new Uint8ClampedArray(samples * 4);
  for (let i = 0; i < samples; i++) {
    const [r, g, b] = sampleStops(stops, i / (samples - 1));
    // 线性 -> sRGB 字节
    out[i * 4] = Math.round(linearToSrgbByte(r));
    out[i * 4 + 1] = Math.round(linearToSrgbByte(g));
    out[i * 4 + 2] = Math.round(linearToSrgbByte(b));
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function buildPressureLUT(samples = 256): Uint8ClampedArray {
  return buildLUT(PRESSURE_STOPS, samples);
}

export function buildSpeedLUT(samples = 256): Uint8ClampedArray {
  return buildLUT(SPEED_STOPS, samples);
}

function linearToSrgbByte(c: number): number {
  const v = Math.min(1, Math.max(0, c));
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return s * 255;
}
