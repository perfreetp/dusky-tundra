import * as THREE from 'three'
import maplibregl from 'maplibre-gl'
import type { BirdPoint, GridData } from '../core/types'
import { bandIndex, type Ramp } from '../core/ramps'

const TERRAIN_EXAGGERATION = 3

/**
 * MapLibre 自定义图层:用 three.js InstancedMesh 渲染全部鸟类点位,
 * 2 万级实例一次 draw call;3D 模式下按适宜度档位抬升高度,
 * 并叠加由水深栅格生成的地形网格,便于观察点位与地形相对高度。
 */
export class BirdPointsLayer implements maplibregl.CustomLayerInterface {
  readonly id = 'bird-points-3d'
  readonly type = 'custom' as const
  readonly renderingMode = '3d' as const

  private map!: maplibregl.Map
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private mesh: THREE.InstancedMesh | null = null
  private terrain: THREE.Mesh | null = null
  private points: BirdPoint[] = []
  private grid: GridData | null = null
  private ramp: Ramp | null = null
  private mode3D = false
  private exaggeration = 1

  onAdd(map: maplibregl.Map, gl: WebGLRenderingContext) {
    this.map = map
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera()
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const dir = new THREE.DirectionalLight(0xffffff, 1.0)
    dir.position.set(0.4, -0.5, 1).normalize()
    this.scene.add(dir)
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    })
    this.renderer.autoClear = false
  }

  onRemove() {
    this.disposeMesh()
    this.disposeTerrain()
    this.renderer?.dispose()
  }

  setData(points: BirdPoint[], grid: GridData, ramp: Ramp) {
    this.points = points
    this.grid = grid
    this.ramp = ramp
    this.rebuildTerrain()
    this.rebuildInstances()
  }

  setRamp(ramp: Ramp) {
    this.ramp = ramp
    this.recolor()
  }

  setMode3D(v: boolean) {
    this.mode3D = v
    if (this.terrain) this.terrain.visible = v
    this.rebuildInstances()
  }

  setExaggeration(v: number) {
    this.exaggeration = v
    this.rebuildInstances()
  }

  /** 重算后刷新实例高度与颜色(不重建几何体) */
  refresh() {
    this.rebuildInstances()
  }

  private meterScale() {
    return maplibregl.MercatorCoordinate.meterInMercatorCoordinateUnits()
  }

  private terrainHeightAt(lng: number, lat: number): number {
    const g = this.grid
    if (!g) return 0
    const c = Math.min(
      g.cols - 1,
      Math.max(0, Math.floor(((lng - g.minLng) / (g.maxLng - g.minLng)) * g.cols)),
    )
    const r = Math.min(
      g.rows - 1,
      Math.max(0, Math.floor(((g.maxLat - lat) / (g.maxLat - g.minLat)) * g.rows)),
    )
    const i = r * g.cols + c
    return g.depth[i] > 0 ? -g.depth[i] : 0.25 * g.veg[i]
  }

  private rebuildInstances() {
    this.disposeMesh()
    if (!this.points.length || !this.ramp) return
    const n = this.points.length
    const geo = new THREE.ConeGeometry(1, 1, 6)
    geo.rotateX(Math.PI / 2) // 锥体轴向转为 +Z(墨卡托坐标系的"上")
    geo.translate(0, 0, 0.5) // 底部落在 z=0
    const mat = new THREE.MeshLambertMaterial()
    const mesh = new THREE.InstancedMesh(geo, mat, n)
    mesh.frustumCulled = false
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const mScale = this.meterScale()
    const palette = this.ramp.colors
    for (let i = 0; i < n; i++) {
      const p = this.points[i]
      const mc = maplibregl.MercatorCoordinate.fromLngLat([p.lng, p.lat], 0)
      const band = bandIndex(p.suitability)
      // 高度分层:适宜度档位 × 10m × 夸张系数 + 物种栖息高度
      const lift = this.mode3D ? (band * 10 + p.height) * this.exaggeration : 0
      const base = this.mode3D
        ? Math.min(0, this.terrainHeightAt(p.lng, p.lat) * TERRAIN_EXAGGERATION)
        : 0
      const radius = this.mode3D ? 6 : 4.5
      const height = this.mode3D ? 16 : 10
      dummy.position.set(mc.x, mc.y, (base + lift) * mScale)
      dummy.scale.set(radius * mScale, radius * mScale, height * mScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, color.set(palette[band]))
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.mesh = mesh
    this.scene.add(mesh)
  }

  private recolor() {
    if (!this.mesh || !this.ramp) return
    const color = new THREE.Color()
    const palette = this.ramp.colors
    for (let i = 0; i < this.points.length; i++) {
      this.mesh.setColorAt(i, color.set(palette[bandIndex(this.points[i].suitability)]))
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
  }

  private rebuildTerrain() {
    this.disposeTerrain()
    const g = this.grid
    if (!g) return
    const segC = 80
    const segR = 60
    const vertCount = (segC + 1) * (segR + 1)
    const positions = new Float32Array(vertCount * 3)
    const colors = new Float32Array(vertCount * 3)
    const mScale = this.meterScale()
    const color = new THREE.Color()
    for (let r = 0; r <= segR; r++) {
      for (let c = 0; c <= segC; c++) {
        const lng = g.minLng + (c / segC) * (g.maxLng - g.minLng)
        const lat = g.maxLat - (r / segR) * (g.maxLat - g.minLat)
        const mc = maplibregl.MercatorCoordinate.fromLngLat([lng, lat], 0)
        const elev = this.terrainHeightAt(lng, lat)
        const vi = (r * (segC + 1) + c) * 3
        positions[vi] = mc.x
        positions[vi + 1] = mc.y
        positions[vi + 2] = elev * TERRAIN_EXAGGERATION * mScale
        const gi = Math.min(g.cols - 1, Math.floor((c / segC) * g.cols))
        const ri = Math.min(g.rows - 1, Math.floor((r / segR) * g.rows))
        const cell = ri * g.cols + gi
        if (g.depth[cell] > 0) {
          color.setHSL(0.58, 0.45, 0.35 + 0.2 * Math.min(1, g.depth[cell]))
        } else {
          color.setHSL(0.28, 0.35, 0.3 + 0.25 * g.veg[cell])
        }
        colors[vi] = color.r
        colors[vi + 1] = color.g
        colors[vi + 2] = color.b
      }
    }
    const index: number[] = []
    for (let r = 0; r < segR; r++) {
      for (let c = 0; c < segC; c++) {
        const a = r * (segC + 1) + c
        const b = a + 1
        const d = a + segC + 1
        const e = d + 1
        index.push(a, d, b, b, d, e)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setIndex(index)
    geo.computeVertexNormals()
    const mat = new THREE.MeshLambertMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
    })
    this.terrain = new THREE.Mesh(geo, mat)
    this.terrain.visible = this.mode3D
    this.scene.add(this.terrain)
  }

  private disposeMesh() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      ;(this.mesh.material as THREE.Material).dispose()
      this.mesh.dispose()
      this.mesh = null
    }
  }

  private disposeTerrain() {
    if (this.terrain) {
      this.scene.remove(this.terrain)
      this.terrain.geometry.dispose()
      ;(this.terrain.material as THREE.Material).dispose()
      this.terrain = null
    }
  }

  render(_gl: WebGLRenderingContext, arg: unknown) {
    // maplibre v3 传矩阵数组,v4 传 { matrix, ... }
    const matrix =
      Array.isArray(arg) || ArrayBuffer.isView(arg)
        ? (arg as ArrayLike<number>)
        : ((arg as { matrix: ArrayLike<number> }).matrix ??
          (arg as { defaultProjectionData?: { matrix: ArrayLike<number> } }).defaultProjectionData
            ?.matrix)
    if (!matrix) return
    this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix as number[])
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert()
    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
  }
}
