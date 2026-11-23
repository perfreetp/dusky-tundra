/** 5 档色带定义,每档一个颜色(低 → 高) */
export interface Ramp {
  id: string
  name: string
  colors: [string, string, string, string, string]
}

export const RAMPS: Ramp[] = [
  { id: 'eco', name: '生态绿', colors: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'] },
  { id: 'aqua', name: '水域蓝', colors: ['#08306b', '#225ea8', '#41b6c4', '#a1dab4', '#ffffcc'] },
  { id: 'heat', name: '热力红', colors: ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'] },
  { id: 'violet', name: '青紫', colors: ['#f7f4f9', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'] },
  { id: 'gray', name: '灰度', colors: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'] },
]

export const BAND_LABELS = ['很低', '较低', '中等', '较高', '很高']

export function getRamp(id: string): Ramp {
  return RAMPS.find((r) => r.id === id) ?? RAMPS[0]
}

/** 适宜度 0..1 → 档位 0..4 */
export function bandIndex(v: number): number {
  return Math.min(4, Math.max(0, Math.floor(v * 5)))
}

export function bandColor(ramp: Ramp, v: number): string {
  return ramp.colors[bandIndex(v)]
}
