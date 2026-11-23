// 引擎冒烟测试(一次性脚本,不随应用打包)
import { runSimulation } from '../src/sim/engine'
import { demoPlan } from '../src/model/demo'
import { defaultConfig } from '../src/model/types'

const plan = demoPlan()
const config = defaultConfig()

const r1 = runSimulation(plan, config)
if (!r1) throw new Error('结果为空')
console.log('时长:', r1.duration, 's  快照数:', r1.snapshots.length)
console.log('到达:', r1.totalSpawned, ' 楼梯疏散:', r1.evacuatedStairs, ' 滞留:', r1.stuck)
r1.elevators.forEach((e, i) => console.log(`E${i + 1} 累计:${e.cum} 平均等待:${e.avgWait}s 服务本层:${e.served}`))
const evacuated = r1.elevators.reduce((n, e) => n + e.cum, 0) + r1.evacuatedStairs
console.log('总疏散:', evacuated, '/', r1.totalSpawned)
if (evacuated + r1.stuck !== r1.totalSpawned) throw new Error('疏散人数不平')

// 确定性:同配置两次结果一致
const r2 = runSimulation(plan, config)
if (JSON.stringify(r1) !== JSON.stringify(r2)) throw new Error('结果不确定')
console.log('确定性: OK')

// 改策略后结果应变化且仍守恒
const r3 = runSimulation(plan, { ...config, strategy: 'oddeven' })
console.log('单双层策略: 时长', r3!.duration, 's, 服务电梯数:', r3!.elevators.filter((e) => e.served).length)
const evac3 = r3!.elevators.reduce((n, e) => n + e.cum, 0) + r3!.evacuatedStairs
if (evac3 + r3!.stuck !== r3!.totalSpawned) throw new Error('策略变更后人数不平')
console.log('全部通过')
