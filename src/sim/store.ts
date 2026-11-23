import type { Consist, SimEvent } from '../types'
import type { SimulationEngine } from './engine'
import type { YardRenderer } from './renderer'

export interface Snapshot {
  simTime: number
  running: boolean
  timeScale: number
  fps: number
  drawCalls: number
  vehicleCount: number
  consistCount: number
  selectedVehicleId: string | null
  events: SimEvent[]
  /** 车辆 id -> 所在股道名/状态（用于面板列表） */
  vehicleRows: {
    id: string
    type: string
    trackName: string
    status: Consist['status']
    outOfGauge: boolean
    speed: number
    eta: number | null
  }[]
  movingCount: number
  waitingCount: number
  lastRerouteMs: number | null
  rerouteAffected: number
}

type Listener = () => void

/**
 * 仿真与 React 之间的桥：
 * RAF 以 60fps 驱动引擎/渲染器，React 仅按 ~4Hz 取快照，避免高频重渲染。
 */
export class SimStore {
  private engine: SimulationEngine
  private renderer: YardRenderer | null = null
  private listeners = new Set<Listener>()
  private snapshot: Snapshot
  private rafId = 0
  private lastTime = 0
  private uiAccumulator = 0
  fps = 60
  drawCalls = 0

  constructor(engine: SimulationEngine) {
    this.engine = engine
    this.snapshot = this.buildSnapshot()
  }

  attachRenderer(renderer: YardRenderer): void {
    this.renderer = renderer
    renderer.onFps = (fps, drawCalls) => {
      this.fps = fps
      this.drawCalls = drawCalls
    }
  }

  getEngine(): SimulationEngine {
    return this.engine
  }

  subscribe = (fn: Listener): (() => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = (): Snapshot => this.snapshot

  start(): void {
    if (this.rafId) return
    this.lastTime = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - this.lastTime) / 1000)
      this.lastTime = now
      this.engine.step(dt)
      this.renderer?.update(dt)
      this.uiAccumulator += dt
      if (this.uiAccumulator >= 0.25) {
        this.uiAccumulator = 0
        this.publish()
      }
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  private publish(): void {
    this.snapshot = this.buildSnapshot()
    this.listeners.forEach((fn) => fn())
  }

  /** 操作后立即刷新一次 UI */
  refreshNow(): void {
    this.publish()
  }

  private buildSnapshot(): Snapshot {
    const eng = this.engine
    const vehicleRows = eng.yard.vehicles.map((vs) => {
      const vr = eng.vehicles.get(vs.id)!
      const cid = vr.consistId
      const consist = cid ? eng.consists.get(cid) : undefined
      const edge = eng.network.edges.get(vr.location.edgeId)
      const track = edge ? eng.network.tracks.get(edge.trackId) : undefined
      const eta = consist?.order ? eng.etaMap.get(consist.order.id) : undefined
      return {
        id: vs.id,
        type: vs.type,
        trackName: track?.name ?? '—',
        status: consist?.status ?? 'idle',
        outOfGauge: vs.outOfGauge,
        speed: consist?.speed ?? 0,
        eta: eta !== undefined ? Math.max(0, eta - eng.simTime) : null,
      }
    })
    let moving = 0
    let waiting = 0
    for (const c of eng.consists.values()) {
      if (c.status === 'moving' || c.status === 'coasting') moving += 1
      if (c.status === 'waiting') waiting += 1
    }
    return {
      simTime: eng.simTime,
      running: eng.running,
      timeScale: eng.timeScale,
      fps: this.fps,
      drawCalls: this.drawCalls,
      vehicleCount: eng.vehicles.size,
      consistCount: eng.consists.size,
      selectedVehicleId: eng.selectedVehicleId,
      events: [...eng.events].slice(-40).reverse(),
      vehicleRows,
      movingCount: moving,
      waitingCount: waiting,
      lastRerouteMs: eng.lastReroute?.elapsedMs ?? null,
      rerouteAffected: eng.lastReroute?.affectedConsists ?? 0,
    }
  }
}
