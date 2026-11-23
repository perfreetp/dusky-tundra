// 推演引擎:固定步长、确定性(同一种子结果一致),输出逐时刻快照
import type { Plan, SimConfig, SimResult, Snapshot, ElevatorSnap } from '../model/types'
import { servesFloor } from '../model/types'
import { buildNavGrid, worldToCell, cellCenter, isWalk, INF, type NavGrid } from '../model/navgrid'

const DT = 0.1 // 仿真步长(秒)
const SNAP_DT = 0.5 // 快照间隔(秒)
const MAX_T = 1800 // 最长推演时长(秒)
const BOARD_INTERVAL = 0.8 // 每人登梯耗时(秒)
const QUEUE_JOIN_DIST = 0.6 // 距集结点多近算进入队列
const QUEUE_SLOT = 0.55 // 队列站位间距(米)
const STAIR_ARRIVE = 0.9 // 距楼梯目标点多近算已疏散
const REPLAN_INTERVAL = 2.0 // 重新选择目标的间隔(秒)
const QUEUE_PENALTY = 2.0 // 每多排 1 人折算的距离惩罚(米),实现"最近可用"

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

interface Agent {
  id: number
  x: number
  y: number
  speed: number
  jitter: number // 行走方向的固定横向扰动
  target: number // navgrid target 下标
  state: 0 | 1 | 2 // 0 行走 1 排队 2 已疏散/登梯
  waitStart: number
  replanAt: number
}

interface ElevState {
  phase: 0 | 1 | 2 // 0 停靠装载 1 往返 2 不停靠
  timer: number
  load: number
  cum: number
  waitSum: number
  boarded: number
  boardAcc: number
  queue: Agent[]
}

export function runSimulation(plan: Plan, config: SimConfig): SimResult | null {
  const served = plan.elevators.map((_, i) =>
    servesFloor(i, plan.elevators.length, config.currentFloor, config),
  )
  const grid = buildNavGrid(plan, served)
  if (!grid || grid.targets.length === 0) return null

  const seed = hashString(JSON.stringify({ plan, config }))
  const rng = mulberry32(seed)

  // 生成到达时刻表
  interface SpawnEvt { t: number; x: number; y: number }
  const events: SpawnEvt[] = []
  for (const s of plan.sources) {
    if (s.rate <= 0 || s.total <= 0) continue
    for (let k = 0; k < s.total; k++) {
      const t = k / s.rate + (rng() - 0.5) * Math.min(1 / s.rate, 1)
      const ang = rng() * Math.PI * 2
      const rad = rng() * 0.4
      events.push({ t: Math.max(0, t), x: s.x + Math.cos(ang) * rad, y: s.y + Math.sin(ang) * rad })
    }
  }
  events.sort((a, b) => a.t - b.t)
  const totalSpawned = events.length

  const elevators: ElevState[] = plan.elevators.map((_, i) => ({
    phase: served[i] ? 0 : 2,
    timer: config.doorDwell,
    load: 0,
    cum: 0,
    waitSum: 0,
    boarded: 0,
    boardAcc: 0,
    queue: [],
  }))

  const agents: Agent[] = []
  let nextId = 1
  let evIdx = 0
  let evacuatedStairs = 0
  let stuck = 0

  const pickTarget = (x: number, y: number): number => {
    const [c, r] = worldToCell(grid, x, y)
    if (!isWalk(grid, c, r)) return -1
    const idx = r * grid.cols + c
    let best = -1, bestCost = Infinity
    for (let i = 0; i < grid.targets.length; i++) {
      const d = grid.dist[i][idx]
      if (d >= INF) continue
      const tgt = grid.targets[i]
      // 距离 + 排队折算:电梯前队伍越长,"可用性"越差
      const queueLen = tgt.kind === 'elevator' ? elevators[tgt.elevIndex].queue.length : 0
      const cost = d * grid.cell + queueLen * QUEUE_PENALTY
      if (cost < bestCost) { bestCost = cost; best = i }
    }
    return best
  }

  const snapshots: Snapshot[] = []
  let t = 0
  let step = 0
  const snapEvery = Math.round(SNAP_DT / DT)

  const record = () => {
    const active = agents.filter((a) => a.state !== 2)
    const arr = new Float32Array(active.length * 4)
    active.forEach((a, i) => {
      arr[i * 4] = a.id
      arr[i * 4 + 1] = Math.round(a.x * 100) / 100
      arr[i * 4 + 2] = Math.round(a.y * 100) / 100
      arr[i * 4 + 3] = a.state
    })
    const es: ElevatorSnap[] = elevators.map((e) => ({
      queue: e.queue.length,
      load: e.load,
      phase: e.phase,
      cum: e.cum,
      avgWait: e.boarded > 0 ? Math.round((e.waitSum / e.boarded) * 10) / 10 : 0,
    }))
    snapshots.push({ t: Math.round(t * 10) / 10, agents: arr, elevators: es })
  }

  record()
  while (t < MAX_T) {
    t += DT
    step++
    // 生成新个体
    while (evIdx < events.length && events[evIdx].t <= t) {
      const e = events[evIdx++]
      const target = pickTarget(e.x, e.y)
      if (target < 0) { stuck++; continue }
      agents.push({
        id: nextId++, x: e.x, y: e.y,
        speed: 1.25 * (0.9 + 0.2 * rng()),
        jitter: (rng() - 0.5) * 0.5,
        target, state: 0, waitStart: 0, replanAt: t + REPLAN_INTERVAL * rng(),
      })
    }
    // 移动
    for (const a of agents) {
      if (a.state !== 0) continue
      if (t >= a.replanAt) {
        a.replanAt = t + REPLAN_INTERVAL
        const nt = pickTarget(a.x, a.y)
        if (nt >= 0) a.target = nt
      }
      const tgt = grid.targets[a.target]
      const dxT = tgt.qx - a.x, dyT = tgt.qy - a.y
      const distT = Math.hypot(dxT, dyT)
      // 到达判定
      if (tgt.kind === 'elevator' && distT < QUEUE_JOIN_DIST) {
        a.state = 1
        a.waitStart = t
        elevators[tgt.elevIndex].queue.push(a)
        continue
      }
      if (tgt.kind === 'stair' && distT < STAIR_ARRIVE) {
        a.state = 2
        evacuatedStairs++
        continue
      }
      // 沿距离场梯度走:找 8 邻域中距离最小的格
      const [cc, cr] = worldToCell(grid, a.x, a.y)
      const field = grid.dist[a.target]
      let bc = cc, br = cr, bd = isWalk(grid, cc, cr) ? field[cr * grid.cols + cc] : INF
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dc === 0 && dr === 0) continue
          const nc = cc + dc, nr = cr + dr
          if (!isWalk(grid, nc, nr)) continue
          const d = field[nr * grid.cols + nc]
          if (d < bd) { bd = d; bc = nc; br = nr }
        }
      }
      let gx: number, gy: number
      if (bd >= INF || (bc === cc && br === cr)) {
        gx = tgt.qx; gy = tgt.qy
      } else {
        ;[gx, gy] = cellCenter(grid, bc, br)
      }
      let dx = gx - a.x, dy = gy - a.y
      const len = Math.hypot(dx, dy)
      if (len < 1e-6) continue
      dx /= len; dy /= len
      // 固定横向扰动,避免所有人走成一条线
      const px = -dy * a.jitter, py = dx * a.jitter
      let mx = dx + px, my = dy + py
      const ml = Math.hypot(mx, my)
      mx /= ml; my /= ml
      const nx = a.x + mx * a.speed * DT
      const ny = a.y + my * a.speed * DT
      const [wc, wr] = worldToCell(grid, nx, ny)
      if (isWalk(grid, wc, wr)) { a.x = nx; a.y = ny }
      else { a.x += dx * a.speed * DT * 0.3; a.y += dy * a.speed * DT * 0.3 }
    }
    // 队列站位
    for (const ev of elevators) {
      ev.queue.forEach((a, i) => {
        const tgt = grid.targets.find((g2) => g2.kind === 'elevator' && g2.elevIndex === elevators.indexOf(ev))
        if (!tgt) return
        const elev = plan.elevators[tgt.elevIndex]
        let dx = tgt.qx - (elev.x + elev.w / 2)
        let dy = tgt.qy - (elev.y + elev.h / 2)
        const l = Math.hypot(dx, dy) || 1
        dx /= l; dy /= l
        a.x = tgt.qx + dx * (i + 1) * QUEUE_SLOT
        a.y = tgt.qy + dy * (i + 1) * QUEUE_SLOT
      })
    }
    // 电梯运行
    elevators.forEach((ev, i) => {
      if (ev.phase === 2) return
      ev.timer -= DT
      if (ev.phase === 0) {
        // 装载:按额定载重逐人上梯
        ev.boardAcc += DT
        while (ev.boardAcc >= BOARD_INTERVAL && ev.load < plan.elevators[i].capacity && ev.queue.length > 0) {
          ev.boardAcc -= BOARD_INTERVAL
          const a = ev.queue.shift()!
          a.state = 2
          ev.load++
          ev.cum++
          ev.boarded++
          ev.waitSum += t - a.waitStart
        }
        if (ev.timer <= 0) {
          ev.phase = 1
          ev.timer = config.roundTrip
        }
      } else if (ev.timer <= 0) {
        // 返回本层,轿厢卸空
        ev.phase = 0
        ev.timer = config.doorDwell
        ev.load = 0
        ev.boardAcc = 0
      }
    })
    if (step % snapEvery === 0) record()
    const activeCount = agents.reduce((n, a) => (a.state !== 2 ? n + 1 : n), 0)
    if (evIdx >= events.length && activeCount === 0) break
  }
  record()

  return {
    duration: Math.round(t * 10) / 10,
    snapDt: SNAP_DT,
    snapshots,
    elevators: plan.elevators.map((e, i) => ({
      id: e.id,
      cum: elevators[i].cum,
      avgWait: elevators[i].boarded > 0 ? Math.round((elevators[i].waitSum / elevators[i].boarded) * 10) / 10 : 0,
      served: served[i],
    })),
    evacuatedStairs,
    totalSpawned,
    stuck,
  }
}
