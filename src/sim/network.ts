import type {
  EdgeLocation,
  GraphEdge,
  GraphNode,
  SwitchDef,
  SwitchState,
  TrackDef,
  TrajPoint,
  Vec2,
} from '../types'
import { dist, polylineLength, samplePolyline } from './geometry'

interface AdjEntry {
  edgeId: string
  node: string
}

/**
 * 站场网络拓扑：节点 / 边 / 道岔。
 * 道岔约束下的邻居遍历 + Dijkstra 寻路 + 轨迹采样。
 */
export class YardNetwork {
  nodes = new Map<string, GraphNode>()
  edges = new Map<string, GraphEdge>()
  tracks = new Map<string, TrackDef>()
  switches = new Map<string, SwitchDef>()
  /** 节点 id -> 道岔（该节点为 root / a / b 时分别登记） */
  rootSwitch = new Map<string, SwitchDef>()
  branchSwitch = new Map<string, SwitchDef>()
  private adj = new Map<string, AdjEntry[]>()

  load(
    nodes: GraphNode[],
    edges: GraphEdge[],
    switches: SwitchDef[],
    tracks: TrackDef[],
  ): void {
    this.nodes.clear()
    this.edges.clear()
    this.tracks.clear()
    this.switches.clear()
    this.rootSwitch.clear()
    this.branchSwitch.clear()
    this.adj.clear()

    for (const n of nodes) this.nodes.set(n.id, n)
    for (const e of edges) {
      this.edges.set(e.id, e)
      this.pushAdj(e.n1, { edgeId: e.id, node: e.n2 })
      this.pushAdj(e.n2, { edgeId: e.id, node: e.n1 })
    }
    for (const s of switches) {
      this.switches.set(s.id, s)
      this.rootSwitch.set(s.root, s)
      this.branchSwitch.set(s.a, s)
      this.branchSwitch.set(s.b, s)
    }
    for (const t of tracks) this.tracks.set(t.id, t)
  }

  private pushAdj(node: string, entry: AdjEntry): void {
    const list = this.adj.get(node)
    if (list) list.push(entry)
    else this.adj.set(node, [entry])
  }

  setSwitchState(switchId: string, state: SwitchState): void {
    const s = this.switches.get(switchId)
    if (s) s.state = state
  }

  toggleSwitch(switchId: string): SwitchState | null {
    const s = this.switches.get(switchId)
    if (!s) return null
    s.state = s.state === 0 ? 1 : 0
    return s.state
  }

  /**
   * 道岔约束下，from 节点能否走向 to 节点。
   * 道岔是单点设备：只有从 root 出发时按开通位置过滤；
   * 从任一分支进入 root 的反向通行天然合法（分支与 root 始终相连）。
   */
  private canTraverse(from: string, to: string): boolean {
    const rs = this.rootSwitch.get(from)
    if (rs) {
      const open = rs.state === 0 ? rs.a : rs.b
      return to === open
    }
    return true
  }

  /**
   * 不考虑道岔当前位置的拓扑最短路（用于进路搜索）。
   * 返回需要搬动的道岔及目标状态。
   */
  findRoute(
    start: string,
    goal: string,
  ): { nodes: string[]; requiredStates: { switchId: string; state: SwitchState }[] } | null {
    const distMap = new Map<string, number>([[start, 0]])
    const prev = new Map<string, { node: string; edgeId: string }>()
    const visited = new Set<string>()
    const queue = new MinHeap()
    queue.push(start, 0)

    while (queue.size > 0) {
      const cur = queue.pop()!
      if (visited.has(cur.id)) continue
      visited.add(cur.id)
      if (cur.id === goal) break
      const curDist = distMap.get(cur.id)!
      for (const next of this.adj.get(cur.id) ?? []) {
        if (visited.has(next.node)) continue
        const edge = this.edges.get(next.edgeId)!
        const nd = curDist + edge.length
        if (nd < (distMap.get(next.node) ?? Infinity)) {
          distMap.set(next.node, nd)
          prev.set(next.node, { node: cur.id, edgeId: next.edgeId })
          queue.push(next.node, nd)
        }
      }
    }
    if (!distMap.has(goal)) return null

    const nodePath = [goal]
    const requiredStates: { switchId: string; state: SwitchState }[] = []
    let cur = goal
    while (cur !== start) {
      const p = prev.get(cur)
      if (!p) return null
      // cur 是从 p.node 经过一条边到达的；若 p.node 是道岔 root，记录所需位置
      const rs = this.rootSwitch.get(p.node)
      if (rs) {
        requiredStates.unshift({
          switchId: rs.id,
          state: cur === rs.a ? 0 : 1,
        })
      }
      cur = p.node
      nodePath.unshift(cur)
    }
    return { nodes: nodePath, requiredStates }
  }

  /** 开通进路：搬动所需道岔，返回实际发生变化的道岔 id */
  openRoute(required: { switchId: string; state: SwitchState }[]): string[] {
    const changed: string[] = []
    for (const req of required) {
      const sw = this.switches.get(req.switchId)
      if (sw && sw.state !== req.state) {
        sw.state = req.state
        changed.push(req.switchId)
      }
    }
    return changed
  }

  /** 道岔当前状态查询 */
  switchState(switchId: string): SwitchState | null {
    return this.switches.get(switchId)?.state ?? null
  }

  /** Dijkstra 节点最短路，返回节点序列（含起止）与总长度；不可达返回 null */
  shortestNodePath(start: string, goal: string): { nodes: string[]; length: number } | null {
    if (start === goal) return { nodes: [start], length: 0 }
    const distMap = new Map<string, number>([[start, 0]])
    const prev = new Map<string, { node: string; edgeId: string }>()
    const visited = new Set<string>()
    // 简易二叉堆优先队列
    const queue = new MinHeap()
    queue.push(start, 0)

    while (queue.size > 0) {
      const cur = queue.pop()!
      if (visited.has(cur.id)) continue
      visited.add(cur.id)
      if (cur.id === goal) break
      const curDist = distMap.get(cur.id)!
      for (const next of this.adj.get(cur.id) ?? []) {
        if (visited.has(next.node)) continue
        if (!this.canTraverse(cur.id, next.node)) continue
        const edge = this.edges.get(next.edgeId)!
        const nd = curDist + edge.length
        if (nd < (distMap.get(next.node) ?? Infinity)) {
          distMap.set(next.node, nd)
          prev.set(next.node, { node: cur.id, edgeId: next.edgeId })
          queue.push(next.node, nd)
        }
      }
    }

    if (!distMap.has(goal)) return null
    const nodePath: string[] = [goal]
    const edgePath: string[] = []
    let cur = goal
    while (cur !== start) {
      const p = prev.get(cur)
      if (!p) return null
      edgePath.unshift(p.edgeId)
      cur = p.node
      nodePath.unshift(cur)
    }
    return { nodes: nodePath, length: distMap.get(goal)! }
  }

  /** 边上偏移 -> 世界坐标与 heading */
  sampleLocation(loc: EdgeLocation): { pos: Vec2; heading: number } {
    const edge = this.edges.get(loc.edgeId)
    if (!edge) return { pos: { x: 0, z: 0 }, heading: 0 }
    return samplePolyline(edge.polyline, Math.max(0, Math.min(edge.length, loc.offset)))
  }

  /** 世界位置投影到指定边，返回弧长 offset（遍历折线段取最近点） */
  worldToEdgeLocation(edgeId: string, pos: Vec2): EdgeLocation {
    const edge = this.edges.get(edgeId)
    if (!edge) return { edgeId, offset: 0 }
    let bestOffset = 0
    let bestD = Infinity
    let acc = 0
    for (let i = 1; i < edge.polyline.length; i++) {
      const a = edge.polyline[i - 1]
      const b = edge.polyline[i]
      const segLen = dist(a, b) || 1
      const dx = b.x - a.x
      const dz = b.z - a.z
      const t = Math.max(0, Math.min(1, ((pos.x - a.x) * dx + (pos.z - a.z) * dz) / (segLen * segLen)))
      const px = a.x + dx * t
      const pz = a.z + dz * t
      const d = (pos.x - px) ** 2 + (pos.z - pz) ** 2
      if (d < bestD) {
        bestD = d
        bestOffset = acc + segLen * t
      }
      acc += segLen
    }
    return { edgeId, offset: Math.max(0, Math.min(edge.length, bestOffset)) }
  }

  /** 股道里程（沿 edgeIds 累计）-> 边位置 */
  trackOffsetToLocation(trackId: string, trackOffset: number): EdgeLocation | null {
    const track = this.tracks.get(trackId)
    if (!track) return null
    let remaining = trackOffset
    for (const edgeId of track.edgeIds) {
      const edge = this.edges.get(edgeId)!
      if (remaining <= edge.length + 1e-6) {
        return { edgeId, offset: Math.max(0, Math.min(edge.length, remaining)) }
      }
      remaining -= edge.length
    }
    const lastEdgeId = track.edgeIds[track.edgeIds.length - 1]
    const lastEdge = this.edges.get(lastEdgeId)!
    return { edgeId: lastEdgeId, offset: lastEdge.length }
  }

  trackLength(trackId: string): number {
    const track = this.tracks.get(trackId)
    if (!track) return 0
    return track.edgeIds.reduce((sum, id) => sum + (this.edges.get(id)?.length ?? 0), 0)
  }

  /**
   * 构建从 from 到 to 的完整行驶轨迹。
   * 枚举起点边/终点边的端点组合，取道岔约束下最短者。
   * 返回轨迹点（含经过的道岔 id 列表，用于道岔联动重算）。
   */
  buildTrajectory(
    from: EdgeLocation,
    to: EdgeLocation,
  ): { points: TrajPoint[]; switches: string[] } | null {
    const fromEdge = this.edges.get(from.edgeId)
    const toEdge = this.edges.get(to.edgeId)
    if (!fromEdge || !toEdge) return null

    let best: {
      nodePath: string[]
      edgePath: string[]
      startEndpoint: string
      goalEndpoint: string
      total: number
    } | null = null

    const fromEnds = [fromEdge.n1, fromEdge.n2]
    const toEnds = [toEdge.n1, toEdge.n2]

    for (const startEndpoint of fromEnds) {
      const startPartial =
        startEndpoint === fromEdge.n1 ? from.offset : fromEdge.length - from.offset
      for (const goalEndpoint of toEnds) {
        const goalPartial =
          goalEndpoint === toEdge.n1 ? to.offset : toEdge.length - to.offset
        const nodeResult = this.shortestNodePath(startEndpoint, goalEndpoint)
        if (!nodeResult) continue
        // 还原边序列
        const edgePath: string[] = []
        for (let i = 0; i < nodeResult.nodes.length - 1; i++) {
          const a = nodeResult.nodes[i]
          const b = nodeResult.nodes[i + 1]
          const link = (this.adj.get(a) ?? []).find(
            (e) => e.node === b && this.edges.get(e.edgeId)?.trackId !== undefined,
          )
          if (!link) return null
          edgePath.push(link.edgeId)
        }
        const total = startPartial + nodeResult.length + goalPartial
        if (!best || total < best.total) {
          best = {
            nodePath: nodeResult.nodes,
            edgePath,
            startEndpoint,
            goalEndpoint,
            total,
          }
        }
      }
    }

    if (!best) return null
    return this.assembleTrajectory(from, to, best.edgePath, best.startEndpoint, best.goalEndpoint)
  }

  /** 按边序列拼接采样轨迹 */
  private assembleTrajectory(
    from: EdgeLocation,
    to: EdgeLocation,
    edgePath: string[],
    startEndpoint: string,
    goalEndpoint: string,
  ): { points: TrajPoint[]; switches: string[] } | null {
    // 起点边可能不在 edgePath 中（同边或部分行驶）
    const seq: { edgeId: string; startOffset: number; endOffset: number }[] = []
    const firstEdge = this.edges.get(from.edgeId)!

    if (edgePath.length === 0 || edgePath[0] !== from.edgeId) {
      seq.push({
        edgeId: from.edgeId,
        startOffset: from.offset,
        endOffset: startEndpoint === firstEdge.n1 ? 0 : firstEdge.length,
      })
    } else {
      // 第一条边即起点边：只走从当前位置到另一端
      seq.push({
        edgeId: from.edgeId,
        startOffset: from.offset,
        endOffset: startEndpoint === firstEdge.n1 ? 0 : firstEdge.length,
      })
      edgePath = edgePath.slice(1)
    }

    for (const edgeId of edgePath) {
      const edge = this.edges.get(edgeId)!
      seq.push({ edgeId, startOffset: 0, endOffset: edge.length })
    }

    // 终点边：末条边裁到 target offset
    const last = seq[seq.length - 1]
    if (last.edgeId === to.edgeId) {
      last.endOffset = to.offset
    } else {
      const toEdge = this.edges.get(to.edgeId)!
      seq.push({
        edgeId: to.edgeId,
        startOffset: goalEndpoint === toEdge.n1 ? 0 : toEdge.length,
        endOffset: to.offset,
      })
    }

    const points: TrajPoint[] = []
    const switchIds = new Set<string>()
    let s = 0
    let prevPos: Vec2 | null = null

    for (const seg of seq) {
      const edge = this.edges.get(seg.edgeId)
      if (!edge) return null
      const forward = seg.endOffset >= seg.startOffset
      const steps = Math.max(1, Math.ceil(Math.abs(seg.endOffset - seg.startOffset) / 1))
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const offset = forward
          ? seg.startOffset + (seg.endOffset - seg.startOffset) * t
          : seg.startOffset - (seg.startOffset - seg.endOffset) * t
        const { pos, heading } = samplePolyline(edge.polyline, offset)
        if (prevPos && dist(prevPos, pos) < 1e-6) continue
        if (points.length > 0) s += dist(points[points.length - 1].pos, pos)
        points.push({ edgeId: seg.edgeId, offset, pos, s, heading: forward ? heading : heading + Math.PI })
        prevPos = pos
      }
      const sw = this.switchOnEdge(seg.edgeId)
      if (sw) switchIds.add(sw)
    }

    return { points, switches: [...switchIds] }
  }

  /** 边端点是否落在道岔上，返回道岔 id */
  private switchOnEdge(edgeId: string): string | null {
    const edge = this.edges.get(edgeId)!
    for (const s of this.switches.values()) {
      const nodes = [s.root, s.a, s.b]
      if (nodes.includes(edge.n1) || nodes.includes(edge.n2)) return s.id
    }
    return null
  }

  /** 沿轨迹按累计里程取点（二分查找），位置按弧长插值后反查边 offset */
  sampleTrajectory(points: TrajPoint[], s: number): TrajPoint {
    if (s <= 0) return points[0]
    if (s >= points[points.length - 1].s) return points[points.length - 1]
    let lo = 0
    let hi = points.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (points[mid].s < s) lo = mid + 1
      else hi = mid
    }
    const p1 = points[lo]
    const p0 = points[lo - 1]
    const span = p1.s - p0.s || 1
    const t = (s - p0.s) / span
    // 位置与朝向按真实弧长线性插值
    const pos = {
      x: p0.pos.x + (p1.pos.x - p0.pos.x) * t,
      z: p0.pos.z + (p1.pos.z - p0.pos.z) * t,
    }
    let edgeId: string
    let offset: number
    if (p0.edgeId === p1.edgeId) {
      // 同边：在该边上反查最近 offset
      edgeId = p0.edgeId
      const edge = this.edges.get(edgeId)!
      offset = this.projectOffsetOnEdge(edge, pos, p0.offset, p1.offset)
      offset = Math.max(0, Math.min(edge.length, offset))
    } else {
      // 跨边：按里程比例选择归属边，offset 取对应端点值（车辆中心不会长期停在道岔点）
      if (t < 0.5) {
        edgeId = p0.edgeId
        const edge = this.edges.get(edgeId)!
        offset = Math.max(0, Math.min(edge.length, p0.offset))
      } else {
        edgeId = p1.edgeId
        const edge = this.edges.get(edgeId)!
        offset = Math.max(0, Math.min(edge.length, p1.offset))
      }
    }
    return { edgeId, offset, s, pos, heading: p0.heading }
  }

  /** 世界位置反查边 offset（在 [lo, hi] 邻域内找最近点） */
  private projectOffsetOnEdge(
    edge: GraphEdge,
    pos: Vec2,
    lo: number,
    hi: number,
  ): number {
    const from = Math.max(0, Math.min(lo, hi) - 2)
    const to = Math.min(edge.length, Math.max(lo, hi) + 2)
    let best = lo
    let bestD = Infinity
    const steps = 8
    for (let i = 0; i <= steps; i++) {
      const off = from + ((to - from) * i) / steps
      const p = samplePolyline(edge.polyline, off).pos
      const d = (p.x - pos.x) ** 2 + (p.z - pos.z) ** 2
      if (d < bestD) {
        bestD = d
        best = off
      }
    }
    return best
  }

  /** 轨迹上记录的道岔快照与当前状态是否一致（一致=可继续按该轨迹行驶） */
  isTrajectoryOpen(snapshot: Record<string, SwitchState>): boolean {
    for (const [id, state] of Object.entries(snapshot)) {
      const s = this.switches.get(id)
      if (!s) return false
      if (s.state !== state) return false
    }
    return true
  }

  /** 生成当前所有相关道岔的状态快照 */
  switchSnapshot(switchIds: string[]): Record<string, SwitchState> {
    const snap: Record<string, SwitchState> = {}
    for (const id of switchIds) {
      const s = this.switches.get(id)
      if (s) snap[id] = s.state
    }
    return snap
  }

  edgePolylineLength(edgeId: string): number {
    const e = this.edges.get(edgeId)
    return e ? polylineLength(e.polyline) : 0
  }
}

/** 简易最小堆 */
class MinHeap {
  private ids: string[] = []
  private keys: number[] = []

  get size(): number {
    return this.ids.length
  }

  push(id: string, key: number): void {
    this.ids.push(id)
    this.keys.push(key)
    let i = this.ids.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.keys[parent] <= this.keys[i]) break
      this.swap(i, parent)
      i = parent
    }
  }

  pop(): { id: string; key: number } | null {
    if (this.ids.length === 0) return null
    const id = this.ids[0]
    const key = this.keys[0]
    const lastId = this.ids.pop()!
    const lastKey = this.keys.pop()!
    if (this.ids.length > 0) {
      this.ids[0] = lastId
      this.keys[0] = lastKey
      let i = 0
      for (;;) {
        const l = i * 2 + 1
        const r = l + 1
        let smallest = i
        if (l < this.ids.length && this.keys[l] < this.keys[smallest]) smallest = l
        if (r < this.ids.length && this.keys[r] < this.keys[smallest]) smallest = r
        if (smallest === i) break
        this.swap(i, smallest)
        i = smallest
      }
    }
    return { id, key }
  }

  private swap(a: number, b: number): void {
    ;[this.ids[a], this.ids[b]] = [this.ids[b], this.ids[a]]
    ;[this.keys[a], this.keys[b]] = [this.keys[b], this.keys[a]]
  }
}
