// 数据模型:平面、电梯、客流源、推演配置与结果
export interface RectShape {
  id: string
  x: number // 米
  y: number
  w: number
  h: number
}

export interface Elevator extends RectShape {
  capacity: number // 额定载重(人)
}

export interface Source {
  id: string
  x: number
  y: number
  rate: number // 到达速率 人/秒
  total: number // 总人数
}

export interface Plan {
  floors: RectShape[] // 楼层平面(可行走区域的并集)
  waitingZones: RectShape[] // 候梯区
  elevators: Elevator[] // 电梯厅
  stairs: RectShape[] // 楼梯口
  sources: Source[] // 客流源
}

export type Strategy = 'all' | 'oddeven' | 'zoned'

export interface SimConfig {
  currentFloor: number // 当前所在楼层
  buildingFloors: number // 建筑总层数
  strategy: Strategy // 停靠策略
  roundTrip: number // 电梯往返时间(秒)
  doorDwell: number // 开门停靠时间(秒)
  densityThreshold: number // 密度阈值 人/m²,超过叠加脉冲圈
}

export const emptyPlan = (): Plan => ({
  floors: [],
  waitingZones: [],
  elevators: [],
  stairs: [],
  sources: [],
})

export const defaultConfig = (): SimConfig => ({
  currentFloor: 5,
  buildingFloors: 10,
  strategy: 'all',
  roundTrip: 20,
  doorDwell: 6,
  densityThreshold: 2.0,
})

/** 计算某部电梯在指定停靠策略下服务的楼层集合 */
export function elevatorStops(
  index: number,
  count: number,
  buildingFloors: number,
  strategy: Strategy,
): number[] {
  const all = Array.from({ length: buildingFloors }, (_, i) => i + 1)
  if (strategy === 'all' || count <= 1) return all
  if (strategy === 'oddeven') {
    return all.filter((f) => (index % 2 === 0 ? f % 2 === 1 : f % 2 === 0))
  }
  // zoned:分区停靠,每部电梯服务 1 层 + 自己的分区
  const per = Math.max(1, Math.ceil((buildingFloors - 1) / count))
  const start = 2 + index * per
  return all.filter((f) => f === 1 || (f >= start && f < start + per))
}

export function servesFloor(
  index: number,
  count: number,
  floor: number,
  config: SimConfig,
): boolean {
  return elevatorStops(index, count, config.buildingFloors, config.strategy).includes(floor)
}

export const uid = (): string => Math.random().toString(36).slice(2, 10)

// ---------- 推演结果 ----------
export interface ElevatorSnap {
  queue: number // 排队长度
  load: number // 轿厢内已载人数
  phase: number // 0=停靠装载 1=往返运行 2=不停靠本层
  cum: number // 累计载客
  avgWait: number // 已登梯者的平均等待(秒)
}

export interface Snapshot {
  t: number
  /** [id, x, y, state] 扁平数组,state: 0=行走 1=排队 */
  agents: Float32Array
  elevators: ElevatorSnap[]
}

export interface ElevatorStat {
  id: string
  cum: number
  avgWait: number
  served: boolean
}

export interface SimResult {
  duration: number
  snapDt: number
  snapshots: Snapshot[]
  elevators: ElevatorStat[]
  evacuatedStairs: number
  totalSpawned: number
  stuck: number
}
