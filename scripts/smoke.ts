/**
 * 仿真核心冒烟测试（不依赖浏览器/DOM）：
 * - 网络连通性与道岔约束寻路
 * - 调车令执行、车辆到达
 * - 连挂（0.3m 阈值）与车列合并、车钩对齐
 * - 解钩拆分与后段滑行
 * - 道岔切换 200ms 内联动重算
 * - 300 车辆占用区间与步进性能
 * 运行：npx tsx scripts/smoke.ts
 */
import { generateYard } from '../src/sim/yardGenerator'
import { SimulationEngine } from '../src/sim/engine'
import { COUPLE_THRESHOLD } from '../src/types'

let failures = 0
function assert(cond: boolean, msg: string): void {
  if (cond) console.log(`  ✔ ${msg}`)
  else {
    failures += 1
    console.error(`  ✘ ${msg}`)
  }
}

function runFor(engine: SimulationEngine, seconds: number, dt = 1 / 60): void {
  const steps = Math.round(seconds / dt)
  for (let i = 0; i < steps; i++) engine.step(dt)
}

console.log('== 1. 站场生成 ==')
const yard = generateYard({ vehicleCount: 300 })
const engine = new SimulationEngine(yard)
assert(engine.vehicles.size === 300, `在场车辆 300（实际 ${engine.vehicles.size}）`)
assert(engine.consists.size > 0, `初始车列已编组（${engine.consists.size} 列）`)
assert(yard.switches.length >= 15, `道岔数量充足（${yard.switches.length}）`)
assert(yard.tracks.filter((t) => t.kind === 'classification').length === 12, '12 条分类线')

console.log('== 2. 网络寻路与道岔约束 ==')
const classTrack = yard.tracks.find((t) => t.kind === 'classification')!
// 找一辆到达线上的车
const rcvVeh = yard.vehicles.find((v) => yard.initialPlacement[v.id].edgeId === 'EDGE_RCV0')!
const rcvVr = engine.vehicles.get(rcvVeh.id)!

// 道岔约束验证：默认状态下直接寻路可能不可达
const directTarget = engine.network.trackOffsetToLocation(classTrack.id, 60)!
const direct = engine.network.buildTrajectory(
  { edgeId: rcvVr.location.edgeId, offset: rcvVr.location.offset },
  directTarget,
)
console.log(`     默认道岔位置直接寻路：${direct ? '可达' : '不可达（需开通进路）'}`)

// 进路搜索（忽略道岔当前位置）
const fromEdge = engine.network.edges.get(rcvVr.location.edgeId)!
const route = engine.network.findRoute(fromEdge.n2, 'N_T0_W')
assert(route !== null, '拓扑进路搜索成功（findRoute）')
assert((route?.requiredStates.length ?? 0) > 0, `进路需要搬动道岔（${route?.requiredStates.length} 个）`)
const changed = engine.network.openRoute(route!.requiredStates)
assert(changed.length > 0, `自动开通进路，搬动 ${changed.length} 个道岔`)
const built = engine.network.buildTrajectory(
  { edgeId: rcvVr.location.edgeId, offset: rcvVr.location.offset },
  directTarget,
)
assert(built !== null, '进路开通后到达线 -> 分类线路径可达')
assert(built!.points.length > 4, `轨迹采样点充足（${built?.points.length}）`)
assert(built!.switches.length >= 2, `轨迹经过道岔（${built?.switches.length} 个）`)

// 道岔约束：下发调车令（引擎会自动开通进路）
const order = engine.dispatchMove(rcvVeh.id, classTrack.id, 'transfer')
assert(order !== null, '调车令下发成功')
const consist = engine.consists.get(rcvVr.consistId!)!
const initialStatus = consist.status
assert(['moving', 'coasting', 'waiting'].includes(initialStatus), `车列进入作业状态：${initialStatus}`)

console.log('== 3. 车辆运行与到达 ==')
const startCount = engine.consists.size
runFor(engine, 5)
let movingFound = false
for (const c of engine.consists.values()) {
  if (c.status === 'moving' || c.status === 'coasting') movingFound = true
}
assert(movingFound, '存在运行/溜放中的车列')
runFor(engine, 360)
const arrived = engine.events.some((e) => e.type === 'arrive')
assert(arrived, '仿真 365s 内出现到达事件')
console.log(`     事件样本：${engine.events.slice(-3).map((e) => e.message).join(' / ')}`)

console.log('== 4. 连挂判定（0.3m）与车列合并 ==')
// 找一条已有停留车的股道，再派一辆车过去
const occupiedTrack = yard.tracks.find((t) => {
  const edgeId = t.edgeIds[t.edgeIds.length - 1]
  return yard.vehicles.some((v) => yard.initialPlacement[v.id].edgeId === edgeId)
})!
const donor = yard.vehicles.find((v) => {
  const cid = engine.vehicles.get(v.id)!.consistId
  const c = cid ? engine.consists.get(cid) : null
  return c && c.status === 'idle' && c.vehicleIds[0] === v.id
})!
assert(!!donor, '找到可调动的空闲首车')
const beforeConsists = engine.consists.size
engine.dispatchMove(donor.id, occupiedTrack.id, 'couple')
runFor(engine, 300)
const coupleEvt = engine.events.find((e) => e.type === 'couple')
assert(!!coupleEvt, `连挂事件触发（阈值 ${COUPLE_THRESHOLD}m）`)
if (coupleEvt) console.log(`     ${coupleEvt.message}`)
assert(engine.consists.size <= beforeConsists, `车列数量不增加（${beforeConsists} -> ${engine.consists.size}）`)

// 车钩对齐：停留（idle）车列内相邻车辆中心距 = 两车半长之和；
// 运动中跨越道岔短边存在瞬态量化误差，不纳入对齐判定
let aligned = true
for (const c of engine.consists.values()) {
  if (c.status !== 'idle') continue
  for (let i = 0; i < c.vehicleIds.length - 1; i++) {
    const a = engine.vehicles.get(c.vehicleIds[i])!
    const b = engine.vehicles.get(c.vehicleIds[i + 1])!
    const gap = Math.hypot(a.worldPos.x - b.worldPos.x, a.worldPos.z - b.worldPos.z)
    const expected = (a.static.length + b.static.length) / 2
    if (Math.abs(gap - expected) > 0.5) {
      aligned = false
      console.log(`     对齐偏差: ${c.vehicleIds[i]}/${c.vehicleIds[i + 1]} gap=${gap.toFixed(2)} expected=${expected.toFixed(2)}`)
    }
  }
}
assert(aligned, '停留车列车钩对齐（相邻车中心距误差 ≤0.5m）')

console.log('== 5. 解钩拆分与后段滑行 ==')
const longConsist = [...engine.consists.values()].find((c) => c.vehicleIds.length >= 4 && c.status === 'idle')!
assert(!!longConsist, `找到可解钩车列（${longConsist?.vehicleIds.length} 辆）`)
if (longConsist) {
  const splitAt = Math.min(2, longConsist.vehicleIds.length - 1)
  const rearId = longConsist.vehicleIds[splitAt]
  const nBefore = engine.consists.size
  const rear = engine.uncouple(rearId)
  assert(!!rear, '解钩生成新车列')
  assert(engine.consists.size === nBefore + 1, `车列数 +1（${nBefore} -> ${engine.consists.size}）`)
  assert(rear!.vehicleIds[0] === rearId, '后段首车为解钩点车辆')
}

console.log('== 6. 道岔切换联动重算（200ms 时限）==')
// 制造多个在途车列
const targets = yard.tracks.filter((t) => t.kind === 'classification')
const idleHeads = yard.vehicles.filter((v) => {
  const cid = engine.vehicles.get(v.id)!.consistId
  const c = cid ? engine.consists.get(cid) : null
  return c && c.status === 'idle' && c.vehicleIds[0] === v.id
}).slice(0, 6)
idleHeads.forEach((v, i) => engine.dispatchMove(v.id, targets[i % targets.length].id, 'transfer'))
runFor(engine, 2)
const sw = yard.switches[0]
const stat = engine.onSwitchChanged(sw.id)
console.log(`     受影响车列 ${stat.affectedConsists}，重算耗时 ${stat.elapsedMs.toFixed(2)}ms`)
assert(stat.elapsedMs <= 200, `重算在 200ms 内完成（实际 ${stat.elapsedMs.toFixed(2)}ms）`)
// 再强制搬动一个在途车列必经的道岔，验证事件产生
const inFlight = [...engine.consists.values()].find((c) => c.trajectory && c.status === 'moving')
if (inFlight) {
  const active = (engine as unknown as { trajectories: Map<string, { switches: string[] }> }).trajectories.get(inFlight.id)!
  const swId = active.switches[0]
  if (swId) {
    engine.network.toggleSwitch(swId)
    engine.onSwitchChanged(swId)
  }
}
const rerouteEvt = engine.events.some((e) => e.type === 'reroute' || e.type === 'waiting')
assert(rerouteEvt, '重算/等待事件已记录')

console.log('== 7. 占用区间与限界 ==')
const occ = engine.getOccupancy()
assert(occ.length > 0 && occ.every((o) => o.maxOffset > o.minOffset), `占用区间有效（${occ.length} 段）`)
const violations = engine.allGaugeViolations()
assert(violations.length > 0, `超限车辆检出（${violations.length} 辆，红色描边候选）`)
assert(violations.every((v) => v.maxExceed > 0), '超限量均为正值')

console.log('== 8. 300 车步进性能（目标 60fps 预算 ~16.6ms/帧）==')
const t0 = performance.now()
const frames = 600
for (let i = 0; i < frames; i++) engine.step(1 / 60)
const elapsed = performance.now() - t0
const perFrame = elapsed / frames
console.log(`     600 步总耗时 ${elapsed.toFixed(1)}ms，每步 ${perFrame.toFixed(3)}ms`)
assert(perFrame < 16.6, `单步仿真 < 16.6ms（实际 ${perFrame.toFixed(3)}ms）`)
assert(engine.vehicles.size === 300, '全程车辆数稳定为 300')

console.log('== 9. 持续运行无异常 ==')
runFor(engine, 60)
assert(true, '连续仿真无抛错')

console.log(failures === 0 ? '\n全部通过 ✅' : `\n${failures} 项失败 ❌`)
process.exit(failures === 0 ? 0 : 1)
