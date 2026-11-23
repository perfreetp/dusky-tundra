<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import maplibregl from 'maplibre-gl'
import { useStore } from '../stores/suitability'
import { EXTENT } from '../core/data'
import { getRamp } from '../core/ramps'
import { depthScore, vegScore } from '../core/suitability'
import { buildSuitabilityCanvas, buildVegetationCanvas, buildWaterCanvas } from '../map/canvases'
import { BirdPointsLayer } from '../map/birdPoints3D'
import { RegionDrawer } from '../map/regionSelect'
import { mapService } from '../map/mapService'

const store = useStore()
const route = useRoute()

const HEAT_COORDS: [[number, number], [number, number], [number, number], [number, number]] = [
  [EXTENT.minLng, EXTENT.maxLat],
  [EXTENT.maxLng, EXTENT.maxLat],
  [EXTENT.maxLng, EXTENT.minLat],
  [EXTENT.minLng, EXTENT.minLat],
]

let map: maplibregl.Map
let birdLayer: BirdPointsLayer
let popup: maplibregl.Popup | null = null
let refreshTimer: ReturnType<typeof setTimeout> | undefined

function densityFC(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: store.points.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { suit: p.suitability },
    })),
  }
}

function rampHeatmapColor(): maplibregl.ExpressionSpecification {
  const colors = getRamp(store.rampId).colors
  // heatmap-color 需要 density 0..1 的插值 stops
  return [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(0,0,0,0)',
    0.2,
    colors[0],
    0.4,
    colors[1],
    0.6,
    colors[2],
    0.8,
    colors[3],
    1,
    colors[4],
  ] as unknown as maplibregl.ExpressionSpecification
}

/** 权重 / 色带变化后:热力图 + 点位密度 + 三维点位一起刷新 */
function refreshDataLayers() {
  const grid = store.grid
  if (!grid || !mapService.ready) return
  const ramp = getRamp(store.rampId)
  const heatSrc = map.getSource('suitability') as maplibregl.ImageSource | undefined
  heatSrc?.updateImage({
    url: buildSuitabilityCanvas(grid, ramp).toDataURL(),
    coordinates: HEAT_COORDS,
  })
  const densitySrc = map.getSource('birds') as maplibregl.GeoJSONSource | undefined
  densitySrc?.setData(densityFC())
  if (map.getLayer('bird-density')) {
    map.setPaintProperty('bird-density', 'heatmap-color', rampHeatmapColor())
  }
  birdLayer?.setRamp(ramp)
  birdLayer?.refresh()
}

function scheduleRefresh() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(refreshDataLayers, 80)
}

function applyVisibility() {
  if (!mapService.ready) return
  const set = (id: string, visible: boolean) => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
    }
  }
  set('osm-base', store.layers.base)
  set('water-layer', store.layers.water)
  set('vegetation-layer', store.layers.vegetation)
  set('suitability-layer', store.layers.heatmap)
  set('bird-density', store.layers.density)
  set('bird-points-3d', store.layers.points3d)
}

function applyOpacities() {
  if (!mapService.ready) return
  if (map.getLayer('suitability-layer')) {
    map.setPaintProperty('suitability-layer', 'raster-opacity', store.heatmapOpacity)
  }
  if (map.getLayer('water-layer')) {
    map.setPaintProperty('water-layer', 'raster-opacity', store.waterOpacity)
  }
  if (map.getLayer('vegetation-layer')) {
    map.setPaintProperty('vegetation-layer', 'raster-opacity', store.vegetationOpacity)
  }
}

function onMapClick(e: maplibregl.MapMouseEvent) {
  if (route.path !== '/points' || !store.layers.points3d) return
  if (mapService.drawer?.active) return
  let best: (typeof store.points)[number] | null = null
  let bestDist = 14 // 命中半径(像素)
  for (const p of store.points) {
    const s = map.project([p.lng, p.lat])
    const d = Math.hypot(s.x - e.point.x, s.y - e.point.y)
    if (d < bestDist) {
      bestDist = d
      best = p
    }
  }
  store.selectedPoint = best
}

function showPointPopup() {
  popup?.remove()
  popup = null
  const p = store.selectedPoint
  if (!p || !map) return
  const ramp = getRamp(store.rampId)
  const band = Math.min(4, Math.floor(p.suitability * 5))
  const color = ramp.colors[band]
  const html = `
    <div style="font:13px/1.6 system-ui;min-width:190px">
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">${p.species}
        <span style="float:right;background:${color};color:#fff;padding:0 8px;border-radius:8px;font-size:12px">
          适宜度 ${p.suitability.toFixed(2)}
        </span>
      </div>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="color:#888">种群数量</td><td style="text-align:right">${p.flock} 只</td></tr>
        <tr><td style="color:#888">水深</td><td style="text-align:right">${p.depth.toFixed(2)} m</td></tr>
        <tr><td style="color:#888">植被覆盖</td><td style="text-align:right">${(p.veg * 100).toFixed(0)}%</td></tr>
        <tr><td style="color:#888">水深适宜度</td><td style="text-align:right">${depthScore(p.depth).toFixed(2)}</td></tr>
        <tr><td style="color:#888">植被适宜度</td><td style="text-align:right">${vegScore(p.veg).toFixed(2)}</td></tr>
        <tr><td style="color:#888">栖息高度层</td><td style="text-align:right">${p.height} m</td></tr>
      </table>
    </div>`
  popup = new maplibregl.Popup({ closeButton: true, maxWidth: '280px', offset: 12 })
    .setLngLat([p.lng, p.lat])
    .setHTML(html)
    .addTo(map)
  popup.on('close', () => {
    if (store.selectedPoint?.id === p.id) store.selectedPoint = null
  })
}

function setupLayers() {
  const grid = store.grid!
  const ramp = getRamp(store.rampId)

  // 底图(OSM,离线时自动退化为背景色)
  map.addSource('osm', {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution: '© OpenStreetMap contributors',
  })
  map.addLayer({ id: 'osm-base', type: 'raster', source: 'osm' })

  // 湿地水域 / 植被图层
  map.addSource('water', {
    type: 'image',
    url: buildWaterCanvas(grid).toDataURL(),
    coordinates: HEAT_COORDS,
  })
  map.addLayer({ id: 'water-layer', type: 'raster', source: 'water' })
  map.addSource('vegetation', {
    type: 'image',
    url: buildVegetationCanvas(grid).toDataURL(),
    coordinates: HEAT_COORDS,
  })
  map.addLayer({ id: 'vegetation-layer', type: 'raster', source: 'vegetation' })

  // 适宜度热力图
  map.addSource('suitability', {
    type: 'image',
    url: buildSuitabilityCanvas(grid, ramp).toDataURL(),
    coordinates: HEAT_COORDS,
  })
  map.addLayer({ id: 'suitability-layer', type: 'raster', source: 'suitability' })

  // 鸟群点位密度热力(权重 = 点位适宜度,随权重联动)
  map.addSource('birds', { type: 'geojson', data: densityFC() })
  map.addLayer({
    id: 'bird-density',
    type: 'heatmap',
    source: 'birds',
    paint: {
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'suit'], 0, 0.05, 1, 1],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 4],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 9],
      'heatmap-opacity': 0.75,
      'heatmap-color': rampHeatmapColor(),
    },
  })

  // 圈选工具(在热力层之上)
  mapService.drawer = new RegionDrawer(map, (ring) => store.setRegion(ring))

  // 三维点位图层
  birdLayer = new BirdPointsLayer()
  map.addLayer(birdLayer)
  birdLayer.setData(store.points, grid, ramp)
  mapService.birdLayer = birdLayer

  applyVisibility()
  applyOpacities()
  if (store.region) mapService.drawer.showRegion(store.region)
  if (store.mode3D) apply3D(true)
  mapService.ready = true
}

function apply3D(on: boolean) {
  birdLayer?.setMode3D(on)
  map?.easeTo(on ? { pitch: 62, bearing: -18, duration: 900 } : { pitch: 0, bearing: 0, duration: 900 })
}

onMounted(() => {
  map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {},
      layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#dfe8dc' } }],
    },
    center: [(EXTENT.minLng + EXTENT.maxLng) / 2, (EXTENT.minLat + EXTENT.maxLat) / 2],
    zoom: 11.4,
    minZoom: 9,
    maxZoom: 17,
    maxPitch: 70,
    attributionControl: { compact: true },
  })
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right')
  map.on('load', setupLayers)
  map.on('click', onMapClick)
  mapService.map = map
})

// ---- 联动 watchers ----
watch(() => [store.dataVersion, store.rampId], scheduleRefresh)
watch(() => store.points, () => {
  if (!map?.loaded() || !birdLayer) return
  const src = map.getSource('birds') as maplibregl.GeoJSONSource | undefined
  src?.setData(densityFC())
  birdLayer.setData(store.points, store.grid!, getRamp(store.rampId))
})
watch(
  () => ({ ...store.layers }),
  () => applyVisibility(),
)
watch([() => store.heatmapOpacity, () => store.waterOpacity, () => store.vegetationOpacity], () =>
  applyOpacities(),
)
watch(
  () => store.mode3D,
  (v) => {
    if (map?.loaded()) apply3D(v)
  },
)
watch(
  () => store.heightExaggeration,
  (v) => birdLayer?.setExaggeration(v),
)
watch(
  () => store.region,
  (ring) => mapService.drawer?.showRegion(ring),
)
watch(() => store.selectedPoint, showPointPopup)

onBeforeUnmount(() => {
  clearTimeout(refreshTimer)
  popup?.remove()
  mapService.map = null
  mapService.birdLayer = null
  mapService.drawer = null
  mapService.ready = false
  map?.remove()
})
</script>

<template>
  <div id="map" class="map-container"></div>
</template>

<style scoped>
.map-container {
  position: absolute;
  inset: 0;
}
</style>
