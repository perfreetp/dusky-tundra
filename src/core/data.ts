import type { BirdPoint, GridData } from './types'
import { suitability } from './suitability'

/** 湿地范围(合成演示数据,长江口滩涂风格) */
export const EXTENT = { minLng: 120.6, minLat: 31.28, maxLng: 120.78, maxLat: 31.4 }
export const GRID_COLS = 160
export const GRID_ROWS = 120

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 值噪声,返回 0..1 */
function makeValueNoise(seed: number, cells: number) {
  const rand = mulberry32(seed)
  const size = cells + 1
  const g = new Float32Array(size * size)
  for (let i = 0; i < g.length; i++) g[i] = rand()
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const fx = Math.min(Math.max(x, 0), 0.99999) * cells
    const fy = Math.min(Math.max(y, 0), 0.99999) * cells
    const x0 = Math.floor(fx)
    const y0 = Math.floor(fy)
    const tx = smooth(fx - x0)
    const ty = smooth(fy - y0)
    const at = (xx: number, yy: number) => g[yy * size + xx]
    const a = at(x0, y0)
    const b = at(x0 + 1, y0)
    const c = at(x0, y0 + 1)
    const d = at(x0 + 1, y0 + 1)
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
  }
}

function fbm(noise: (x: number, y: number) => number, x: number, y: number, octaves = 4) {
  let v = 0
  let amp = 0.5
  let f = 1
  let sum = 0
  for (let o = 0; o < octaves; o++) {
    v += noise(x * f, y * f) * amp
    sum += amp
    amp *= 0.5
    f *= 2
  }
  return v / sum
}

/** 构建水深 / 植被覆盖栅格。row 0 = 北(maxLat),与画布方向一致 */
export function buildGrid(): GridData {
  const cols = GRID_COLS
  const rows = GRID_ROWS
  const depth = new Float32Array(cols * rows)
  const veg = new Float32Array(cols * rows)
  const suit = new Float32Array(cols * rows)
  const n1 = makeValueNoise(1337, 6)
  const n2 = makeValueNoise(9241, 9)
  const n3 = makeValueNoise(5150, 4)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c / (cols - 1)
      const y = r / (rows - 1)
      const wn = fbm(n1, x, y, 4)
      // 主水道:一条蜿蜒的深水带
      const channel = Math.abs(y - 0.5 - 0.16 * Math.sin(x * 6.2) - (n3(x, y) - 0.5) * 0.3)
      let d = (wn - 0.4) * 2.6
      if (channel < 0.06) d += (0.06 - channel) * 14
      const depthM = Math.min(Math.max(d, 0), 1.6)
      const v = fbm(n2, x, y, 4) * 1.25 - depthM * 0.4 + (n3(x, y) - 0.5) * 0.15
      const i = r * cols + c
      depth[i] = depthM
      veg[i] = Math.min(Math.max(v, 0), 1)
    }
  }
  return { cols, rows, ...EXTENT, depth, veg, suit }
}

export function sampleGrid(grid: GridData, lng: number, lat: number) {
  const c = Math.min(
    grid.cols - 1,
    Math.max(0, Math.floor(((lng - grid.minLng) / (grid.maxLng - grid.minLng)) * grid.cols)),
  )
  const r = Math.min(
    grid.rows - 1,
    Math.max(0, Math.floor(((grid.maxLat - lat) / (grid.maxLat - grid.minLat)) * grid.rows)),
  )
  const i = r * grid.cols + c
  return { depth: grid.depth[i], veg: grid.veg[i], suit: grid.suit[i] }
}

const SPECIES = [
  { name: '白鹭', stratum: 6 },
  { name: '苍鹭', stratum: 10 },
  { name: '黑脸琵鹭', stratum: 8 },
  { name: '反嘴鹬', stratum: 4 },
  { name: '东方白鹳', stratum: 14 },
  { name: '小天鹅', stratum: 12 },
  { name: '绿头鸭', stratum: 5 },
  { name: '斑嘴鸭', stratum: 5 },
]

/** 生成鸟类观测点位,按生境适宜度拒绝采样,使点位自然聚集于适宜区 */
export function generateBirdPoints(count: number, grid: GridData): BirdPoint[] {
  const rand = mulberry32(20240 + count)
  const pts: BirdPoint[] = []
  let guard = 0
  while (pts.length < count && guard++ < count * 40) {
    const lng = EXTENT.minLng + rand() * (EXTENT.maxLng - EXTENT.minLng)
    const lat = EXTENT.minLat + rand() * (EXTENT.maxLat - EXTENT.minLat)
    const { depth, veg } = sampleGrid(grid, lng, lat)
    const s = suitability(depth, veg, 0.5, 0.5)
    if (rand() > 0.12 + 0.88 * s) continue
    const sp = SPECIES[Math.floor(rand() * SPECIES.length)]
    pts.push({
      id: pts.length,
      lng,
      lat,
      depth,
      veg,
      species: sp.name,
      flock: 1 + Math.floor(rand() * rand() * 40),
      height: sp.stratum,
      suitability: 0,
    })
  }
  return pts
}
