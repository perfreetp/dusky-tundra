import { shallowReactive } from 'vue'
import type maplibregl from 'maplibre-gl'
import type { BirdPointsLayer } from './birdPoints3D'
import type { RegionDrawer } from './regionSelect'
import { EXTENT } from '../core/data'

/**
 * 地图服务单例:MapContainer 初始化后注册,
 * 各页面通过它访问地图实例与绘制工具。
 */
export const mapService = shallowReactive({
  map: null as maplibregl.Map | null,
  birdLayer: null as BirdPointsLayer | null,
  drawer: null as RegionDrawer | null,
  ready: false,
})

export function fitToWetland() {
  mapService.map?.fitBounds(
    [
      [EXTENT.minLng, EXTENT.minLat],
      [EXTENT.maxLng, EXTENT.maxLat],
    ],
    { padding: 60, duration: 800 },
  )
}
