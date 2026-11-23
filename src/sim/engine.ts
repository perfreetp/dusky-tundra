import type {
  Consist,
  EdgeLocation,
  GaugeProfile,
  MoveOrder,
  ShuntingJob,
  SimEvent,
  SwitchState,
  TrackDef,
  TrajPoint,
  VehicleRuntime,
  VehicleStatic,
  YardData,
} from '../types'
import { COUPLE_THRESHOLD } from '../types'
import {
  brakingDistance,
  dist,
  uid,
} from './geometry'
import { YardNetwork } from './network'

const ACCEL = 0.8 // 牵引加速度 m/s²
const DECEL = 1.0 // 常用制动减速度
const FRICTION = 0.28 // 溜放阻力减速度
const SHUNT_SPEED = 6.0 // 调车最高速度
const BUMPER_MARGIN = 5 // 距挡车器停留余量
const PARK_GAP = 0.3 // 停留车钩间隔（米）
const LOOK_AHEAD = 250 // 障碍检测前视距离（覆盖最长制动距离）
const EVENT_CAP = 300

export interface OccupancyInterval {
  edgeId: string
  minOffset: number
  maxOffset: number
}

export interface GaugeViolation {
  vehicleId: string
  points: { x: number; y: number; limit: number }[]
  maxExceed: number
}

export interface RerouteStat {
  time: number
  affectedConsists: number
  elapsedMs: number
}

interface ActiveTrajectory {
  points: TrajPoint[]
  switches: string[]
  snapshot: Record<string, SwitchState>
  targetTrackId: string
  targetHeadS: number
}

export class SimulationEngine {
  readonly network = new YardNetwork()
  readonly yard: YardData
  vehicles = new Map<string, VehicleRuntime>()
  consists = new Map<string, Consist>()
  events: SimEvent[] = []
  simTime = 0
  running = true
  timeScale = 1
  selectedVehicleId: string | null = null
  /** 最近一次道岔联动重算统计（用于 200ms 时限验证） */
  lastReroute: RerouteStat | null = null
  /** 订单预计到达时刻（仿真秒） */
  etaMap = new Map<string, number>()
  /** 轨迹缓存：车辆/车列运行时附加轨迹 */
  private trajectories = new Map<string, ActiveTrajectory>()
  private orderSeq = 0

  constructor(yard: YardData) {
    this.yard = yard
    this.network.load(yard.nodes, yard.edges, yard.switches, yard.tracks)
    this.reset()
  }

  // ---------------------------------------------------------------- 初始化

  reset(): void {
    this.vehicles.clear()
    this.consists.clear()
    this.trajectories.clear()
    this.etaMap.clear()
    this.events = []
    this.simTime = 0

    for (const vs of this.yard.vehicles) {
      const loc = this.yard.initialPlacement[vs.id] ?? {
        edgeId: this.yard.edges[0].id,
        offset: Math.min(20, this.yard.edges[0].length / 2),
      }
      const sample = this.network.sampleLocation(loc)
      this.vehicles.set(vs.id, {
        static: vs,
        consistId: null,
        location: loc,
        worldPos: sample.pos,
        heading: sample.heading,
      })
    }

    // 按边分组，offset 降序（东端为车头方向）组成初始车列
    const byEdge = new Map<string, VehicleRuntime[]>()
    for (const vr of this.vehicles.values()) {
      const list = byEdge.get(vr.location.edgeId)
      if (list) list.push(vr)
      else byEdge.set(vr.location.edgeId, [vr])
    }
    for (const [edgeId, list] of byEdge) {
      // offset 升序：最靠近边 n1 端的车辆为车列首车（前端朝向 n1 方向）
      list.sort((a, b) => a.location.offset - b.location.offset)
      const ids = list.map((v) => v.static.id)
      const headVeh = list[0]
      const head: EdgeLocation = {
        edgeId,
        offset: Math.max(0, headVeh.location.offset - headVeh.static.length / 2),
      }
      const consist = this.createConsist(ids, head, false)
      consist.status = 'idle'
      this.bakeIdleLocations(consist)
    }
    this.emit('info', `仿真初始化完成：在场车辆 ${this.vehicles.size} 辆，车列 ${this.consists.size} 列`)
  }

  private createConsist(
    vehicleIds: string[],
    head: EdgeLocation,
    isCoasting: boolean,
  ): Consist {
    const id = uid('CST')
    const totalLength = vehicleIds.reduce(
      (sum, vid) => sum + this.vehicles.get(vid)!.static.length,
      0,
    )
    const consist: Consist = {
      id,
      vehicleIds,
      head,
      totalLength,
      status: 'idle',
      speed: 0,
      order: null,
      trajectory: null,
      trajS: 0,
      waitReason: null,
      isCoasting,
    }
    this.consists.set(id, consist)
    for (const vid of vehicleIds) this.vehicles.get(vid)!.consistId = id
    return consist
  }

  /** 将车列各车位置固化为边位置（停车时保留当前世界位置，仅换算到所在边） */
  private bakeIdleLocations(consist: Consist): void {
    for (const vid of consist.vehicleIds) {
      const vr = this.vehicles.get(vid)!
      // 运行中车辆已有每帧更新的 location/worldPos；停车时仅做校验性重采样
      const sample = this.network.sampleLocation(vr.location)
      vr.worldPos = sample.pos
      vr.heading = sample.heading
    }
    const firstVr = this.vehicles.get(consist.vehicleIds[0])!
    consist.head = {
      edgeId: firstVr.location.edgeId,
      offset: Math.max(0, firstVr.location.offset - firstVr.static.length / 2),
    }
  }

  // ---------------------------------------------------------------- 调车令

  /**
   * 下发移动令：将含 vehicleId 的（子）车列调往目标股道。
   * 若车辆位于车列中部/尾部，先执行解钩拆分。
   */
  dispatchMove(
    vehicleId: string,
    targetTrackId: string,
    kind: ShuntingJob['kind'] = 'transfer',
    planId = 'MANUAL',
  ): MoveOrder | null {
    const vr = this.vehicles.get(vehicleId)
    if (!vr || !vr.consistId) return null
    const consist = this.consists.get(vr.consistId)!
    if (consist.status === 'moving' || consist.status === 'coasting' || consist.status === 'waiting') {
      this.emit('info', `车辆 ${vehicleId} 所在车列正在作业中，无法重复下达计划`, [vehicleId])
      return null
    }

    let movingConsist = consist
    const idx = consist.vehicleIds.indexOf(vehicleId)
    if (idx > 0) {
      movingConsist = this.splitConsist(consist, idx)
      this.emit('uncouple', `解钩：${vehicleId} 及后方 ${movingConsist.vehicleIds.length - 1} 辆拆分为新车列`, movingConsist.vehicleIds)
    }

    const target = this.parkingLocation(targetTrackId, movingConsist.totalLength)
    if (!target) {
      this.emit('info', `目标股道 ${this.network.tracks.get(targetTrackId)?.name ?? targetTrackId} 空间不足`, undefined, targetTrackId)
      return null
    }

    this.orderSeq += 1
    const order: MoveOrder = {
      id: `ORD_${this.orderSeq}`,
      planId,
      vehicleId,
      targetTrackId,
      targetOffset: target.offset,
      maxSpeed: SHUNT_SPEED,
      createdAt: this.simTime,
    }
    movingConsist.order = order
    movingConsist.isCoasting = kind === 'uncouple'
    const ok = this.routeConsist(movingConsist, target)
    if (!ok) {
      movingConsist.status = 'waiting'
      movingConsist.waitReason = '道岔未开通，等待进路'
      this.emit('waiting', `车列 ${movingConsist.id} 等待进路开通`, movingConsist.vehicleIds, targetTrackId)
    } else {
      movingConsist.status = movingConsist.isCoasting ? 'coasting' : 'moving'
      this.emit(
        'info',
        `${movingConsist.isCoasting ? '溜放' : '调车'}开始：${movingConsist.vehicleIds.length} 辆 → ${this.network.tracks.get(targetTrackId)?.name}`,
        movingConsist.vehicleIds,
        targetTrackId,
      )
    }
    return order
  }

  executeJob(job: ShuntingJob): MoveOrder | null {
    return this.dispatchMove(job.vehicleId, job.toTrackId, job.kind, job.id)
  }

  /** 手动解钩：指定车辆及其后段拆分为新车列 */
  uncouple(vehicleId: string): Consist | null {
    const vr = this.vehicles.get(vehicleId)
    if (!vr?.consistId) return null
    const consist = this.consists.get(vr.consistId)!
    const idx = consist.vehicleIds.indexOf(vehicleId)
    if (idx <= 0) return null
    const rear = this.splitConsist(consist, idx)
    this.emit('uncouple', `手动解钩：拆分出车列 ${rear.id}（${rear.vehicleIds.length} 辆）`, rear.vehicleIds)
    return rear
  }

  private splitConsist(consist: Consist, atIndex: number): Consist {
    const rearIds = consist.vehicleIds.splice(atIndex)
    consist.totalLength -= rearIds.reduce(
      (s, id) => s + this.vehicles.get(id)!.static.length,
      0,
    )
    const firstRear = this.vehicles.get(rearIds[0])!
    const head: EdgeLocation = { ...firstRear.location }
    head.offset += firstRear.static.length / 2
    const rear = this.createConsist(rearIds, head, consist.status === 'coasting')
    if (consist.status === 'idle') {
      rear.status = 'idle'
      this.bakeIdleLocations(rear)
    } else {
      // 运行中拆分：后段继承轨迹，沿原路径滑行
      rear.status = 'coasting'
      rear.speed = consist.speed
      rear.isCoasting = true
      const active = this.trajectories.get(consist.id)
      if (active) {
        const rearHeadTp = this.network.sampleTrajectory(consist.trajectory!, consist.trajS - this.distanceBefore(consist, atIndex))
        const built = this.network.buildTrajectory(rearHeadTp, active.points[active.points.length - 1])
        if (built) {
          rear.trajectory = built.points
          rear.trajS = 0
          this.trajectories.set(rear.id, {
            ...active,
            points: built.points,
            switches: built.switches,
            snapshot: this.network.switchSnapshot(built.switches),
          })
        }
      }
    }
    return rear
  }

  private distanceBefore(consist: Consist, index: number): number {
    let d = 0
    for (let i = 0; i < index; i++) d += this.vehicles.get(consist.vehicleIds[i])!.static.length
    return d
  }

  /** 计算目标股道停车位置（车头前端 EdgeLocation） */
  private parkingLocation(trackId: string, consistLength: number): EdgeLocation | null {
    const track = this.network.tracks.get(trackId)
    if (!track) return null
    const totalLen = this.network.trackLength(trackId)
    // 已停车车辆中最靠西（最小 trackOffset）的车钩位置
    let minCoupler = totalLen - BUMPER_MARGIN
    for (const vr of this.vehicles.values()) {
      const edge = this.network.edges.get(vr.location.edgeId)
      if (!edge || edge.trackId !== trackId) continue
      const couplerOffset = vr.location.offset - vr.static.length / 2
      const trackOff = this.edgeOffsetToTrackOffset(track, vr.location.edgeId, couplerOffset)
      if (trackOff !== null) minCoupler = Math.min(minCoupler, trackOff)
    }
    // 本车列前端应停在最西端车钩西侧 PARK_GAP 处
    const headTrackOffset = minCoupler - PARK_GAP
    // 车列向后（n2 方向）延伸 consistLength，需在股道范围内
    if (headTrackOffset < 0 || headTrackOffset + consistLength > totalLen + 1e-6) return null
    return this.network.trackOffsetToLocation(trackId, headTrackOffset)
  }

  private edgeOffsetToTrackOffset(
    track: TrackDef,
    edgeId: string,
    edgeOffset: number,
  ): number | null {
    let acc = 0
    for (const id of track.edgeIds) {
      const edge = this.network.edges.get(id)!
      if (id === edgeId) return acc + edgeOffset
      acc += edge.length
    }
    return null
  }

  // ---------------------------------------------------------------- 路径

  private routeConsist(consist: Consist, target: EdgeLocation): boolean {
    // 先按当前道岔位置尝试；不可达则搜索进路并自动搬动道岔
    let built = this.network.buildTrajectory(consist.head, target)
    if (!built) {
      const fromEdge = this.network.edges.get(consist.head.edgeId)!
      const toEdge = this.network.edges.get(target.edgeId)!
      const candidates: { start: string; goal: string }[] = [
        { start: fromEdge.n1, goal: toEdge.n1 },
        { start: fromEdge.n1, goal: toEdge.n2 },
        { start: fromEdge.n2, goal: toEdge.n1 },
        { start: fromEdge.n2, goal: toEdge.n2 },
      ]
      let bestRoute: { nodes: string[]; requiredStates: { switchId: string; state: SwitchState }[] } | null = null
      for (const c of candidates) {
        const route = this.network.findRoute(c.start, c.goal)
        if (route && (!bestRoute || route.nodes.length < bestRoute.nodes.length)) bestRoute = route
      }
      if (!bestRoute) return false
      const changed = this.network.openRoute(bestRoute.requiredStates)
      // 道岔搬动联动：重算其他在途车列
      for (const swId of changed) this.onSwitchChanged(swId)
      if (changed.length > 0) {
        this.emit(
          'reroute',
          `进路开通：自动搬动道岔 ${changed.join(', ')}`,
          consist.vehicleIds,
          consist.order?.targetTrackId,
        )
      }
      built = this.network.buildTrajectory(consist.head, target)
      if (!built) return false
    }
    // 在轨迹起点前预铺车尾延伸段，保证车列所有车辆都能在轨迹上采样
    built = this.extendTrajectoryBackward(built.points, consist.totalLength, built.switches)
    consist.trajectory = built.points
    consist.trajS = 0
    const active: ActiveTrajectory = {
      points: built.points,
      switches: built.switches,
      snapshot: this.network.switchSnapshot(built.switches),
      targetTrackId: consist.order!.targetTrackId,
      targetHeadS: built.points[built.points.length - 1].s,
    }
    this.trajectories.set(consist.id, active)
    this.updateEta(consist)
    return true
  }

  private updateEta(consist: Consist): void {
    if (!consist.order || !consist.trajectory) return
    const active = this.trajectories.get(consist.id)!
    const remain = active.targetHeadS - consist.trajS
    const vAvg = Math.max(consist.speed, consist.order.maxSpeed * 0.6)
    const seconds = remain / vAvg + 2
    this.etaMap.set(consist.order.id, this.simTime + seconds)
  }

  /** 道岔切换：联动重算所有受影响车列路径，要求 200ms 内完成 */
  onSwitchChanged(switchId: string): RerouteStat {
    const t0 = performance.now()
    let affected = 0
    for (const consist of this.consists.values()) {
      const active = this.trajectories.get(consist.id)
      if (!active || !active.switches.includes(switchId)) continue
      affected += 1
      const stillOpen = this.network.isTrajectoryOpen(active.snapshot)
      if (stillOpen) continue // 本车列进路未被破坏
      // 进路破坏：从当前位置重新寻路到原目标
      const target = this.network.trackOffsetToLocation(
        active.targetTrackId,
        consist.order?.targetOffset ?? this.network.trackLength(active.targetTrackId) - BUMPER_MARGIN,
      )
      if (target) {
        const built = this.network.buildTrajectory(consist.head, target)
        if (built) {
          consist.trajectory = built.points
          consist.trajS = 0
          this.trajectories.set(consist.id, {
            points: built.points,
            switches: built.switches,
            snapshot: this.network.switchSnapshot(built.switches),
            targetTrackId: active.targetTrackId,
            targetHeadS: built.points[built.points.length - 1].s,
          })
          consist.status = consist.isCoasting ? 'coasting' : 'moving'
          consist.waitReason = null
          this.updateEta(consist)
          this.emit('reroute', `道岔 ${switchId} 切换：车列 ${consist.id} 路径已重算，ETA 已更新`, consist.vehicleIds)
          continue
        }
      }
      consist.status = 'waiting'
      consist.waitReason = `道岔 ${switchId} 切换后暂无可用进路`
      this.emit('waiting', `车列 ${consist.id} 等待进路`, consist.vehicleIds)
    }
    const elapsedMs = performance.now() - t0
    this.lastReroute = { time: this.simTime, affectedConsists: affected, elapsedMs }
    return this.lastReroute
  }

  toggleSwitch(switchId: string): SwitchState | null {
    const state = this.network.toggleSwitch(switchId)
    if (state === null) return null
    this.onSwitchChanged(switchId)
    return state
  }

  // ---------------------------------------------------------------- 仿真步进

  step(rawDt: number): void {
    if (!this.running) {
      this.updateWorldPositions()
      return
    }
    const dt = Math.min(0.05, rawDt) * this.timeScale
    this.simTime += dt

    for (const consist of this.consists.values()) {
      if (consist.status !== 'moving' && consist.status !== 'coasting' && consist.status !== 'waiting') continue
      this.stepConsist(consist, dt)
    }
    this.updateWorldPositions()
  }

  private stepConsist(consist: Consist, dt: number): void {
    const active = this.trajectories.get(consist.id)
    if (!active || !consist.trajectory) {
      consist.status = 'idle'
      return
    }

    // 进路快照校验
    if (!this.network.isTrajectoryOpen(active.snapshot)) {
      // 尝试重新规划到原目标；成功则继续，否则停车等待
      if (consist.speed <= 0.05 && consist.order) {
        const target = this.network.trackOffsetToLocation(
          active.targetTrackId,
          consist.order.targetOffset,
        )
        if (target && this.routeConsist(consist, target)) {
          consist.status = consist.isCoasting ? 'coasting' : 'moving'
          consist.waitReason = null
          this.emit('reroute', `车列 ${consist.id} 进路恢复，已重新规划路径`, consist.vehicleIds)
          return this.stepConsist(consist, dt)
        }
      }
      consist.status = 'waiting'
      consist.waitReason = '前方道岔位置变化，等待进路'
      consist.speed = Math.max(0, consist.speed - DECEL * dt)
      if (consist.speed === 0) return
    } else if (consist.status === 'waiting') {
      consist.status = consist.isCoasting ? 'coasting' : 'moving'
      consist.waitReason = null
    }

    const remaining = active.targetHeadS - consist.trajS
    const obstacle = this.findObstacle(consist, active)

    // 障碍/目标制动决策
    let desiredSpeed = consist.order?.maxSpeed ?? SHUNT_SPEED
    if (consist.isCoasting) {
      // 溜放：只有阻力，接近停车点/障碍时施加制动
      const stopGap = obstacle ? obstacle.gap : remaining
      if (brakingDistance(consist.speed, DECEL) >= Math.max(0, stopGap - 1)) {
        consist.speed = Math.max(0, consist.speed - DECEL * dt)
      } else {
        consist.speed = Math.max(0, consist.speed - FRICTION * dt)
      }
      desiredSpeed = consist.speed
    } else {
      const stopGap = obstacle ? Math.min(obstacle.gap, remaining) : remaining
      const brake = brakingDistance(consist.speed, DECEL)
      if (brake >= Math.max(0, stopGap - 1.5)) {
        consist.speed = Math.max(0, consist.speed - DECEL * dt)
      } else if (consist.speed < desiredSpeed) {
        consist.speed = Math.min(desiredSpeed, consist.speed + ACCEL * dt)
      }
    }

    // 连挂判定（0.3 米阈值）；若已在障碍前停稳且间距 ≤2m，缓行连挂消除死锁
    if (obstacle && (obstacle.gap <= COUPLE_THRESHOLD || (consist.speed <= 0.05 && obstacle.gap <= 2.0))) {
      if (consist.speed <= 0.05 && obstacle.gap > COUPLE_THRESHOLD) consist.speed = 1.2
      this.couple(consist, obstacle.consist)
      return
    }

    consist.trajS += consist.speed * dt
    consist.head = this.network.sampleTrajectory(active.points, consist.trajS)

    // 到达目标
    if (consist.trajS >= active.targetHeadS - 1e-4 && consist.speed <= 0.5) {
      consist.trajS = active.targetHeadS
      this.arrive(consist)
      return
    }
    if (consist.trajS >= active.targetHeadS) {
      consist.speed = 0
      consist.trajS = active.targetHeadS
      this.arrive(consist)
    }
  }

  private findObstacle(
    consist: Consist,
    active: ActiveTrajectory,
  ): { consist: Consist; gap: number } | null {
    const points = active.points
    const headS = consist.trajS
    // 逐点登记车头前方（s >= headS）每条轨迹边的里程区间（跨边点也登记）
    const edgeRanges = new Map<string, { s0: number; s1: number; off0: number; off1: number }>()
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      if (p.s < headS - 1e-6) continue
      const range = edgeRanges.get(p.edgeId)
      if (range) {
        range.s1 = p.s
        range.off1 = p.offset
      } else {
        edgeRanges.set(p.edgeId, { s0: p.s, s1: p.s, off0: p.offset, off1: p.offset })
      }
    }
    let best: { consist: Consist; gap: number } | null = null

    for (const other of this.consists.values()) {
      if (other.id === consist.id) continue
      // 他车列朝向本车列的车钩：车列数组首车为车头端，前车钩 = center - half
      const tailVid = other.vehicleIds[0]
      const tailVr = this.vehicles.get(tailVid)!
      const range = edgeRanges.get(tailVr.location.edgeId)
      if (!range) continue
      const tailOffset = tailVr.location.offset - tailVr.static.length / 2
      const forward = range.off1 >= range.off0
      let obstacleS: number
      if (forward) {
        const span = Math.max(1e-6, range.off1 - range.off0)
        // 不 clamp：障碍可能在该边轨迹段之外，外推得到真实里程再由 gap 过滤
        const frac = (tailOffset - range.off0) / span
        obstacleS = range.s0 + frac * (range.s1 - range.s0)
      } else {
        const span = Math.max(1e-6, range.off0 - range.off1)
        const frac = (range.off0 - tailOffset) / span
        obstacleS = range.s0 + frac * (range.s1 - range.s0)
      }
      const gap = obstacleS - headS
      if (gap < -0.5 || gap > LOOK_AHEAD) continue
      const headPos = this.network.sampleTrajectory(points, headS).pos
      if (dist(headPos, tailVr.worldPos) > LOOK_AHEAD + 20) continue
      if (!best || gap < best.gap) best = { consist: other, gap }
    }
    return best
  }

  private couple(moving: Consist, stationary: Consist): void {
    // 车钩对齐：移动车列前端贴合静止车列后端车钩
    const active = this.trajectories.get(moving.id)!
    // 静止车列最后一辆（最靠 n2）的后车钩面 = center + half
    const tailVid = stationary.vehicleIds[stationary.vehicleIds.length - 1]
    const tailVr = this.vehicles.get(tailVid)!
    const couplerWorld = {
      x: tailVr.worldPos.x,
      z: tailVr.worldPos.z,
    }
    // 在轨迹分段上做精确投影（线性插值，而非取最近离散采样点）
    const points = active.points
    let bestS = moving.trajS
    let bestLat = Infinity
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]
      const p1 = points[i]
      const dx = p1.pos.x - p0.pos.x
      const dz = p1.pos.z - p0.pos.z
      const l2 = dx * dx + dz * dz || 1
      const t = Math.max(0, Math.min(1, ((couplerWorld.x - p0.pos.x) * dx + (couplerWorld.z - p0.pos.z) * dz) / l2))
      const px = p0.pos.x + dx * t
      const pz = p0.pos.z + dz * t
      const lat = Math.hypot(couplerWorld.x - px, couplerWorld.z - pz)
      if (lat < bestLat) {
        bestLat = lat
        bestS = p0.s + (p1.s - p0.s) * t
      }
    }
    moving.trajS = Math.max(0, bestS)
    moving.head = this.network.sampleTrajectory(active.points, moving.trajS)
    // 合并：moving 在前（车头方向），stationary 整体接在 moving 尾部
    const mergedIds = [...moving.vehicleIds, ...stationary.vehicleIds]
    moving.vehicleIds = mergedIds
    moving.totalLength += stationary.totalLength
    moving.speed = Math.min(moving.speed, stationary.speed)
    for (const vid of stationary.vehicleIds) this.vehicles.get(vid)!.consistId = moving.id
    this.consists.delete(stationary.id)
    this.trajectories.delete(stationary.id)
    if (stationary.order) this.etaMap.delete(stationary.order.id)

    // 立即按轨迹重排全部车辆，保证车钩精确对齐（消除采样粒度误差）
    this.updateWorldPositions()

    this.emit(
      'couple',
      `连挂：车列 ${moving.id} 与 ${stationary.id} 合并（阈值 ${COUPLE_THRESHOLD}m），现共 ${moving.vehicleIds.length} 辆，车钩已对齐`,
      mergedIds,
    )

    // 连挂后若静止车列已处于目标股道（即移动车列已接入目标车列），作业完成
    const stillActive = this.trajectories.get(moving.id)
    const orderTrackId = moving.order?.targetTrackId
    const mergedOnTarget =
      orderTrackId &&
      mergedIds.some((vid) => {
        const e = this.network.edges.get(this.vehicles.get(vid)!.location.edgeId)
        return e?.trackId === orderTrackId
      })
    if (stillActive && (moving.trajS >= stillActive.targetHeadS - 2 || mergedOnTarget)) {
      this.arrive(moving)
    } else if (stillActive) {
      // 连挂的是中途障碍：收缩剩余目标里程，避免合并后越过原停车点
      const overshoot = moving.trajS
      stillActive.targetHeadS = Math.max(stillActive.targetHeadS, overshoot + 0.5)
    }
  }

  private arrive(consist: Consist): void {
    consist.speed = 0
    consist.status = 'idle'
    consist.waitReason = null
    // 清轨迹前沿弧长按精确车长重排，保证车钩严格对齐
    if (consist.trajectory) this.respaceAlongTrajectory(consist)
    this.bakeIdleLocations(consist)
    const trackId = consist.order?.targetTrackId
    this.trajectories.delete(consist.id)
    if (consist.order) {
      this.etaMap.delete(consist.order.id)
      this.emit('arrive', `车列 ${consist.id} 到达 ${this.network.tracks.get(trackId ?? '')?.name ?? '目标股道'}，作业完成`, consist.vehicleIds, trackId)
      consist.order = null
      consist.trajectory = null
    }
  }

  /**
   * 在轨迹起点前沿同边回推 length 米生成延伸点，并重索引里程：
   * 延伸段 s∈[0, L]，原车头位置 s=L，目标点 s=L+原里程。
   */
  private extendTrajectoryBackward(
    points: TrajPoint[],
    length: number,
    switches: string[],
  ): { points: TrajPoint[]; switches: string[] } {
    const first = points[0]
    // 沿轨迹首点所在边向 n1 回推；到 n1 后优先选择与轨迹起点几何共线的邻边
    const back: { edgeId: string; offset: number }[] = []
    let edgeId = first.edgeId
    let offset = first.offset
    let remaining = length
    let guard = 0
    while (remaining > 1e-6 && guard++ < 256) {
      const edge = this.network.edges.get(edgeId)!
      const step = Math.min(2, remaining, offset)
      offset -= step
      remaining -= step
      back.push({ edgeId, offset })
      if (offset <= 1e-6 && remaining > 1e-6) {
        const adj = this.pickBackwardEdge(edgeId, edge.n1, first.heading)
        if (!adj) break
        edgeId = adj
        offset = this.network.edges.get(edgeId)!.length
      }
    }
    back.reverse()
    const pre: TrajPoint[] = back.map((b) => {
      const { pos, heading } = this.network.sampleLocation(b)
      return { edgeId: b.edgeId, offset: b.offset, pos, s: 0, heading }
    })
    for (let i = 1; i < pre.length; i++) {
      pre[i].s = pre[i - 1].s + dist(pre[i - 1].pos, pre[i].pos)
    }
    const base = pre.length > 0 ? pre[pre.length - 1].s : 0
    const shifted = points.map((p) => ({ ...p, s: p.s + base }))
    return { points: [...pre, ...shifted], switches }
  }

  /** 在 node 处选择与来车方向（heading）最共线的邻边继续向后延伸 */
  private pickBackwardEdge(edgeId: string, node: string, heading: number): string | null {
    const candidates: { edgeId: string; align: number }[] = []
    for (const e of this.yard.edges) {
      if (e.id === edgeId || (e.n1 !== node && e.n2 !== node)) continue
      const sample = this.network.sampleLocation({
        edgeId: e.id,
        offset: e.n1 === node ? Math.min(4, e.length) : e.length - Math.min(4, e.length),
      })
      const nodePos = this.network.nodes.get(node)!.pos
      const dx = sample.pos.x - nodePos.x
      const dz = sample.pos.z - nodePos.z
      // 车尾方向与 heading 相反，找反方向最对齐的边
      const align = Math.abs(Math.atan2(dz, dx) - (heading + Math.PI))
      candidates.push({ edgeId: e.id, align: Math.min(align, Math.PI * 2 - align) })
    }
    candidates.sort((a, b) => a.align - b.align)
    return candidates[0]?.edgeId ?? null
  }

  /** 采样车列上某里程点（轨迹已含车尾延伸段，s 始终非负） */
  private sampleConsistPoint(consist: Consist, s: number): TrajPoint {
    return this.network.sampleTrajectory(consist.trajectory!, Math.max(0, s))
  }

  /** 停车前沿轨迹弧长按精确车长重排各车，锚定首车前端，保证车钩对齐 */
  private respaceAlongTrajectory(consist: Consist): void {
    let behind = 0
    for (const vid of consist.vehicleIds) {
      const vr = this.vehicles.get(vid)!
      const centerS = consist.trajS - behind - vr.static.length / 2
      const tp = this.sampleConsistPoint(consist, centerS)
      vr.worldPos = tp.pos
      vr.heading = tp.heading
      vr.location = this.network.worldToEdgeLocation(tp.edgeId, tp.pos)
      behind += vr.static.length
    }
  }

  private updateWorldPositions(): void {
    for (const consist of this.consists.values()) {
      if (!consist.trajectory || consist.status === 'idle') {
        for (const vid of consist.vehicleIds) {
          const vr = this.vehicles.get(vid)!
          const sample = this.network.sampleLocation(vr.location)
          vr.worldPos = sample.pos
          vr.heading = sample.heading
        }
        continue
      }
      let behind = 0
      for (const vid of consist.vehicleIds) {
        const vr = this.vehicles.get(vid)!
        const centerS = consist.trajS - behind - vr.static.length / 2
        const tp = this.sampleConsistPoint(consist, centerS)
        // 世界位置为唯一真值（沿轨迹弧长插值）
        vr.worldPos = tp.pos
        vr.heading = tp.heading
        // offset 通过对所属边折线最近点投影，保证与世界位置严格一致
        vr.location = this.network.worldToEdgeLocation(tp.edgeId, tp.pos)
        behind += vr.static.length
      }
    }
  }

  // ---------------------------------------------------------------- 占用区

  /** 每条边的占用区间（随车辆实时变化） */
  getOccupancy(): OccupancyInterval[] {
    const byEdge = new Map<string, number[]>()
    for (const vr of this.vehicles.values()) {
      const edge = this.network.edges.get(vr.location.edgeId)
      if (!edge) continue
      const half = vr.static.length / 2
      // 钳制到边范围内，跳过退化区间
      const lo = Math.max(0, vr.location.offset - half)
      const hi = Math.min(edge.length, vr.location.offset + half)
      if (hi - lo < 0.05) continue
      const list = byEdge.get(vr.location.edgeId)
      if (list) list.push(lo, hi)
      else byEdge.set(vr.location.edgeId, [lo, hi])
    }
    const out: OccupancyInterval[] = []
    for (const [edgeId, values] of byEdge) {
      values.sort((a, b) => a - b)
      // 合并间距 < 3m 的区间为连续占用色块
      let curMin = values[0]
      let curMax = values[1]
      for (let i = 2; i < values.length; i += 2) {
        const lo = values[i]
        const hi = values[i + 1]
        if (lo - curMax < 3) {
          curMax = Math.max(curMax, hi)
        } else {
          if (curMax > curMin) out.push({ edgeId, minOffset: curMin, maxOffset: curMax })
          curMin = lo
          curMax = hi
        }
      }
      if (curMax > curMin) out.push({ edgeId, minOffset: curMin, maxOffset: curMax })
    }
    return out
  }

  // ---------------------------------------------------------------- 限界

  /** 限界检查：车辆轮廓 vs 建筑限界 */
  gaugeCheck(vehicleId: string): GaugeViolation {
    const vr = this.vehicles.get(vehicleId)
    const points: GaugeViolation['points'] = []
    let maxExceed = 0
    if (vr) {
      const gauge: GaugeProfile = this.yard.gauge
      for (const p of vr.static.outline) {
        const limit = this.gaugeHalfWidth(gauge, p.y)
        if (p.x > limit) {
          points.push({ x: p.x, y: p.y, limit })
          maxExceed = Math.max(maxExceed, p.x - limit)
        }
      }
      if (vr.static.height > gauge.maxHeight) {
        maxExceed = Math.max(maxExceed, vr.static.height - gauge.maxHeight)
      }
      if (points.length > 0) {
        this.emit('gauge-violation', `限界超限：${vehicleId} 最大超出 ${maxExceed.toFixed(2)}m`, [vehicleId])
      }
    }
    return { vehicleId, points, maxExceed }
  }

  private gaugeHalfWidth(gauge: GaugeProfile, y: number): number {
    const hw = gauge.halfWidths
    if (y <= hw[0].y) return hw[0].w
    for (let i = 1; i < hw.length; i++) {
      if (y <= hw[i].y) {
        const t = (y - hw[i - 1].y) / (hw[i].y - hw[i - 1].y || 1)
        return hw[i - 1].w + (hw[i].w - hw[i - 1].w) * t
      }
    }
    return hw[hw.length - 1].w
  }

  allGaugeViolations(): GaugeViolation[] {
    return this.yard.vehicles
      .filter((v) => v.outOfGauge)
      .map((v) => this.gaugeCheck(v.id))
      .filter((r) => r.points.length > 0)
  }

  // ---------------------------------------------------------------- 事件

  private emit(
    type: SimEvent['type'],
    message: string,
    vehicleIds?: string[],
    trackId?: string,
  ): void {
    this.events.push({ time: this.simTime, type, message, vehicleIds, trackId })
    if (this.events.length > EVENT_CAP) this.events.shift()
  }

  // ---------------------------------------------------------------- 查询

  getVehicleStatic(id: string): VehicleStatic | undefined {
    return this.vehicles.get(id)?.static
  }

  /** 车辆当前所在股道 */
  vehicleTrackId(vehicleId: string): string | null {
    const vr = this.vehicles.get(vehicleId)
    if (!vr) return null
    return this.network.edges.get(vr.location.edgeId)?.trackId ?? null
  }

  /** 预计到达时刻（仿真秒） */
  getEta(orderId: string): number | undefined {
    return this.etaMap.get(orderId)
  }
}
