// 示例平面:快速体验用
import type { Plan } from './types'
import { uid } from './types'

export function demoPlan(): Plan {
  return {
    floors: [
      { id: uid(), x: 0, y: 0, w: 30, h: 14 }, // 大厅
      { id: uid(), x: -8, y: 4, w: 8, h: 6 }, // 左侧入口走廊
      { id: uid(), x: 30, y: 4, w: 8, h: 6 }, // 右侧入口走廊
    ],
    waitingZones: [{ id: uid(), x: 10, y: 2, w: 10, h: 6 }],
    elevators: [
      { id: uid(), x: 11, y: 0.5, w: 2.4, h: 2, capacity: 10 },
      { id: uid(), x: 14, y: 0.5, w: 2.4, h: 2, capacity: 10 },
      { id: uid(), x: 17, y: 0.5, w: 2.4, h: 2, capacity: 13 },
    ],
    stairs: [{ id: uid(), x: 27, y: 11, w: 2.5, h: 2.5 }],
    sources: [
      { id: uid(), x: -7, y: 7, rate: 0.8, total: 60 },
      { id: uid(), x: 37, y: 7, rate: 0.5, total: 40 },
    ],
  }
}
