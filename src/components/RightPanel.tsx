import { useMemo, useState } from 'react'
import type { SimulationEngine, Snapshot } from '../sim/engine-types'

interface Props {
  engine: SimulationEngine
  snapshot: Snapshot
  selectedId: string | null
  onSelect: (id: string) => void
  onSwitchToggle: (id: string) => void
}

const STATUS_LABEL: Record<string, string> = {
  idle: '停留',
  moving: '调车中',
  coasting: '溜放中',
  waiting: '等待',
}

export function RightPanel({ engine, snapshot, selectedId, onSelect, onSwitchToggle }: Props) {
  const [filter, setFilter] = useState('')
  const [gaugeOnly, setGaugeOnly] = useState(false)

  const rows = useMemo(() => {
    const kw = filter.trim().toLowerCase()
    return snapshot.vehicleRows.filter((r) => {
      if (gaugeOnly && !r.outOfGauge) return false
      if (!kw) return true
      return r.id.toLowerCase().includes(kw) || r.type.toLowerCase().includes(kw)
    })
  }, [snapshot.vehicleRows, filter, gaugeOnly])

  const selected = selectedId ? engine.vehicles.get(selectedId) : null
  const gaugeResult = selectedId ? engine.gaugeCheck(selectedId) : null

  return (
    <div className="panel right">
      <div className="panel-section">
        <h2>车辆（{snapshot.vehicleCount} 节，可拖到股道）</h2>
        <input
          className="search-box"
          type="text"
          placeholder="搜索车号 / 车型…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="toggle-row">
          <label>仅看超限车</label>
          <input type="checkbox" checked={gaugeOnly} onChange={(e) => setGaugeOnly(e.target.checked)} />
        </div>
        <div className="scroll-list" style={{ maxHeight: 260 }}>
          {rows.slice(0, 200).map((r) => (
            <div
              key={r.id}
              className={`vehicle-card ${r.id === selectedId ? 'selected' : ''}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/x-vehicle',
                  JSON.stringify({ vehicleId: r.id }),
                )
                e.dataTransfer.effectAllowed = 'move'
              }}
              onClick={() => onSelect(r.id)}
              title="点击选中跟随，或拖放到三维视图股道"
            >
              <div className="row">
                <b>{r.id}</b>
                {r.outOfGauge && <span className="badge oversize">超限</span>}
                <span className={`badge ${r.status}`}>{STATUS_LABEL[r.status]}</span>
              </div>
              <div className="row muted">
                <span>{r.type}</span>
                <span>{r.trackName}</span>
              </div>
              {r.eta !== null && (r.status === 'moving' || r.status === 'coasting' || r.status === 'waiting') && (
                <div className="row muted">
                  <span>速度 {r.speed.toFixed(1)} m/s</span>
                  <span>预计 {r.eta.toFixed(0)}s 后到达</span>
                </div>
              )}
            </div>
          ))}
          {rows.length > 200 && <div className="empty-hint">仅显示前 200 辆，请用搜索过滤</div>}
        </div>
      </div>

      {selected && gaugeResult && (
        <div className="panel-section">
          <h2>车辆详情 / 限界检查</h2>
          <div className="gauge-panel">
            <GaugeSvg engine={engine} vehicleId={selected.static.id} />
          </div>
          <div style={{ margin: '8px 0', fontSize: 11.5, lineHeight: 1.7 }}>
            <div>车号：<b>{selected.static.id}</b>　车型：{selected.static.type}</div>
            <div>
              尺寸：{selected.static.length.toFixed(2)} × {selected.static.width.toFixed(2)} ×{' '}
              {selected.static.height.toFixed(2)} m
            </div>
            <div>
              限界判定：
              {gaugeResult.points.length > 0 ? (
                <b style={{ color: 'var(--danger)' }}>
                  超限（最大超出 {gaugeResult.maxExceed.toFixed(2)} m，红色描边标注）
                </b>
              ) : (
                <b style={{ color: 'var(--accent-2)' }}>符合建筑限界</b>
              )}
            </div>
          </div>
          <div className="btn-row">
            <button
              className="danger"
              disabled={!selected.consistId}
              onClick={() => engine.uncouple(selected.static.id)}
            >
              从此车解钩
            </button>
          </div>
        </div>
      )}

      <div className="panel-section">
        <h2>道岔控制（切换联动重算路径）</h2>
        <div className="scroll-list" style={{ maxHeight: 200 }}>
          {engine.yard.switches.map((sw) => (
            <div key={sw.id} className="switch-row">
              <span>{sw.id}</span>
              <span className={`state s${sw.state}`}>
                {sw.state === 0 ? '侧线（进股道）' : '直向（梯线）'}
              </span>
              <button style={{ padding: '3px 8px' }} onClick={() => onSwitchToggle(sw.id)}>
                切换
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h2>性能统计</h2>
        <div className="stats-grid">
          <div className="stat">
            <div className="num">{snapshot.vehicleCount}</div>
            <div className="label">在场车辆</div>
          </div>
          <div className="stat">
            <div className="num">{snapshot.fps}</div>
            <div className="label">FPS（目标 60）</div>
          </div>
          <div className="stat">
            <div className="num">{snapshot.drawCalls}</div>
            <div className="label">Draw Calls</div>
          </div>
          <div className="stat">
            <div className="num">{snapshot.consistCount}</div>
            <div className="label">车列数</div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h2>作业事件</h2>
        <div className="scroll-list" style={{ maxHeight: 240 }}>
          {snapshot.events.map((ev, i) => (
            <div key={i} className={`event-row event-type-${ev.type}`}>
              <span className="time">{ev.time.toFixed(1)}s</span>
              {ev.message}
            </div>
          ))}
          {snapshot.events.length === 0 && <div className="empty-hint">暂无作业事件</div>}
        </div>
      </div>
    </div>
  )
}

/** 限界截面 SVG：建筑限界轮廓 + 车辆半宽轮廓，超限点红色 */
function GaugeSvg({ engine, vehicleId }: { engine: SimulationEngine; vehicleId: string }) {
  const vr = engine.vehicles.get(vehicleId)!
  const gauge = engine.yard.gauge
  const result = engine.gaugeCheck(vehicleId)
  const W = 300
  const H = 240
  const maxW = 4.2
  const maxH = gauge.maxHeight
  const sx = (w: number) => W / 2 + (w / maxW) * (W / 2 - 20)
  const sy = (y: number) => H - 16 - (y / maxH) * (H - 32)

  const gaugePath = [
    ...gauge.halfWidths.map((p) => `${sx(p.w)},${sy(p.y)}`),
    ...[...gauge.halfWidths].reverse().map((p) => `${sx(-p.w)},${sy(p.y)}`),
  ].join(' ')

  const outline = vr.static.outline
  const vehPath = [
    ...outline.map((p) => `${sx(p.x)},${sy(p.y)}`),
    ...[...outline].reverse().map((p) => `${sx(-p.x)},${sy(p.y)}`),
  ].join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`}>
      {/* 中线 */}
      <line x1={W / 2} y1={8} x2={W / 2} y2={H - 16} stroke="#33455a" strokeDasharray="4 4" />
      {/* 建筑限界 */}
      <polygon points={gaugePath} fill="rgba(255,213,79,0.10)" stroke="#ffd54f" strokeWidth="1.6" />
      {/* 车辆轮廓 */}
      <polygon
        points={vehPath}
        fill={result.points.length > 0 ? 'rgba(255,90,90,0.18)' : 'rgba(79,195,247,0.18)'}
        stroke={result.points.length > 0 ? '#ff5a5a' : '#4fc3f7'}
        strokeWidth="1.8"
      />
      {/* 超限点 */}
      {result.points.map((p, i) => (
        <g key={i}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill="#ff5a5a" />
          <circle cx={sx(-p.x)} cy={sy(p.y)} r="3.5" fill="#ff5a5a" />
          <line
            x1={sx(p.limit)}
            y1={sy(p.y)}
            x2={sx(p.x)}
            y2={sy(p.y)}
            stroke="#ff5a5a"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
        </g>
      ))}
      <text x={8} y={16} fill="#8497ab" fontSize="10">
        黄线=建筑限界　蓝/红线=车辆轮廓
      </text>
    </svg>
  )
}
