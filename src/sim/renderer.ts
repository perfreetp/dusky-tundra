import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { SimulationEngine } from './engine'
import type { VehicleRuntime, YardData } from '../types'
import { densify, dist, lerpVec, norm, scale, sub } from './geometry'

const MAX_OCCUPANCY = 256
const RAIL_OFFSET = 0.72

export interface PickResult {
  vehicleId: string
  point: THREE.Vector3
}

export interface RendererOptions {
  onPick?: (pick: PickResult | null) => void
}

/**
 * three.js 场景封装。
 * 车辆/枕木/占用色块全部使用 InstancedMesh（少量 draw call），
 * 透明色块 depthWrite=false 且 renderOrder 靠后，依靠深度缓冲与不透明车辆正确排序。
 */
export class YardRenderer {
  readonly renderer: THREE.WebGLRenderer
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  readonly controls: OrbitControls
  private engine: SimulationEngine
  private yard: YardData
  readonly opts: RendererOptions

  private vehicleMesh!: THREE.InstancedMesh
  private roofMesh!: THREE.InstancedMesh
  private outlineMesh!: THREE.InstancedMesh
  private occupancyMesh!: THREE.InstancedMesh
  private dummy = new THREE.Object3D()
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private followVehicleId: string | null = null
  private gaugeMode = false
  private gaugeLines: THREE.LineSegments | null = null
  private trajectoryLines = new Map<string, THREE.Line>()
  private switchMarkers = new Map<string, THREE.Mesh>()
  private fps = 60
  private frameCount = 0
  private fpsTimer = 0
  onFps?: (fps: number, drawCalls: number) => void
  private pickEnabled = true

  constructor(container: HTMLElement, engine: SimulationEngine, opts: RendererOptions = {}) {
    this.engine = engine
    this.yard = engine.yard
    this.opts = opts

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.shadowMap.enabled = false
    container.appendChild(this.renderer.domElement)

    this.scene.background = new THREE.Color(0x10151c)
    this.scene.fog = new THREE.Fog(0x10151c, 500, 1100)

    this.camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.5, 3000)
    this.camera.position.set(120, 260, 340)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.maxPolarAngle = Math.PI * 0.49
    this.controls.minDistance = 15
    this.controls.maxDistance = 900
    this.controls.target.set(120, 0, -60)

    this.buildLights()
    this.buildGround()
    this.buildTracks()
    this.buildSwitches()
    this.buildVehicles()
    this.buildOccupancy()
    this.buildGaugeEnvelopes()
    this.bindEvents(container)
  }

  // ---------------------------------------------------------------- 场景搭建

  private buildLights(): void {
    this.scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x2a2f36, 0.9))
    const sun = new THREE.DirectionalLight(0xffffff, 1.4)
    sun.position.set(200, 320, 160)
    this.scene.add(sun)
    const fill = new THREE.DirectionalLight(0x88aaff, 0.35)
    fill.position.set(-200, 120, -200)
    this.scene.add(fill)
  }

  private buildGround(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1400, 700),
      new THREE.MeshStandardMaterial({ color: 0x1b2129, roughness: 1, metalness: 0 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.set(100, -0.02, -40)
    this.scene.add(ground)

    const grid = new THREE.GridHelper(1200, 120, 0x2c3a4a, 0x22303d)
    grid.position.set(100, 0, -40)
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.5
    this.scene.add(grid)
  }

  private buildTracks(): void {
    const railPositions: number[] = []
    const sleeperMatrices: THREE.Matrix4[] = []
    const color = new THREE.Color()

    for (const track of this.yard.tracks) {
      color.set(track.color)
      for (const edgeId of track.edgeIds) {
        const edge = this.yard.edges.find((e) => e.id === edgeId)!
        const pts = densify(edge.polyline, 5)
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1]
          const b = pts[i]
          const dir = norm(sub(b, a))
          const perp = { x: -dir.z, z: dir.x }
          for (const side of [-1, 1]) {
            const off = scale(perp, RAIL_OFFSET * side)
            railPositions.push(
              a.x + off.x, 0.18, a.z + off.z,
              b.x + off.x, 0.18, b.z + off.z,
            )
          }
          // 枕木（每 ~6m 一根）
          const segLen = dist(a, b)
          const n = Math.max(1, Math.round(segLen / 6))
          for (let k = 0; k < n; k++) {
            const t = (k + 0.5) / n
            const p = lerpVec(a, b, t)
            const heading = Math.atan2(dir.z, dir.x)
            this.dummy.position.set(p.x, 0.08, p.z)
            this.dummy.rotation.set(0, -heading, 0)
            this.dummy.scale.set(1, 1, 1)
            this.dummy.updateMatrix()
            sleeperMatrices.push(this.dummy.matrix.clone())
          }
        }
      }
    }

    const railGeo = new THREE.BufferGeometry()
    railGeo.setAttribute('position', new THREE.Float32BufferAttribute(railPositions, 3))
    const rails = new THREE.LineSegments(
      railGeo,
      new THREE.LineBasicMaterial({ color: 0x9fb2c8 }),
    )
    this.scene.add(rails)

    const sleeperMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(2.0, 0.12, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 0.9 }),
      sleeperMatrices.length,
    )
    sleeperMatrices.forEach((m, i) => sleeperMesh.setMatrixAt(i, m))
    sleeperMesh.instanceMatrix.needsUpdate = true
    this.scene.add(sleeperMesh)
  }

  private buildSwitches(): void {
    const geoOn = new THREE.CylinderGeometry(0.9, 0.9, 0.35, 12)
    const matOn = new THREE.MeshStandardMaterial({ color: 0x39d98a, emissive: 0x125c38 })
    const matOff = new THREE.MeshStandardMaterial({ color: 0xe05a5a, emissive: 0x5c1818 })
    for (const sw of this.yard.switches) {
      const node = this.yard.nodes.find((n) => n.id === sw.root)!
      const mesh = new THREE.Mesh(geoOn, matOn.clone())
      mesh.position.set(node.pos.x, 0.3, node.pos.z)
      mesh.userData.switchId = sw.id
      this.scene.add(mesh)
      this.switchMarkers.set(sw.id, mesh)
      void matOff
    }
  }

  private buildVehicles(): void {
    const count = this.yard.vehicles.length
    const bodyGeo = new THREE.BoxGeometry(1, 1, 1)
    bodyGeo.translate(0, 0.5, 0)
    const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0.15 })
    this.vehicleMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, count)
    this.vehicleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    const roofGeo = new THREE.BoxGeometry(1, 1, 1)
    roofGeo.translate(0, 1.02, 0)
    this.roofMesh = new THREE.InstancedMesh(
      roofGeo,
      new THREE.MeshStandardMaterial({ color: 0x2b323b, roughness: 0.8 }),
      count,
    )
    this.roofMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    // 超限车辆红色描边线框
    const outlineGeo = new THREE.BoxGeometry(1.06, 1.06, 1.06)
    outlineGeo.translate(0, 0.5, 0)
    this.outlineMesh = new THREE.InstancedMesh(
      outlineGeo,
      new THREE.MeshBasicMaterial({ color: 0xff2d2d, wireframe: true, transparent: true, opacity: 0.9 }),
      count,
    )
    this.outlineMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.outlineMesh.count = 0

    this.scene.add(this.vehicleMesh, this.roofMesh, this.outlineMesh)
    this.updateVehicleColors()
  }

  private updateVehicleColors(): void {
    const c = new THREE.Color()
    this.yard.vehicles.forEach((vs, i) => {
      c.set(vs.color)
      this.vehicleMesh.setColorAt(i, c)
    })
    if (this.vehicleMesh.instanceColor) this.vehicleMesh.instanceColor.needsUpdate = true
  }

  private buildOccupancy(): void {
    const geo = new THREE.BoxGeometry(1, 1, 1)
    geo.translate(0, 0.5, 0)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.22,
      depthWrite: false, // 关键：不写深度，靠不透明车辆的深度缓冲正确遮挡
    })
    this.occupancyMesh = new THREE.InstancedMesh(geo, mat, MAX_OCCUPANCY)
    this.occupancyMesh.renderOrder = 10 // 在所有不透明物体之后绘制
    this.occupancyMesh.count = 0
    this.scene.add(this.occupancyMesh)
  }

  /** 沿每条股道构建建筑限界线框（两侧半宽轮廓沿线路拉伸） */
  private buildGaugeEnvelopes(): void {
    const positions: number[] = []
    const gauge = this.yard.gauge
    for (const track of this.yard.tracks) {
      for (const edgeId of track.edgeIds) {
        const edge = this.yard.edges.find((e) => e.id === edgeId)!
        const pts = densify(edge.polyline, 10)
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1]
          const b = pts[i]
          const dir = norm(sub(b, a))
          const perp = { x: -dir.z, z: dir.x }
          for (const hw of gauge.halfWidths) {
            for (const side of [-1, 1]) {
              const off = scale(perp, hw.w * side)
              positions.push(
                a.x + off.x, hw.y, a.z + off.z,
                b.x + off.x, hw.y, b.z + off.z,
              )
            }
          }
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    this.gaugeLines = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0xffd54f, transparent: true, opacity: 0.45 }),
    )
    this.gaugeLines.visible = false
    this.scene.add(this.gaugeLines)
  }

  // ---------------------------------------------------------------- 交互

  private bindEvents(container: HTMLElement): void {
    const dom = this.renderer.domElement
    dom.addEventListener('pointermove', (e) => {
      const rect = dom.getBoundingClientRect()
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    })
    dom.addEventListener('click', (e) => {
      if (!this.pickEnabled) return
      const rect = dom.getBoundingClientRect()
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      const hit = this.pickVehicle()
      this.opts.onPick?.(hit)
    })
    window.addEventListener('resize', () => this.resize(container))
  }

  private pickVehicle(): PickResult | null {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObject(this.vehicleMesh, false)
    if (hits.length === 0 || hits[0].instanceId === undefined) return null
    const id = this.yard.vehicles[hits[0].instanceId].id
    return { vehicleId: id, point: hits[0].point }
  }

  /** 屏幕坐标 -> 地面股道（拖放目标判定） */
  pickTrackAt(clientX: number, clientY: number): string | null {
    const dom = this.renderer.domElement
    const rect = dom.getBoundingClientRect()
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const point = new THREE.Vector3()
    if (!this.raycaster.ray.intersectPlane(plane, point)) return null
    // 找最近的边 -> 股道
    let best: { trackId: string; d: number } | null = null
    for (const edge of this.yard.edges) {
      for (let i = 1; i < edge.polyline.length; i++) {
        const a = edge.polyline[i - 1]
        const b = edge.polyline[i]
        const d = this.pointSegmentDistance(point.x, point.z, a.x, a.z, b.x, b.z)
        if (!best || d < best.d) best = { trackId: edge.trackId, d }
      }
    }
    return best && best.d < 6 ? best.trackId : null
  }

  private pointSegmentDistance(
    px: number, pz: number,
    ax: number, az: number,
    bx: number, bz: number,
  ): number {
    const dx = bx - ax
    const dz = bz - az
    const l2 = dx * dx + dz * dz || 1
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2))
    return Math.hypot(px - (ax + dx * t), pz - (az + dz * t))
  }

  setFollow(vehicleId: string | null): void {
    this.followVehicleId = vehicleId
  }

  setGaugeMode(on: boolean): void {
    this.gaugeMode = on
    if (this.gaugeLines) this.gaugeLines.visible = on
  }

  setPickEnabled(on: boolean): void {
    this.pickEnabled = on
  }

  /** 高亮道岔标记 */
  refreshSwitchMarkers(): void {
    for (const sw of this.yard.switches) {
      const mesh = this.switchMarkers.get(sw.id)
      if (!mesh) continue
      const mat = mesh.material as THREE.MeshStandardMaterial
      const open = sw.state === 0 ? 0x39d98a : 0xf2b134
      mat.color.setHex(open)
      mat.emissive.setHex(open).multiplyScalar(0.25)
    }
  }

  // ---------------------------------------------------------------- 每帧更新

  update(dt: number): void {
    this.updateVehicleMatrices()
    this.updateOccupancy()
    this.refreshSwitchMarkers()
    this.updateTrajectoryLines()
    this.updateFollow(dt)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)

    this.frameCount += 1
    this.fpsTimer += dt
    if (this.fpsTimer >= 0.5) {
      this.fps = this.frameCount / this.fpsTimer
      this.onFps?.(Math.round(this.fps), this.renderer.info.render.calls)
      this.frameCount = 0
      this.fpsTimer = 0
    }
  }

  private updateVehicleMatrices(): void {
    let outlineCount = 0
    const vehicles = this.yard.vehicles
    for (let i = 0; i < vehicles.length; i++) {
      const vs = vehicles[i]
      const vr: VehicleRuntime = this.engine.vehicles.get(vs.id)!
      this.dummy.position.set(vr.worldPos.x, 0.2, vr.worldPos.z)
      this.dummy.rotation.set(0, -vr.heading, 0)
      this.dummy.scale.set(vs.width, vs.height, vs.length)
      this.dummy.updateMatrix()
      this.vehicleMesh.setMatrixAt(i, this.dummy.matrix)
      this.roofMesh.setMatrixAt(i, this.dummy.matrix)

      if (vs.outOfGauge && this.gaugeMode) {
        this.outlineMesh.setMatrixAt(outlineCount, this.dummy.matrix)
        outlineCount += 1
      }
    }
    this.vehicleMesh.instanceMatrix.needsUpdate = true
    this.roofMesh.instanceMatrix.needsUpdate = true
    this.outlineMesh.count = outlineCount
    this.outlineMesh.instanceMatrix.needsUpdate = true
    this.outlineMesh.visible = outlineCount > 0
  }

  private updateOccupancy(): void {
    const intervals = this.engine.getOccupancy()
    const n = Math.min(intervals.length, MAX_OCCUPANCY)
    for (let i = 0; i < n; i++) {
      const iv = intervals[i]
      const length = iv.maxOffset - iv.minOffset
      const mid = (iv.minOffset + iv.maxOffset) / 2
      const { pos, heading } = this.engine.network.sampleLocation({ edgeId: iv.edgeId, offset: mid })
      this.dummy.position.set(pos.x, 0.05, pos.z)
      this.dummy.rotation.set(0, -heading, 0)
      this.dummy.scale.set(3.4, 0.1, Math.max(0.5, length))
      this.dummy.updateMatrix()
      this.occupancyMesh.setMatrixAt(i, this.dummy.matrix)
    }
    this.occupancyMesh.count = n
    this.occupancyMesh.instanceMatrix.needsUpdate = true
  }

  private trajectorySignatures = new Map<string, string>()

  private updateTrajectoryLines(): void {
    const activeIds = new Set<string>()
    for (const consist of this.engine.consists.values()) {
      if (!consist.trajectory) continue
      activeIds.add(consist.id)
      // 仅当轨迹点数/末点/状态变化时才重建几何，避免每帧分配
      const traj = consist.trajectory
      const last = traj[traj.length - 1]
      const sig = `${traj.length}:${last.s.toFixed(1)}:${consist.status}`
      let line = this.trajectoryLines.get(consist.id)
      if (!line) {
        const points = traj.map((p) => new THREE.Vector3(p.pos.x, 0.35, p.pos.z))
        line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: consist.status === 'waiting' ? 0xff8a5a : 0x5ad1ff,
            transparent: true,
            opacity: 0.8,
          }),
        )
        this.scene.add(line)
        this.trajectoryLines.set(consist.id, line)
        this.trajectorySignatures.set(consist.id, sig)
      } else if (this.trajectorySignatures.get(consist.id) !== sig) {
        const points = traj.map((p) => new THREE.Vector3(p.pos.x, 0.35, p.pos.z))
        line.geometry.dispose()
        line.geometry = new THREE.BufferGeometry().setFromPoints(points)
        ;(line.material as THREE.LineBasicMaterial).color.setHex(
          consist.status === 'waiting' ? 0xff8a5a : 0x5ad1ff,
        )
        this.trajectorySignatures.set(consist.id, sig)
      }
    }
    for (const [id, line] of this.trajectoryLines) {
      if (!activeIds.has(id)) {
        this.scene.remove(line)
        line.geometry.dispose()
        this.trajectoryLines.delete(id)
        this.trajectorySignatures.delete(id)
      }
    }
  }

  private updateFollow(dt: number): void {
    if (!this.followVehicleId) return
    const vr = this.engine.vehicles.get(this.followVehicleId)
    if (!vr) return
    const target = new THREE.Vector3(vr.worldPos.x, 0, vr.worldPos.z)
    const k = 1 - Math.pow(0.001, dt) // 帧率无关平滑
    this.controls.target.lerp(target, Math.min(1, k))
    const offset = this.camera.position.clone().sub(this.controls.target)
    if (offset.length() > 60) offset.setLength(45)
    this.camera.position.copy(this.controls.target).add(offset)
  }

  // ---------------------------------------------------------------- 生命周期

  resize(container: HTMLElement): void {
    const w = container.clientWidth
    const h = container.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  dispose(): void {
    this.renderer.dispose()
    this.renderer.domElement.remove()
    this.trajectoryLines.forEach((l) => l.geometry.dispose())
  }

  get currentFps(): number {
    return this.fps
  }
}
