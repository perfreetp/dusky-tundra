/**
 * 张力色标 LUT：蓝→青→绿→黄→红。
 * 场景材质与 DOM 图例共用同一份插值，保证屏显一致。
 */
import * as THREE from 'three';
import { TENSION_LUT_STOPS } from '../../config/engineConfig';

export const LUT_SIZE = 256;

export function buildTensionLUT(): THREE.DataTexture {
  const data = new Uint8Array(LUT_SIZE * 4);
  const stops = TENSION_LUT_STOPS;
  for (let i = 0; i < LUT_SIZE; i++) {
    const t = i / (LUT_SIZE - 1);
    let lo = stops[0]!;
    let hi = stops[stops.length - 1]!;
    for (let k = 0; k < stops.length - 1; k++) {
      if (t >= stops[k]![0] && t <= stops[k + 1]![0]) {
        lo = stops[k]!;
        hi = stops[k + 1]!;
        break;
      }
    }
    const span = hi[0] - lo[0] || 1;
    const f = (t - lo[0]) / span;
    const o = i * 4;
    data[o] = Math.round((lo[1][0] + (hi[1][0] - lo[1][0]) * f) * 255);
    data[o + 1] = Math.round((lo[1][1] + (hi[1][1] - lo[1][1]) * f) * 255);
    data[o + 2] = Math.round((lo[1][2] + (hi[1][2] - lo[1][2]) * f) * 255);
    data[o + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, LUT_SIZE, 1, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 供 DOM 图例使用的 CSS linear-gradient 字符串 */
export function tensionLutCssGradient(): string {
  const stops = TENSION_LUT_STOPS.map(
    ([t, rgb]) => `rgb(${Math.round(rgb[0] * 255)},${Math.round(rgb[1] * 255)},${Math.round(rgb[2] * 255)}) ${(t * 100).toFixed(0)}%`,
  );
  return `linear-gradient(to right, ${stops.join(', ')})`;
}
