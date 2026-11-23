export interface Weights {
  /** 水深适宜度权重 */
  depth: number
  /** 植被覆盖权重 */
  veg: number
}

export interface GridData {
  cols: number
  rows: number
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
  /** 水深(米),0 表示干出滩地,row 0 = 北侧 */
  depth: Float32Array
  /** 植被覆盖度 0..1 */
  veg: Float32Array
  /** 计算结果:综合适宜度 0..1 */
  suit: Float32Array
}

export interface BirdPoint {
  id: number
  lng: number
  lat: number
  depth: number
  veg: number
  species: string
  /** 种群数量 */
  flock: number
  /** 物种基础栖息高度层(米) */
  height: number
  /** 计算结果:该点综合适宜度 0..1 */
  suitability: number
}

export interface RegionStats {
  avg: number
  min: number
  max: number
  areaKm2: number
  cellCount: number
  pointCount: number
  pointAvgSuit: number
}

export type LngLatRing = [number, number][]
