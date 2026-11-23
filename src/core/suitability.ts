import type { BirdPoint, GridData, LngLatRing, RegionStats, Weights } from './types'

/**
 * 水深适宜度:最适水深 0.1~0.5m(涉禽浅滩),
 * 干出滩地部分可用,过深水域迅速下降。
 */
export function depthScore(d: number): number {
  if (d <= 0) return 0.25
  if (d < 0.1) return 0.6 + (d / 0.1) * 0.3
  if (d <= 0.5) return 0.9 + ((d - 0.1) / 0.4) * 0.1
  if (d <= 1.0) return 1.0 - ((d - 0.5) / 0.5) * 0.6
  return Math.max(0.05, 0.4 - (d - 1.0) * 0.5)
}

/** 植被覆盖适宜度:覆盖度 0.35~0.7 最适(隐蔽性与开阔取食面兼顾) */
export function vegScore(v: number): number {
  if (v < 0.1) return 0.3 + v * 3
  if (v < 0.35) return 0.6 + ((v - 0.1) / 0.25) * 0.35
  if (v <= 0.7) return 0.95 + ((v - 0.35) / 0.35) * 0.05
  return Math.max(0.2, 1.0 - ((v - 0.7) / 0.3) * 0.7)
}

/** 加权综合适宜度,权重内部归一化 */
export function suitability(depth: number, veg: number, wDepth: number, wVeg: number): number {
  const sum = wDepth + wVeg
  if (sum <= 0) return 0
  return (depthScore(depth) * wDepth + vegScore(veg) * wVeg) / sum
}

export function recomputeGrid(grid: GridData, w: Weights): void {
  const n = grid.cols * grid.rows
  for (let i = 0; i < n; i++) {
    grid.suit[i] = suitability(grid.depth[i], grid.veg[i], w.depth, w.veg)
  }
}

export function recomputePoints(points: BirdPoint[], w: Weights): void {
  for (const p of points) {
    p.suitability = suitability(p.depth, p.veg, w.depth, w.veg)
  }
}

export function pointInPolygon(lng: number, lat: number, ring: LngLatRing): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

export function computeRegionStats(
  grid: GridData,
  points: BirdPoint[],
  ring: LngLatRing,
): RegionStats {
  const { cols, rows, minLng, maxLng, minLat, maxLat } = grid
  let sum = 0
  let min = 1
  let max = 0
  let n = 0
  for (let r = 0; r < rows; r++) {
    const lat = maxLat - ((r + 0.5) / rows) * (maxLat - minLat)
    for (let c = 0; c < cols; c++) {
      const lng = minLng + ((c + 0.5) / cols) * (maxLng - minLng)
      if (!pointInPolygon(lng, lat, ring)) continue
      const v = grid.suit[r * cols + c]
      sum += v
      if (v < min) min = v
      if (v > max) max = v
      n++
    }
  }
  let pointCount = 0
  let pointSum = 0
  for (const p of points) {
    if (pointInPolygon(p.lng, p.lat, ring)) {
      pointCount++
      pointSum += p.suitability
    }
  }
  const latMid = ((minLat + maxLat) / 2) * (Math.PI / 180)
  const cellW = ((maxLng - minLng) / cols) * 111320 * Math.cos(latMid)
  const cellH = ((maxLat - minLat) / rows) * 110540
  return {
    avg: n > 0 ? sum / n : 0,
    min: n > 0 ? min : 0,
    max: n > 0 ? max : 0,
    areaKm2: (n * cellW * cellH) / 1e6,
    cellCount: n,
    pointCount,
    pointAvgSuit: pointCount > 0 ? pointSum / pointCount : 0,
  }
}
