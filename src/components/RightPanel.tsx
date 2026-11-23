// 右侧面板:选中对象属性、推演配置、各电梯统计
import type { Plan, SimConfig, SimResult, Strategy } from '../model/types'
import { elevatorStops } from '../model/types'

interface Props {
  plan: Plan
  simConfig: SimConfig
  result: SimResult | null
  prevResult: SimResult | null
  showCompare: boolean
  selectedId: string | null
  time: number
  onPlanChange: (p: Plan) => void
  onConfigChange: (c: SimConfig) => void
  onSelect: (id: string | null) => void
}

export default function RightPanel(p: Props) {
  const { plan, simConfig, result, selectedId } = p

  const selSource = plan.sources.find((s) => s.id === selectedId)
  const selElevIdx = plan.elevators.findIndex((e) => e.id === selectedId)
  const selElev = selElevIdx >= 0 ? plan.elevators[selElevIdx] : null

  const updateSource = (id: string, patch: Partial<{ rate: number; total: number }>) => {
    p.onPlanChange({
      ...plan,
      sources: plan.sources.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })
  }
  const updateElevator = (id: string, patch: Partial<{ capacity: number }>) => {
    p.onPlanChange({
      ...plan,
      elevators: plan.elevators.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })
  }
  const removeById = (id: string) => {
    p.onPlanChange({
      floors: plan.floors.filter((r) => r.id !== id),
      waitingZones: plan.waitingZones.filter((r) => r.id !== id),
      elevators: plan.elevators.filter((r) => r.id !== id),
      stairs: plan.stairs.filter((r) => r.id !== id),
      sources: plan.sources.filter((r) => r.id !== id),
    })
    p.onSelect(null)
  }

  const snapIdx = result
    ? Math.min(result.snapshots.length - 1, Math.max(0, Math.floor(p.time / result.snapDt)))
    : 0
  const snap = result ? result.snapshots[snapIdx] : null

  return (
    <div className="right-panel">
      {selSource && (
        <section>
          <h3>客流源</h3>
          <label>
            到达速率 (人/秒)
            <input
              type="number" min={0.05} step={0.05} value={selSource.rate}
              onChange={(e) => updateSource(selSource.id, { rate: Math.max(0.05, Number(e.target.value) || 0.05) })}
            />
          </label>
          <label>
            总人数
            <input
              type="number" min={1} step={1} value={selSource.total}
              onChange={(e) => updateSource(selSource.id, { total: Math.max(1, Math.round(Number(e.target.value) || 1)) })}
            />
          </label>
          <button className="danger" onClick={() => removeById(selSource.id)}>删除该客流源</button>
        </section>
      )}
      {selElev && (
        <section>
          <h3>电梯 E{selElevIdx + 1}</h3>
          <label>
            额定载重 (人)
            <input
              type="number" min={1} step={1} value={selElev.capacity}
              onChange={(e) => updateElevator(selElev.id, { capacity: Math.max(1, Math.round(Number(e.target.value) || 1)) })}
            />
          </label>
          <div className="hint">
            停靠层:{elevatorStops(selElevIdx, plan.elevators.length, simConfig.buildingFloors, simConfig.strategy).join(', ')}
          </div>
          <button className="danger" onClick={() => removeById(selElev.id)}>删除该电梯</button>
        </section>
      )}
      {selectedId && !selSource && !selElev && (
        <section>
          <h3>已选中对象</h3>
          <button className="danger" onClick={() => removeById(selectedId)}>删除</button>
        </section>
      )}

      <section>
        <h3>推演配置</h3>
        <label>
          当前楼层
          <input
            type="number" min={1} value={simConfig.currentFloor}
            onChange={(e) => p.onConfigChange({ ...simConfig, currentFloor: Math.max(1, Math.round(Number(e.target.value) || 1)) })}
          />
        </label>
        <label>
          建筑总层数
          <input
            type="number" min={1} value={simConfig.buildingFloors}
            onChange={(e) => p.onConfigChange({ ...simConfig, buildingFloors: Math.max(1, Math.round(Number(e.target.value) || 1)) })}
          />
        </label>
        <label>
          停靠策略
          <select
            value={simConfig.strategy}
            onChange={(e) => p.onConfigChange({ ...simConfig, strategy: e.target.value as Strategy })}
          >
            <option value="all">全部停靠</option>
            <option value="oddeven">单双层停靠</option>
            <option value="zoned">分区停靠</option>
          </select>
        </label>
        <label>
          往返时间 (秒)
          <input
            type="number" min={2} value={simConfig.roundTrip}
            onChange={(e) => p.onConfigChange({ ...simConfig, roundTrip: Math.max(2, Number(e.target.value) || 2) })}
          />
        </label>
        <label>
          开门停靠 (秒)
          <input
            type="number" min={1} value={simConfig.doorDwell}
            onChange={(e) => p.onConfigChange({ ...simConfig, doorDwell: Math.max(1, Number(e.target.value) || 1) })}
          />
        </label>
        <label>
          密度阈值 (人/m²)
          <input
            type="number" min={0.5} step={0.1} value={simConfig.densityThreshold}
            onChange={(e) => p.onConfigChange({ ...simConfig, densityThreshold: Math.max(0.5, Number(e.target.value) || 0.5) })}
          />
        </label>
      </section>

      <section>
        <h3>电梯统计{result ? '' : '(暂无结果)'}</h3>
        {result && (
          <table className="stats">
            <thead>
              <tr><th>电梯</th><th>累计载客</th><th>平均等待</th><th>当前排队</th></tr>
            </thead>
            <tbody>
              {result.elevators.map((e, i) => {
                const prev = p.showCompare && p.prevResult ? p.prevResult.elevators[i] : null
                return (
                  <tr
                    key={e.id}
                    className={e.id === selectedId ? 'selected' : ''}
                    onClick={() => p.onSelect(e.id === selectedId ? null : e.id)}
                  >
                    <td>E{i + 1}{e.served ? '' : ' (不停)'}</td>
                    <td>{e.cum}{prev ? ` (前${prev.cum})` : ''}</td>
                    <td>{e.avgWait.toFixed(1)}s{prev ? ` (前${prev.avgWait.toFixed(1)}s)` : ''}</td>
                    <td>{snap ? snap.elevators[i]?.queue ?? 0 : 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {result && (
          <div className="hint">
            楼梯疏散 {result.evacuatedStairs} 人 · 共到达 {result.totalSpawned} 人
            {result.stuck > 0 ? ` · ${result.stuck} 人无可达路径` : ''}
            <br />总疏散用时 {result.duration.toFixed(1)} 秒
          </div>
        )}
        {result && <div className="hint">点击表格中的电梯可高亮其服务范围</div>}
      </section>
    </div>
  )
}
