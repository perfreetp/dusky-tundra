import { useEffect, useRef, useState } from 'react'
import type { DragPayload } from './PlanPanel'
import type { ShuntingJob, SimulationEngine, Snapshot, YardRenderer } from '../sim/engine-types'

interface Props {
  engine: SimulationEngine
  renderer: YardRenderer
  snapshot: Snapshot
  onSelectVehicle: (id: string | null) => void
  onDispatch: (vehicleId: string, targetTrackId: string, kind: ShuntingJob['kind']) => void
  onToggleGauge: (on: boolean) => void
  gaugeMode: boolean
  onToast: (msg: string, error?: boolean) => void
}

export function Viewport({
  engine,
  renderer,
  snapshot,
  onSelectVehicle,
  onDispatch,
  onToggleGauge,
  gaugeMode,
  onToast,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [dragLabel, setDragLabel] = useState('')
  const [hoverTrack, setHoverTrack] = useState<string | null>(null)

  useEffect(() => {
    renderer.setGaugeMode(gaugeMode)
  }, [gaugeMode, renderer])

  useEffect(() => {
    const handlePick = (pick: { vehicleId: string } | null) => {
      if (pick) {
        engine.selectedVehicleId = pick.vehicleId
        renderer.setFollow(pick.vehicleId)
        onSelectVehicle(pick.vehicleId)
      } else {
        engine.selectedVehicleId = null
        renderer.setFollow(null)
        onSelectVehicle(null)
      }
    }
    renderer.opts.onPick = handlePick
  }, [renderer, engine, onSelectVehicle])

  const readPayload = (e: React.DragEvent): DragPayload | null => {
    const raw = e.dataTransfer.getData('application/x-shunting-job')
    const rawVeh = e.dataTransfer.getData('application/x-vehicle')
    try {
      if (raw) return JSON.parse(raw) as DragPayload
      if (rawVeh) {
        const p = JSON.parse(rawVeh) as { vehicleId: string }
        return { vehicleId: p.vehicleId, kind: 'transfer', planId: 'DRAG', label: p.vehicleId }
      }
    } catch {
      return null
    }
    return null
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const trackId = renderer.pickTrackAt(e.clientX, e.clientY)
    setHoverTrack(trackId)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const payload = readPayload(e)
    if (!payload) return
    const trackId = renderer.pickTrackAt(e.clientX, e.clientY)
    if (!trackId) {
      onToast('请将车辆投放到具体股道上', true)
      return
    }
    const track = engine.network.tracks.get(trackId)
    onDispatch(payload.vehicleId, trackId, payload.kind)
    onToast(`${payload.vehicleId} → ${track?.name ?? trackId}`)
  }

  const resetView = () => {
    renderer.camera.position.set(120, 260, 340)
    renderer.controls.target.set(120, 0, -60)
    renderer.setFollow(null)
    engine.selectedVehicleId = null
    onSelectVehicle(null)
  }

  const followSelected = () => {
    if (engine.selectedVehicleId) renderer.setFollow(engine.selectedVehicleId)
  }

  const fpsClass = snapshot.fps >= 55 ? 'good' : snapshot.fps >= 40 ? 'warn' : 'bad'

  return (
    <div
      className="viewport"
      ref={containerRef}
      onDragEnter={(e) => {
        e.preventDefault()
        const p = readPayload(e)
        if (p) {
          setDragLabel(p.label)
          setDragOver(true)
        }
      }}
      onDragOver={onDragOver}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragOver(false)
      }}
      onDrop={onDrop}
    >
      <div className="hud">
        <span className="chip">仿真时刻 <b>{snapshot.simTime.toFixed(1)}s</b></span>
        <span className="chip">车辆 <b>{snapshot.vehicleCount}</b></span>
        <span className="chip">车列 <b>{snapshot.consistCount}</b></span>
        <span className="chip">运行中 <b>{snapshot.movingCount}</b></span>
        <span className={`chip ${snapshot.waitingCount > 0 ? 'warn' : ''}`}>
          等待 <b>{snapshot.waitingCount}</b>
        </span>
        <span className={`chip ${fpsClass}`}>
          FPS <b>{snapshot.fps}</b> · {snapshot.drawCalls} draw calls
        </span>
        {snapshot.lastRerouteMs !== null && (
          <span className={`chip ${snapshot.lastRerouteMs <= 200 ? 'good' : 'bad'}`}>
            重算 <b>{snapshot.lastRerouteMs.toFixed(1)}ms</b> / {snapshot.rerouteAffected} 列
          </span>
        )}
      </div>

      <div className="view-controls">
        <button onClick={resetView}>重置视角</button>
        <button onClick={followSelected} disabled={!snapshot.selectedVehicleId}>
          跟随选中车辆
        </button>
        <button
          className={gaugeMode ? 'primary' : ''}
          onClick={() => onToggleGauge(!gaugeMode)}
        >
          限界检查视图 {gaugeMode ? '开' : '关'}
        </button>
      </div>

      {hoverTrack && dragOver && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 12,
            background: 'rgba(20,64,92,0.9)',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: 'none',
          }}
        >
          目标：{engine.network.tracks.get(hoverTrack)?.name ?? hoverTrack}
        </div>
      )}

      <div className={`drop-hint ${dragOver ? 'show' : ''}`}>
        投放 {dragLabel} 到目标股道
      </div>
    </div>
  )
}
