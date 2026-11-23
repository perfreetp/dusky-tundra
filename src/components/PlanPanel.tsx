import { useState } from 'react'
import type { ShuntingJob, ShuntingPlan, SimulationEngine } from '../sim/engine-types'

export interface DragPayload {
  vehicleId: string
  kind: ShuntingJob['kind']
  planId: string
  label: string
}

interface Props {
  engine: SimulationEngine
  plans: ShuntingPlan[]
  onRunPlan: (plan: ShuntingPlan) => void
  onRunJob: (job: ShuntingJob) => void
  runningPlanId: string | null
}

export function PlanPanel({ engine, plans, onRunPlan, onRunJob, runningPlanId }: Props) {
  const [activeId, setActiveId] = useState(plans[0]?.id ?? '')
  const active = plans.find((p) => p.id === activeId) ?? plans[0]

  const trackName = (id: string) => engine.network.tracks.get(id)?.name ?? id

  const onDragStart = (e: React.DragEvent, job: ShuntingJob) => {
    const payload: DragPayload = {
      vehicleId: job.vehicleId,
      kind: job.kind,
      planId: job.id,
      label: `${job.vehicleId} → ${trackName(job.toTrackId)}`,
    }
    e.dataTransfer.setData('application/x-shunting-job', JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="panel">
      <div className="panel-section">
        <h2>调车计划</h2>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.id === active?.id ? 'active' : ''}`}
            onClick={() => setActiveId(plan.id)}
          >
            <div className="title">
              <span>{plan.name}</span>
              <span className="muted" style={{ color: 'var(--muted)', fontSize: 11 }}>
                {plan.jobs.length} 钩
              </span>
            </div>
            <div className="desc">{plan.description}</div>
            <div className="btn-row">
              <button
                className="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  onRunPlan(plan)
                }}
                disabled={runningPlanId === plan.id}
              >
                {runningPlanId === plan.id ? '执行中…' : '执行计划'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-section scroll-list">
        <h2>作业钩计划（可拖到 3D 股道）</h2>
        {active?.jobs.map((job) => {
          const vs = engine.getVehicleStatic(job.vehicleId)
          return (
            <div
              key={job.id}
              className="job-row"
              draggable
              onDragStart={(e) => onDragStart(e, job)}
              onDoubleClick={() => onRunJob(job)}
              title="拖动到三维视图中的目标股道，或双击直接执行"
            >
              <span className={`kind-tag kind-${job.kind}`}>
                {job.kind === 'uncouple' ? '解钩' : job.kind === 'couple' ? '连挂' : '取送'}
              </span>
              <div style={{ minWidth: 0 }}>
                <div>{job.vehicleId}{vs?.outOfGauge ? ' ⚠' : ''}</div>
                <div style={{ color: 'var(--muted)', fontSize: 10.5 }}>
                  {trackName(job.fromTrackId)} → {trackName(job.toTrackId)}
                </div>
              </div>
              <button
                style={{ marginLeft: 'auto', padding: '3px 8px' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onRunJob(job)
                }}
                title="执行此钩"
              >
                执行
              </button>
            </div>
          )
        })}
        <div className="empty-hint">
          提示：拖放作业到三维视图中的股道可手动指定目标；车辆也可直接从右侧列表拖出。
        </div>
      </div>
    </div>
  )
}
