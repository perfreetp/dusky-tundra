// 导航网格:把楼层平面栅格化,对每个疏散目标(电梯/楼梯)做 BFS 距离场
import type { Plan } from './types'

export interface TargetInfo {
  kind: 'elevator' | 'stair'
  refId: string
  elevIndex: number // kind=elevator 时在 plan.elevators 中的下标,否则 -1
  qx: number // 目标点(电梯门前集结点 / 楼梯口中心)世界坐标
  qy: number
  col: number
  row: number
}

export interface NavGrid {
  cell: number
  cols: number
  rows: number
  ox: number
  oy: number
  walk: Uint8Array
  targets: TargetInfo[]
  dist: Int32Array[] // 与 targets 对齐,每个目标的 BFS 距离场(格数,不可达=INF)
}

export const INF = 1_000_000_000

export function worldToCell(g: NavGrid, x: number, y: number): [number, number] {
  return [Math.floor((x - g.ox) / g.cell), Math.floor((y - g.oy) / g.cell)]
}

export function cellCenter(g: NavGrid, col: number, row: number): [number, number] {
  return [g.ox + (col + 0.5) * g.cell, g.oy + (row + 0.5) * g.cell]
}

export function isWalk(g: NavGrid, col: number, row: number): boolean {
  if (col < 0 || row < 0 || col >= g.cols || row >= g.rows) return false
  return g.walk[row * g.cols + col] === 1
}

function pointInFloors(plan: Plan, x: number, y: number): boolean {
  return plan.floors.some(
    (r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h,
  )
}

/** 找离 (x,y) 最近的可行走格 */
function nearestWalkCell(g: NavGrid, x: number, y: number): [number, number] | null {
  let [c, r] = worldToCell(g, x, y)
  if (isWalk(g, c, r)) return [c, r]
  for (let rad = 1; rad < Math.max(g.cols, g.rows); rad++) {
    for (let dr = -rad; dr <= rad; dr++) {
      for (let dc = -rad; dc <= rad; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue
        if (isWalk(g, c + dc, r + dr)) return [c + dc, r + dr]
      }
    }
  }
  return null
}

function bfs(g: NavGrid, sc: number, sr: number): Int32Array {
  const d = new Int32Array(g.cols * g.rows).fill(INF)
  const queue = new Int32Array(g.cols * g.rows)
  let head = 0, tail = 0
  const si = sr * g.cols + sc
  d[si] = 0
  queue[tail++] = si
  while (head < tail) {
    const cur = queue[head++]
    const cc = cur % g.cols
    const cr = (cur / g.cols) | 0
    const nd = d[cur] + 1
    // 4 邻域
    if (cc > 0 && g.walk[cur - 1] === 1 && d[cur - 1] === INF) { d[cur - 1] = nd; queue[tail++] = cur - 1 }
    if (cc < g.cols - 1 && g.walk[cur + 1] === 1 && d[cur + 1] === INF) { d[cur + 1] = nd; queue[tail++] = cur + 1 }
    if (cr > 0 && g.walk[cur - g.cols] === 1 && d[cur - g.cols] === INF) { d[cur - g.cols] = nd; queue[tail++] = cur - g.cols }
    if (cr < g.rows - 1 && g.walk[cur + g.cols] === 1 && d[cur + g.cols] === INF) { d[cur + g.cols] = nd; queue[tail++] = cur + g.cols }
  }
  return d
}

/**
 * 构建导航网格。
 * @param served 与 plan.elevators 对齐,该电梯是否停靠当前层
 */
export function buildNavGrid(plan: Plan, served: boolean[], cell = 0.5): NavGrid | null {
  if (plan.floors.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const r of plan.floors) {
    minX = Math.min(minX, r.x); minY = Math.min(minY, r.y)
    maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h)
  }
  const pad = cell * 2
  const ox = minX - pad, oy = minY - pad
  const cols = Math.max(1, Math.ceil((maxX - minX + pad * 2) / cell))
  const rows = Math.max(1, Math.ceil((maxY - minY + pad * 2) / cell))
  const g: NavGrid = { cell, cols, rows, ox, oy, walk: new Uint8Array(cols * rows), targets: [], dist: [] }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [wx, wy] = cellCenter(g, c, r)
      g.walk[r * cols + c] = pointInFloors(plan, wx, wy) ? 1 : 0
    }
  }
  // 电梯目标
  plan.elevators.forEach((e, i) => {
    if (!served[i]) return
    const nc = nearestWalkCell(g, e.x + e.w / 2, e.y + e.h / 2)
    if (!nc) return
    const [qx, qy] = cellCenter(g, nc[0], nc[1])
    g.targets.push({ kind: 'elevator', refId: e.id, elevIndex: i, qx, qy, col: nc[0], row: nc[1] })
  })
  // 楼梯目标
  for (const s of plan.stairs) {
    const nc = nearestWalkCell(g, s.x + s.w / 2, s.y + s.h / 2)
    if (!nc) continue
    const [qx, qy] = cellCenter(g, nc[0], nc[1])
    g.targets.push({ kind: 'stair', refId: s.id, elevIndex: -1, qx, qy, col: nc[0], row: nc[1] })
  }
  g.dist = g.targets.map((t) => bfs(g, t.col, t.row))
  return g
}

/** 某格最近的可用目标下标(按 BFS 距离),不可达返回 -1 */
export function nearestTarget(g: NavGrid, col: number, row: number): number {
  if (!isWalk(g, col, row)) return -1
  const idx = row * g.cols + col
  let best = -1, bestD = INF
  for (let i = 0; i < g.targets.length; i++) {
    const d = g.dist[i][idx]
    if (d < bestD) { bestD = d; best = i }
  }
  return bestD >= INF ? -1 : best
}
