import maplibregl from 'maplibre-gl'
import type { LngLatRing } from '../core/types'

export type DrawMode = 'rect' | 'polygon'

const EMPTY_FC: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

/** 矩形 / 多边形圈选工具,结果渲染到 'region' 数据源 */
export class RegionDrawer {
  private map: maplibregl.Map
  private onFinish: (ring: LngLatRing) => void
  private mode: DrawMode | null = null
  private startPt: [number, number] | null = null
  private vertices: [number, number][] = []
  private cursor: [number, number] | null = null
  private lastClickAt = 0
  /** 最近一次提交的圈选,用于 Esc 取消后恢复显示 */
  private committed: LngLatRing | null = null

  constructor(map: maplibregl.Map, onFinish: (ring: LngLatRing) => void) {
    this.map = map
    this.onFinish = onFinish
    map.addSource('region', { type: 'geojson', data: EMPTY_FC })
    map.addLayer({
      id: 'region-fill',
      type: 'fill',
      source: 'region',
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: { 'fill-color': '#f59e0b', 'fill-opacity': 0.16 },
    })
    map.addLayer({
      id: 'region-line',
      type: 'line',
      source: 'region',
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: { 'line-color': '#d97706', 'line-width': 2, 'line-dasharray': [2, 1.5] },
    })
    map.addLayer({
      id: 'region-vertices',
      type: 'circle',
      source: 'region',
      filter: ['==', ['geometry-type'], 'Point'],
      paint: { 'circle-radius': 4, 'circle-color': '#d97706', 'circle-stroke-width': 1.5, 'circle-stroke-color': '#ffffff' },
    })
  }

  get active() {
    return this.mode !== null
  }

  start(mode: DrawMode) {
    this.cancel()
    this.mode = mode
    this.map.dragPan.disable()
    this.map.doubleClickZoom.disable()
    this.map.getCanvas().style.cursor = 'crosshair'
    if (mode === 'rect') {
      this.map.on('mousedown', this.onMouseDown)
      this.map.on('mousemove', this.onMouseMove)
      this.map.on('mouseup', this.onMouseUp)
    } else {
      this.map.on('click', this.onClick)
      this.map.on('mousemove', this.onMouseMove)
      this.map.on('dblclick', this.onDblClick)
    }
    window.addEventListener('keydown', this.onKeyDown)
  }

  cancel() {
    if (!this.mode) return
    this.mode = null
    this.startPt = null
    this.vertices = []
    this.cursor = null
    this.map.dragPan.enable()
    this.map.doubleClickZoom.enable()
    this.map.getCanvas().style.cursor = ''
    this.map.off('mousedown', this.onMouseDown)
    this.map.off('mousemove', this.onMouseMove)
    this.map.off('mouseup', this.onMouseUp)
    this.map.off('click', this.onClick)
    this.map.off('dblclick', this.onDblClick)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  clear() {
    this.cancel()
    this.committed = null
    ;(this.map.getSource('region') as maplibregl.GeoJSONSource).setData(EMPTY_FC)
  }

  /** 显示已有圈选(本地恢复 / 导入) */
  showRegion(ring: LngLatRing | null) {
    this.committed = ring && ring.length >= 3 ? ring : null
    const src = this.map.getSource('region') as maplibregl.GeoJSONSource
    if (!ring || ring.length < 3) {
      src.setData(EMPTY_FC)
      return
    }
    src.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [ring] },
        },
      ],
    })
  }

  private preview() {
    let ring: [number, number][] = []
    if (this.mode === 'rect' && this.startPt && this.cursor) {
      const [x1, y1] = this.startPt
      const [x2, y2] = this.cursor
      ring = [
        [Math.min(x1, x2), Math.max(y1, y2)],
        [Math.max(x1, x2), Math.max(y1, y2)],
        [Math.max(x1, x2), Math.min(y1, y2)],
        [Math.min(x1, x2), Math.min(y1, y2)],
        [Math.min(x1, x2), Math.max(y1, y2)],
      ]
    } else if (this.mode === 'polygon' && this.vertices.length) {
      ring = [...this.vertices]
      if (this.cursor) ring.push(this.cursor)
      if (ring.length >= 3) ring.push(ring[0])
    }
    const features: GeoJSON.Feature[] = []
    if (ring.length >= 4) {
      features.push({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [ring] },
      })
    }
    for (const v of this.vertices) {
      features.push({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: v },
      })
    }
    ;(this.map.getSource('region') as maplibregl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features,
    })
  }

  private finish(ring: LngLatRing) {
    this.cancel()
    this.showRegion(ring)
    this.onFinish(ring)
  }

  private onMouseDown = (e: maplibregl.MapMouseEvent) => {
    if (this.mode !== 'rect') return
    this.startPt = [e.lngLat.lng, e.lngLat.lat]
    this.cursor = this.startPt
    e.preventDefault()
  }

  private onMouseMove = (e: maplibregl.MapMouseEvent) => {
    this.cursor = [e.lngLat.lng, e.lngLat.lat]
    this.preview()
  }

  private onMouseUp = (e: maplibregl.MapMouseEvent) => {
    if (this.mode !== 'rect' || !this.startPt) return
    this.cursor = [e.lngLat.lng, e.lngLat.lat]
    const [x1, y1] = this.startPt
    const [x2, y2] = this.cursor
    if (Math.abs(x2 - x1) < 1e-5 || Math.abs(y2 - y1) < 1e-5) {
      this.cancel()
      return
    }
    this.finish([
      [Math.min(x1, x2), Math.max(y1, y2)],
      [Math.max(x1, x2), Math.max(y1, y2)],
      [Math.max(x1, x2), Math.min(y1, y2)],
      [Math.min(x1, x2), Math.min(y1, y2)],
      [Math.min(x1, x2), Math.max(y1, y2)],
    ])
  }

  private onClick = (e: maplibregl.MapMouseEvent) => {
    if (this.mode !== 'polygon') return
    const now = performance.now()
    if (now - this.lastClickAt < 350) return // 双击的第二次点击忽略
    this.lastClickAt = now
    this.vertices.push([e.lngLat.lng, e.lngLat.lat])
    this.preview()
  }

  private onDblClick = (e: maplibregl.MapMouseEvent) => {
    if (this.mode !== 'polygon') return
    e.preventDefault()
    if (this.vertices.length < 3) {
      this.cancel()
      return
    }
    const ring = [...this.vertices, this.vertices[0]] as LngLatRing
    this.finish(ring)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.cancel()
      this.showRegion(this.committed)
    }
  }
}
