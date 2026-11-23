// 组件层统一从这里引入仿真类型，避免相对路径过深
export type {
  Consist,
  EdgeLocation,
  GaugeProfile,
  MoveOrder,
  ShuntingJob,
  ShuntingPlan,
  SimEvent,
  SwitchState,
  TrackDef,
  VehicleRuntime,
  VehicleStatic,
  YardData,
} from '../types'
export { SimulationEngine } from './engine'
export type { GaugeViolation, OccupancyInterval } from './engine'
export { YardRenderer } from './renderer'
export type { PickResult } from './renderer'
export { SimStore } from './store'
export type { Snapshot } from './store'
