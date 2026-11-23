import { defineStore } from 'pinia'
import { reactive, ref, shallowRef } from 'vue'
import type { BirdPoint, GridData, LngLatRing, RegionStats } from '../core/types'
import { buildGrid, generateBirdPoints } from '../core/data'
import { computeRegionStats, recomputeGrid, recomputePoints } from '../core/suitability'

const CONFIG_KEY = 'whs:config:v1'
const REGION_KEY = 'whs:region:v1'

interface PersistedConfig {
  weights: { depth: number; veg: number }
  rampId: string
  layers: Record<string, boolean>
  heatmapOpacity: number
  waterOpacity: number
  vegetationOpacity: number
  mode3D: boolean
  heightExaggeration: number
  pointCount: number
}

export const useStore = defineStore('suitability', () => {
  // ---- 配置状态(可持久化) ----
  const weights = reactive({ depth: 0.55, veg: 0.45 })
  const rampId = ref('eco')
  const layers = reactive({
    base: true,
    water: true,
    vegetation: true,
    heatmap: true,
    points3d: true,
    density: true,
  })
  const heatmapOpacity = ref(0.78)
  const waterOpacity = ref(0.85)
  const vegetationOpacity = ref(0.8)
  const mode3D = ref(false)
  const heightExaggeration = ref(1)
  const pointCount = ref(20000)

  // ---- 数据状态 ----
  const grid = shallowRef<GridData | null>(null)
  const points = shallowRef<BirdPoint[]>([])
  /** 每次重算自增,地图层据此刷新(热力图 + 点位密度联动) */
  const dataVersion = ref(0)
  const region = ref<LngLatRing | null>(null)
  const regionStats = shallowRef<RegionStats | null>(null)
  const selectedPoint = shallowRef<BirdPoint | null>(null)

  let saveTimer: ReturnType<typeof setTimeout> | undefined
  function saveLocal() {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      const cfg: PersistedConfig = {
        weights: { ...weights },
        rampId: rampId.value,
        layers: { ...layers },
        heatmapOpacity: heatmapOpacity.value,
        waterOpacity: waterOpacity.value,
        vegetationOpacity: vegetationOpacity.value,
        mode3D: mode3D.value,
        heightExaggeration: heightExaggeration.value,
        pointCount: pointCount.value,
      }
      try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
        if (region.value) localStorage.setItem(REGION_KEY, JSON.stringify(region.value))
        else localStorage.removeItem(REGION_KEY)
      } catch {
        /* 隐私模式等场景下静默失败 */
      }
    }, 250)
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY)
      if (raw) {
        const cfg = JSON.parse(raw) as Partial<PersistedConfig>
        applyConfig(cfg)
      }
      const r = localStorage.getItem(REGION_KEY)
      if (r) region.value = JSON.parse(r) as LngLatRing
    } catch {
      /* 损坏的本地配置忽略 */
    }
  }

  /** 重算:权重/数据源变化后,热力图栅格与点位适宜度一起更新 */
  function recompute() {
    if (!grid.value) return
    recomputeGrid(grid.value, weights)
    recomputePoints(points.value, weights)
    if (region.value) {
      regionStats.value = computeRegionStats(grid.value, points.value, region.value)
    }
    dataVersion.value++
  }

  function setWeight(key: 'depth' | 'veg', v: number) {
    weights[key] = Math.min(1, Math.max(0, v))
    recompute()
    saveLocal()
  }

  function setRamp(id: string) {
    rampId.value = id
    dataVersion.value++
    saveLocal()
  }

  function setPointCount(n: number) {
    pointCount.value = n
    if (grid.value) {
      points.value = generateBirdPoints(n, grid.value)
      selectedPoint.value = null
      recompute()
    }
    saveLocal()
  }

  function setRegion(ring: LngLatRing | null) {
    region.value = ring
    if (ring && grid.value) {
      regionStats.value = computeRegionStats(grid.value, points.value, ring)
    } else {
      regionStats.value = null
    }
    saveLocal()
  }

  function applyConfig(cfg: Partial<PersistedConfig>) {
    if (cfg.weights) {
      weights.depth = cfg.weights.depth ?? weights.depth
      weights.veg = cfg.weights.veg ?? weights.veg
    }
    if (cfg.rampId) rampId.value = cfg.rampId
    if (cfg.layers) Object.assign(layers, cfg.layers)
    if (cfg.heatmapOpacity != null) heatmapOpacity.value = cfg.heatmapOpacity
    if (cfg.waterOpacity != null) waterOpacity.value = cfg.waterOpacity
    if (cfg.vegetationOpacity != null) vegetationOpacity.value = cfg.vegetationOpacity
    if (cfg.mode3D != null) mode3D.value = cfg.mode3D
    if (cfg.heightExaggeration != null) heightExaggeration.value = cfg.heightExaggeration
    if (cfg.pointCount != null && cfg.pointCount !== pointCount.value) {
      pointCount.value = cfg.pointCount
      // 已有数据时(导入场景)同步重新生成点位
      if (grid.value) {
        points.value = generateBirdPoints(pointCount.value, grid.value)
        selectedPoint.value = null
      }
    }
  }

  function resetConfig() {
    weights.depth = 0.55
    weights.veg = 0.45
    rampId.value = 'eco'
    Object.assign(layers, {
      base: true,
      water: true,
      vegetation: true,
      heatmap: true,
      points3d: true,
      density: true,
    })
    heatmapOpacity.value = 0.78
    waterOpacity.value = 0.85
    vegetationOpacity.value = 0.8
    mode3D.value = false
    heightExaggeration.value = 1
    setRegion(null)
    recompute()
    saveLocal()
  }

  let inited = false
  function init() {
    if (inited) return
    inited = true
    loadLocal()
    grid.value = buildGrid()
    points.value = generateBirdPoints(pointCount.value, grid.value)
    recompute()
  }

  return {
    weights,
    rampId,
    layers,
    heatmapOpacity,
    waterOpacity,
    vegetationOpacity,
    mode3D,
    heightExaggeration,
    pointCount,
    grid,
    points,
    dataVersion,
    region,
    regionStats,
    selectedPoint,
    init,
    recompute,
    setWeight,
    setRamp,
    setPointCount,
    setRegion,
    applyConfig,
    resetConfig,
    saveLocal,
  }
})
