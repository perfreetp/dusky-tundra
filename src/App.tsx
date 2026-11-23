import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { generateYard } from './sim/yardGenerator'
import {
  exportYardFile,
  importYardFile,
  loadYardFromLocal,
  savePlansToLocal,
  saveYardToLocal,
} from './sim/storage'
import { SimulationEngine, SimStore, YardRenderer } from './sim/engine-types'
import type { ShuntingJob, ShuntingPlan, Snapshot, YardData } from './sim/engine-types'
import { PlanPanel } from './components/PlanPanel'
import { Viewport } from './components/Viewport'
import { RightPanel } from './components/RightPanel'

interface Toast {
  id: number
  msg: string
  error: boolean
}

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SimulationEngine | null>(null)
  const rendererRef = useRef<YardRenderer | null>(null)
  const storeRef = useRef<SimStore | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [ready, setReady] = useState(false)
  const [yard, setYard] = useState<YardData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gaugeMode, setGaugeMode] = useState(false)
  const [runningPlanId, setRunningPlanId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastSeq = useRef(0)
  const planTimers = useRef<number[]>([])

  // ------------------------------------------------------------ 初始化

  useEffect(() => {
    const saved = loadYardFromLocal()
    const data = saved ?? generateYard({ vehicleCount: 300 })
    const engine = new SimulationEngine(data)
    const store = new SimStore(engine)
    engineRef.current = engine
    storeRef.current = store
    setYard(data)

    const renderer = new YardRenderer(viewportRef.current!, engine, {
      onPick: (pick) => {
        engine.selectedVehicleId = pick?.vehicleId ?? null
        renderer.setFollow(engine.selectedVehicleId)
        setSelectedId(engine.selectedVehicleId)
        store.refreshNow()
      },
    })
    rendererRef.current = renderer
    store.attachRenderer(renderer)
    store.start()
    setReady(true)

    const onResize = () => viewportRef.current && renderer.resize(viewportRef.current)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      planTimers.current.forEach((t) => window.clearTimeout(t))
      store.stop()
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const snapshot = useSyncExternalStore(
    storeRef.current?.subscribe ?? (() => () => {}),
    storeRef.current?.getSnapshot ?? (() => EMPTY_SNAPSHOT),
  )

  const pushToast = useCallback((msg: string, error = false) => {
    const id = ++toastSeq.current
    setToasts((t) => [...t, { id, msg, error }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  // ------------------------------------------------------------ 操作

  const dispatch = useCallback(
    (vehicleId: string, targetTrackId: string, kind: ShuntingJob['kind']) => {
      const engine = engineRef.current!
      const order = engine.dispatchMove(vehicleId, targetTrackId, kind)
      if (order) pushToast(`已下达调车令：${vehicleId}`)
      else pushToast('无法下达调车令（车辆作业中或股道空间不足）', true)
      storeRef.current?.refreshNow()
    },
    [pushToast],
  )

  const runJob = useCallback(
    (job: ShuntingJob) => {
      const engine = engineRef.current!
      const order = engine.executeJob(job)
      if (!order) pushToast(`作业 ${job.id} 暂无法执行`, true)
      storeRef.current?.refreshNow()
    },
    [pushToast],
  )

  const runPlan = useCallback(
    (plan: ShuntingPlan) => {
      const engine = engineRef.current!
      setRunningPlanId(plan.id)
      savePlansToLocal([...(engine.yard.plans ?? [])])
      // 按钩依次下发，每钩间隔 2.5s 仿真排队
      plan.jobs.forEach((job, i) => {
        const timer = window.setTimeout(() => {
          engine.executeJob(job)
          storeRef.current?.refreshNow()
          if (i === plan.jobs.length - 1) setRunningPlanId(null)
        }, i * 2500)
        planTimers.current.push(timer)
      })
      pushToast(`计划「${plan.name}」开始执行，共 ${plan.jobs.length} 钩`)
    },
    [pushToast],
  )

  const toggleSwitch = useCallback(
    (switchId: string) => {
      const engine = engineRef.current!
      engine.toggleSwitch(switchId)
      storeRef.current?.refreshNow()
    },
    [],
  )

  const selectVehicle = useCallback((id: string) => {
    const engine = engineRef.current!
    engine.selectedVehicleId = id
    rendererRef.current?.setFollow(id)
    setSelectedId(id)
  }, [])

  // ------------------------------------------------------------ 存储

  const handleSave = () => {
    if (!yard) return
    saveYardToLocal(yard)
    savePlansToLocal(yard.plans)
    pushToast('站场与计划数据已保存到浏览器')
  }

  const handleExport = () => {
    if (!yard) return
    exportYardFile(yard)
    pushToast('站场文件已导出（可分享 .json）')
  }

  const handleImport = async (file: File) => {
    try {
      const data = await importYardFile(file)
      saveYardToLocal(data)
      window.location.reload()
    } catch (err) {
      pushToast(err instanceof Error ? err.message : '导入失败', true)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('marshalling-yard:yard:v1')
    window.location.reload()
  }

  const toggleRunning = () => {
    const engine = engineRef.current!
    engine.running = !engine.running
    storeRef.current?.refreshNow()
  }

  const setTimeScale = (scale: number) => {
    const engine = engineRef.current!
    engine.timeScale = scale
    storeRef.current?.refreshNow()
  }

  const regenerate = (count: number) => {
    const data = generateYard({ vehicleCount: count })
    saveYardToLocal(data)
    window.location.reload()
  }

  const plans = useMemo(() => yard?.plans ?? [], [yard])

  if (!ready || !yard || !engineRef.current || !rendererRef.current) {
    return <div style={{ padding: 40, color: 'var(--muted)' }}>正在初始化编组站仿真环境…</div>
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>🚂 编组站调车作业仿真器</h1>
        <span style={{ color: 'var(--muted)', fontSize: 11.5 }}>
          TypeScript + React + three.js
        </span>
        <div className="spacer" />
        <button onClick={toggleRunning}>{snapshot.running ? '⏸ 暂停' : '▶ 继续'}</button>
        <select
          style={{ width: 90 }}
          value={snapshot.timeScale}
          onChange={(e) => setTimeScale(Number(e.target.value))}
          title="仿真倍速"
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={4}>4×</option>
        </select>
        <button className="primary" onClick={handleSave}>💾 保存</button>
        <button onClick={handleExport}>📤 导出</button>
        <button onClick={() => fileInputRef.current?.click()}>📥 导入</button>
        <select
          style={{ width: 130 }}
          value=""
          onChange={(e) => e.target.value && regenerate(Number(e.target.value))}
          title="重新生成站场"
        >
          <option value="">重建场景…</option>
          <option value={100}>100 节车辆</option>
          <option value={200}>200 节车辆</option>
          <option value={300}>300 节车辆</option>
        </select>
        <button className="danger" onClick={handleReset}>重置</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleImport(f)
            e.target.value = ''
          }}
        />
      </header>

      <PlanPanel
        engine={engineRef.current}
        plans={plans}
        onRunPlan={runPlan}
        onRunJob={runJob}
        runningPlanId={runningPlanId}
      />

      <div ref={viewportRef} style={{ gridColumn: '2', gridRow: '2', position: 'relative' }}>
        <Viewport
          engine={engineRef.current}
          renderer={rendererRef.current}
          snapshot={snapshot}
          onSelectVehicle={setSelectedId}
          onDispatch={dispatch}
          onToggleGauge={setGaugeMode}
          gaugeMode={gaugeMode}
          onToast={pushToast}
        />
      </div>

      <RightPanel
        engine={engineRef.current}
        snapshot={snapshot}
        selectedId={selectedId}
        onSelect={selectVehicle}
        onSwitchToggle={toggleSwitch}
      />

      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.error ? 'error' : ''}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

const EMPTY_SNAPSHOT = {
  simTime: 0,
  running: true,
  timeScale: 1,
  fps: 0,
  drawCalls: 0,
  vehicleCount: 0,
  consistCount: 0,
  selectedVehicleId: null,
  events: [],
  vehicleRows: [],
  movingCount: 0,
  waitingCount: 0,
  lastRerouteMs: null,
  rerouteAffected: 0,
} as Snapshot
