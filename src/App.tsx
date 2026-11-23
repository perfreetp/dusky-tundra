import { useCallback, useEffect, useRef, useState } from 'react'
import PixiStage, { type Tool } from './components/PixiStage'
import Toolbar from './components/Toolbar'
import RightPanel from './components/RightPanel'
import Timeline from './components/Timeline'
import { emptyPlan, defaultConfig, type Plan, type SimConfig, type SimResult } from './model/types'
import { demoPlan } from './model/demo'
import { runSimulation } from './sim/engine'
import { exportFile, parseImport } from './utils/export'

export default function App() {
  const [plan, setPlan] = useState<Plan>(emptyPlan)
  const [simConfig, setSimConfig] = useState<SimConfig>(defaultConfig)
  const [tool, setTool] = useState<Tool>('select')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [result, setResult] = useState<SimResult | null>(null)
  const [prevResult, setPrevResult] = useState<SimResult | null>(null)
  const [computing, setComputing] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const timeRef = useRef(0)
  const resultRef = useRef<SimResult | null>(null)
  resultRef.current = result

  const setTimeBoth = useCallback((t: number) => {
    timeRef.current = t
    setTime(t)
  }, [])

  // ---------- 平面/配置变化 → 整段重算(旧结果保留可对比) ----------
  useEffect(() => {
    const canRun =
      plan.floors.length > 0 &&
      plan.sources.length > 0 &&
      plan.elevators.length + plan.stairs.length > 0
    if (!canRun) {
      setComputing(false)
      setResult(null)
      return
    }
    setComputing(true)
    const timer = setTimeout(() => {
      // 让出一帧渲染"重算中"提示,再同步执行推演
      setTimeout(() => {
        const r = runSimulation(plan, simConfig)
        setPrevResult(resultRef.current)
        setResult(r)
        setComputing(false)
        setTimeBoth(0)
        setPlaying(false)
      }, 30)
    }, 350)
    return () => clearTimeout(timer)
  }, [plan, simConfig, setTimeBoth])

  // ---------- 播放循环 ----------
  const duration = result?.duration ?? 0
  useEffect(() => {
    if (!playing || duration <= 0) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = ((now - last) / 1000) * speed
      last = now
      const nt = timeRef.current + dt
      if (nt >= duration) {
        setTimeBoth(duration)
        setPlaying(false)
        return
      }
      setTimeBoth(nt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, duration, speed, setTimeBoth])

  const onImport = useCallback(async (file: File) => {
    try {
      const { plan: p2, config, result: r2 } = parseImport(await file.text())
      setPlan(p2)
      setSimConfig(config)
      setPrevResult(null)
      setResult(r2)
      setSelectedId(null)
      setTimeBoth(0)
    } catch (err) {
      alert(`导入失败:${err instanceof Error ? err.message : String(err)}`)
    }
  }, [setTimeBoth])

  return (
    <div className="app">
      <header>
        <h1>候梯厅客流疏散推演</h1>
        <span className="status">
          {computing ? '配置已变更,重算中…' : result ? '就绪(拖动时间轴回看)' : '请先铺设平面、放置电梯/楼梯与客流源'}
        </span>
      </header>
      <div className="main">
        <Toolbar
          tool={tool}
          onTool={setTool}
          onDemo={() => { setPlan(demoPlan()); setTool('select') }}
          onClear={() => { setPlan(emptyPlan()); setResult(null); setPrevResult(null); setSelectedId(null) }}
          onExport={() => exportFile(plan, simConfig, result)}
          onImport={onImport}
          computing={computing}
          hasPrev={prevResult !== null}
          showCompare={showCompare}
          onToggleCompare={() => setShowCompare((v) => !v)}
        />
        <div className="stage-wrap">
          <PixiStage
            plan={plan}
            tool={tool}
            simConfig={simConfig}
            result={result}
            prevResult={prevResult}
            showCompare={showCompare}
            selectedId={selectedId}
            getTime={() => timeRef.current}
            onPlanChange={setPlan}
            onSelect={setSelectedId}
          />
        </div>
        <RightPanel
          plan={plan}
          simConfig={simConfig}
          result={result}
          prevResult={prevResult}
          showCompare={showCompare}
          selectedId={selectedId}
          time={time}
          onPlanChange={setPlan}
          onConfigChange={setSimConfig}
          onSelect={setSelectedId}
        />
      </div>
      <Timeline
        time={time}
        duration={duration}
        playing={playing}
        speed={speed}
        onTime={setTimeBoth}
        onPlayPause={() => {
          if (!playing && timeRef.current >= duration) setTimeBoth(0)
          setPlaying((v) => !v)
        }}
        onSpeed={setSpeed}
      />
    </div>
  )
}
