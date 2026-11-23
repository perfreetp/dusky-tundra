// Pixi 画布:楼层平面绘制/编辑、个体渲染、密度热力图、脉冲圈、服务范围高亮
import { useEffect, useRef } from 'react'
import {
  Application, Container, Graphics, Sprite, Text, TextStyle, Texture,
  ParticleContainer, SCALE_MODES,
} from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import type { Plan, SimConfig, SimResult } from '../model/types'
import { uid, servesFloor } from '../model/types'
import { buildNavGrid, nearestTarget } from '../model/navgrid'

export type Tool = 'select' | 'floor' | 'waiting' | 'elevator' | 'stair' | 'source' | 'delete'

interface Props {
  plan: Plan
  tool: Tool
  simConfig: SimConfig
  result: SimResult | null
  prevResult: SimResult | null
  showCompare: boolean
  selectedId: string | null
  getTime: () => number
  onPlanChange: (p: Plan) => void
  onSelect: (id: string | null) => void
}

const RECT_TOOLS: Tool[] = ['floor', 'waiting', 'elevator', 'stair']
const HEAT_SCREEN_PX = 26 // 热力格目标屏幕像素

// 五档配色(透明度递增)
const BAND_COLORS: [number, number][] = [
  [0x2f81f7, 0.30],
  [0x2fbf71, 0.42],
  [0xf7d154, 0.55],
  [0xf78c2f, 0.65],
  [0xf73b2f, 0.75],
]

export default function PixiStage(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef(props)
  propsRef.current = props
  const R = useRef<{
    app: Application
    viewport: Viewport
    bgG: Graphics
    staticG: Graphics
    serviceSprite: Sprite
    heatSprite: Sprite
    pulseG: Graphics
    walkLayer: ParticleContainer
    queueLayer: ParticleContainer
    prevAgentLayer: ParticleContainer
    labelLayer: Container
    previewG: Graphics
    elevLabels: Map<string, { name: Text; queue: Text }>
    walkPool: Sprite[]
    queuePool: Sprite[]
    prevPool: Sprite[]
    walkTex: Texture
    queueTex: Texture
    prevTex: Texture
    heatCanvas: HTMLCanvasElement
    heatTex: Texture | null
    lastHeatKey: string
    pulsePoints: { x: number; y: number }[]
    drag: { x0: number; y0: number; x1: number; y1: number } | null
  } | null>(null)

  // ---------- 初始化(一次) ----------
  useEffect(() => {
    const host = hostRef.current!
    const app = new Application({
      background: 0xe9edf1,
      resizeTo: host,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })
    host.appendChild(app.view as HTMLCanvasElement)
    const viewport = new Viewport({
      screenWidth: host.clientWidth,
      screenHeight: host.clientHeight,
      worldWidth: 2000,
      worldHeight: 2000,
      events: app.renderer.events,
    })
    viewport.drag().pinch().wheel({ smooth: 5 }).decelerate()
    viewport.moveCenter(15, 8)
    viewport.setZoom(30, true) // 1m ≈ 30px 起步
    app.stage.addChild(viewport)

    const bgG = new Graphics()
    // 背景米网格
    for (let i = -100; i <= 100; i++) {
      const major = i % 5 === 0
      bgG.lineStyle(major ? 0.06 : 0.03, 0xc9d2da, major ? 0.9 : 0.6)
      bgG.moveTo(i, -100).lineTo(i, 100)
      bgG.moveTo(-100, i).lineTo(100, i)
    }
    viewport.addChild(bgG)

    const staticG = new Graphics()
    const serviceSprite = new Sprite()
    const heatCanvas = document.createElement('canvas')
    const heatTex = Texture.from(heatCanvas)
    heatTex.baseTexture.scaleMode = SCALE_MODES.LINEAR // 平滑采样,避免块状
    const heatSprite = new Sprite(heatTex)
    const pulseG = new Graphics()
    const prevAgentLayer = new ParticleContainer(10000, { position: true })
    const walkLayer = new ParticleContainer(10000, { position: true })
    const queueLayer = new ParticleContainer(10000, { position: true })
    const labelLayer = new Container()
    const previewG = new Graphics()
    viewport.addChild(staticG, serviceSprite, heatSprite, pulseG, prevAgentLayer, walkLayer, queueLayer, labelLayer, previewG)

    const mkDot = (color: number, r: number) => {
      const g = new Graphics()
      g.beginFill(color).drawCircle(10, 10, r).endFill()
      const tex = app.renderer.generateTexture(g)
      g.destroy()
      return tex
    }
    const walkTex = mkDot(0x1f3a5f, 8)
    const queueTex = mkDot(0xd97706, 8)
    const prevTex = mkDot(0x9aa5b1, 6)

    R.current = {
      app, viewport, bgG, staticG, serviceSprite, heatSprite, pulseG,
      walkLayer, queueLayer, prevAgentLayer, labelLayer, previewG,
      elevLabels: new Map(), walkPool: [], queuePool: [], prevPool: [],
      walkTex, queueTex, prevTex, heatCanvas, heatTex,
      lastHeatKey: '', pulsePoints: [], drag: null,
    }

    // ---------- 编辑交互 ----------
    const toWorld = (e: { global: { x: number; y: number } }) => viewport.toWorld(e.global.x, e.global.y)
    const snap = (v: number) => Math.round(v * 2) / 2

    viewport.on('pointerdown', (e) => {
      const p = propsRef.current
      if (!RECT_TOOLS.includes(p.tool)) return
      const w = toWorld(e)
      R.current!.drag = { x0: w.x, y0: w.y, x1: w.x, y1: w.y }
    })
    viewport.on('pointermove', (e) => {
      const st = R.current!
      if (!st.drag) return
      const w = toWorld(e)
      st.drag.x1 = w.x; st.drag.y1 = w.y
      const g = st.previewG
      g.clear()
      const x = Math.min(st.drag.x0, st.drag.x1), y = Math.min(st.drag.y0, st.drag.y1)
      const w2 = Math.abs(st.drag.x1 - st.drag.x0), h2 = Math.abs(st.drag.y1 - st.drag.y0)
      g.lineStyle(0.1, 0x2563eb, 1).beginFill(0x2563eb, 0.15).drawRect(x, y, w2, h2).endFill()
    })
    const finishDrag = () => {
      const st = R.current!
      if (!st.drag) return
      const p = propsRef.current
      const d = st.drag
      st.drag = null
      st.previewG.clear()
      const x = snap(Math.min(d.x0, d.x1)), y = snap(Math.min(d.y0, d.y1))
      const w = snap(Math.abs(d.x1 - d.x0)), h = snap(Math.abs(d.y1 - d.y0))
      if (w < 0.5 || h < 0.5) return
      const plan = p.plan
      const rect = { id: uid(), x, y, w, h }
      if (p.tool === 'floor') p.onPlanChange({ ...plan, floors: [...plan.floors, rect] })
      else if (p.tool === 'waiting') p.onPlanChange({ ...plan, waitingZones: [...plan.waitingZones, rect] })
      else if (p.tool === 'elevator') p.onPlanChange({ ...plan, elevators: [...plan.elevators, { ...rect, capacity: 13 }] })
      else if (p.tool === 'stair') p.onPlanChange({ ...plan, stairs: [...plan.stairs, rect] })
    }
    viewport.on('pointerup', finishDrag)
    viewport.on('pointerupoutside', finishDrag)

    const hitTest = (wx: number, wy: number): string | null => {
      const plan = propsRef.current.plan
      for (const s of plan.sources) if (Math.hypot(s.x - wx, s.y - wy) < 0.8) return s.id
      const inRect = (r: { x: number; y: number; w: number; h: number }) =>
        wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h
      for (let i = plan.elevators.length - 1; i >= 0; i--) if (inRect(plan.elevators[i])) return plan.elevators[i].id
      for (let i = plan.stairs.length - 1; i >= 0; i--) if (inRect(plan.stairs[i])) return plan.stairs[i].id
      for (let i = plan.waitingZones.length - 1; i >= 0; i--) if (inRect(plan.waitingZones[i])) return plan.waitingZones[i].id
      for (let i = plan.floors.length - 1; i >= 0; i--) if (inRect(plan.floors[i])) return plan.floors[i].id
      return null
    }
    viewport.on('clicked', (e: { world: { x: number; y: number } }) => {
      const p = propsRef.current
      const w = e.world
      if (p.tool === 'source') {
        const s = { id: uid(), x: snap(w.x), y: snap(w.y), rate: 0.5, total: 50 }
        p.onPlanChange({ ...p.plan, sources: [...p.plan.sources, s] })
        p.onSelect(s.id)
        return
      }
      const id = hitTest(w.x, w.y)
      if (p.tool === 'delete') {
        if (!id) return
        const plan = p.plan
        p.onPlanChange({
          floors: plan.floors.filter((r) => r.id !== id),
          waitingZones: plan.waitingZones.filter((r) => r.id !== id),
          elevators: plan.elevators.filter((r) => r.id !== id),
          stairs: plan.stairs.filter((r) => r.id !== id),
          sources: plan.sources.filter((r) => r.id !== id),
        })
        if (p.selectedId === id) p.onSelect(null)
      } else if (p.tool === 'select') {
        p.onSelect(id)
      }
    })
    viewport.on('zoomed-end', () => { R.current!.lastHeatKey = '' })

    // ---------- 每帧渲染 ----------
    app.ticker.add(() => {
      const st = R.current!
      const p = propsRef.current
      const t = p.getTime()
      const result = p.result
      // 个体
      updateAgents(st, result, t)
      updatePrevAgents(st, p.showCompare ? p.prevResult : null, Math.min(t, p.prevResult?.duration ?? 0))
      // 电梯标签
      if (result) {
        const idx = Math.min(result.snapshots.length - 1, Math.floor(t / result.snapDt))
        const snapObj = result.snapshots[idx]
        p.plan.elevators.forEach((e, i) => {
          const lab = st.elevLabels.get(e.id)
          if (!lab) return
          const es = snapObj.elevators[i]
          if (!es) return
          const phaseTxt = es.phase === 0 ? '停' : es.phase === 1 ? '行' : '不停'
          lab.name.text = `E${i + 1} ${phaseTxt} ${es.load}/${e.capacity}`
          lab.queue.text = es.queue > 0 ? `排队 ${es.queue}` : ''
        })
      }
      // 热力图(快照或缩放变化时重采样)
      updateHeat(st, p, t)
      // 脉冲圈动画
      const pg = st.pulseG
      pg.clear()
      const now = performance.now() / 1000
      for (let i = 0; i < st.pulsePoints.length; i++) {
        const pt = st.pulsePoints[i]
        const ph = (now * 1.6 + i * 0.37) % 1
        pg.lineStyle(0.08, 0xff2d2d, 1 - ph)
        pg.drawCircle(pt.x, pt.y, 0.4 + ph * 1.4)
      }
    })

    return () => {
      app.destroy(true, { children: true, texture: false })
      R.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- 工具切换:绘制类工具暂停平移 ----------
  useEffect(() => {
    const st = R.current
    if (!st) return
    if (RECT_TOOLS.includes(props.tool)) st.viewport.plugins.pause('drag')
    else st.viewport.plugins.resume('drag')
    st.viewport.cursor = props.tool === 'select' ? 'grab' : 'crosshair'
  }, [props.tool])

  // ---------- 静态平面重绘 ----------
  useEffect(() => {
    const st = R.current
    if (!st) return
    const g = st.staticG
    g.clear()
    st.labelLayer.removeChildren().forEach((c) => c.destroy())
    st.elevLabels.clear()
    const { plan, selectedId, simConfig } = props
    const sel = (id: string) => id === selectedId
    const nameStyle = new TextStyle({ fontSize: 14, fill: 0x1f2937, fontFamily: 'sans-serif' })
    const queueStyle = new TextStyle({ fontSize: 13, fill: 0xb45309, fontFamily: 'sans-serif' })

    for (const r of plan.floors) {
      g.lineStyle(sel(r.id) ? 0.15 : 0.08, sel(r.id) ? 0xfacc15 : 0x94a3b8, 1)
      g.beginFill(0xffffff, 0.95).drawRect(r.x, r.y, r.w, r.h).endFill()
    }
    for (const r of plan.waitingZones) {
      g.lineStyle(sel(r.id) ? 0.15 : 0.06, sel(r.id) ? 0xfacc15 : 0x3b82f6, 0.9)
      g.beginFill(0x3b82f6, 0.10).drawRect(r.x, r.y, r.w, r.h).endFill()
      const t = new Text('候梯区', new TextStyle({ fontSize: 12, fill: 0x3b82f6 }))
      t.scale.set(1 / 30)
      t.position.set(r.x + 0.2, r.y + 0.2)
      st.labelLayer.addChild(t)
    }
    plan.elevators.forEach((e, i) => {
      const served = servesFloor(i, plan.elevators.length, simConfig.currentFloor, simConfig)
      g.lineStyle(sel(e.id) ? 0.15 : 0.08, sel(e.id) ? 0xfacc15 : 0xb45309, 1)
      g.beginFill(served ? 0xf59e0b : 0xd6d3d1, 0.9).drawRect(e.x, e.y, e.w, e.h).endFill()
      const name = new Text(`E${i + 1}`, nameStyle.clone())
      name.scale.set(1 / 30)
      name.anchor.set(0.5, 1)
      name.position.set(e.x + e.w / 2, e.y - 0.1)
      const queue = new Text('', queueStyle.clone())
      queue.scale.set(1 / 30)
      queue.anchor.set(0.5, 0)
      queue.position.set(e.x + e.w / 2, e.y + e.h + 0.15)
      st.labelLayer.addChild(name, queue)
      st.elevLabels.set(e.id, { name, queue })
    })
    for (const r of plan.stairs) {
      g.lineStyle(sel(r.id) ? 0.15 : 0.08, sel(r.id) ? 0xfacc15 : 0x15803d, 1)
      g.beginFill(0x22c55e, 0.85).drawRect(r.x, r.y, r.w, r.h).endFill()
      const t = new Text('楼梯', new TextStyle({ fontSize: 13, fill: 0xffffff, fontWeight: 'bold' }))
      t.scale.set(1 / 30)
      t.anchor.set(0.5)
      t.position.set(r.x + r.w / 2, r.y + r.h / 2)
      st.labelLayer.addChild(t)
    }
    for (const s of plan.sources) {
      g.lineStyle(sel(s.id) ? 0.15 : 0.06, sel(s.id) ? 0xfacc15 : 0xb91c1c, 1)
      g.beginFill(0xef4444, 0.9).drawCircle(s.x, s.y, 0.45).endFill()
      const t = new Text(`${s.rate}/s × ${s.total}人`, new TextStyle({ fontSize: 12, fill: 0xb91c1c }))
      t.scale.set(1 / 30)
      t.anchor.set(0.5, 0)
      t.position.set(s.x, s.y + 0.6)
      st.labelLayer.addChild(t)
    }
    st.lastHeatKey = ''
  }, [props.plan, props.selectedId, props.simConfig])

  // ---------- 服务范围高亮 ----------
  useEffect(() => {
    const st = R.current
    if (!st) return
    st.serviceSprite.texture = Texture.EMPTY
    const { plan, simConfig, selectedId } = props
    const elevIdx = plan.elevators.findIndex((e) => e.id === selectedId)
    if (elevIdx < 0) return
    const served = plan.elevators.map((_, i) => servesFloor(i, plan.elevators.length, simConfig.currentFloor, simConfig))
    const grid = buildNavGrid(plan, served)
    if (!grid) return
    const targetIdx = grid.targets.findIndex((t) => t.kind === 'elevator' && t.elevIndex === elevIdx)
    if (targetIdx < 0) return
    const cv = document.createElement('canvas')
    cv.width = grid.cols; cv.height = grid.rows
    const ctx = cv.getContext('2d')!
    const img = ctx.createImageData(grid.cols, grid.rows)
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        if (nearestTarget(grid, c, r) !== targetIdx) continue
        const o = (r * grid.cols + c) * 4
        img.data[o] = 59; img.data[o + 1] = 130; img.data[o + 2] = 246; img.data[o + 3] = 70
      }
    }
    ctx.putImageData(img, 0, 0)
    const tex = Texture.from(cv)
    tex.baseTexture.scaleMode = SCALE_MODES.NEAREST
    st.serviceSprite.texture = tex
    st.serviceSprite.position.set(grid.ox, grid.oy)
    st.serviceSprite.width = grid.cols * grid.cell
    st.serviceSprite.height = grid.rows * grid.cell
  }, [props.selectedId, props.plan, props.simConfig])

  // 结果变化 → 强制热力重算
  useEffect(() => {
    const st = R.current
    if (st) st.lastHeatKey = ''
  }, [props.result, props.simConfig.densityThreshold])

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />
}

// ---------- 个体渲染 ----------
// ParticleContainer 不能混用不同纹理,行走/排队/旧结果各用一层
function syncPool(pool: Sprite[], layer: ParticleContainer, tex: Texture, scale: number, need: number) {
  while (pool.length < need) {
    const s = new Sprite(tex)
    s.anchor.set(0.5)
    s.scale.set(scale)
    pool.push(s)
    layer.addChild(s)
  }
  while (pool.length > need) {
    const s = pool.pop()!
    layer.removeChild(s)
    s.destroy()
  }
}

function snapIndex(result: SimResult, t: number): number {
  return Math.min(result.snapshots.length - 1, Math.max(0, Math.floor(t / result.snapDt)))
}

function updateAgents(st: any, result: SimResult | null, t: number) {
  if (!result) {
    syncPool(st.walkPool, st.walkLayer, st.walkTex, 0.045, 0)
    syncPool(st.queuePool, st.queueLayer, st.queueTex, 0.045, 0)
    return
  }
  const arr = result.snapshots[snapIndex(result, t)].agents
  const n = arr.length / 4
  let nWalk = 0, nQueue = 0
  for (let i = 0; i < n; i++) {
    if (arr[i * 4 + 3] === 1) nQueue++; else nWalk++
  }
  syncPool(st.walkPool, st.walkLayer, st.walkTex, 0.045, nWalk)
  syncPool(st.queuePool, st.queueLayer, st.queueTex, 0.045, nQueue)
  let iw = 0, iq = 0
  for (let i = 0; i < n; i++) {
    const x = arr[i * 4 + 1], y = arr[i * 4 + 2]
    if (arr[i * 4 + 3] === 1) st.queuePool[iq++].position.set(x, y)
    else st.walkPool[iw++].position.set(x, y)
  }
}

function updatePrevAgents(st: any, result: SimResult | null, t: number) {
  if (!result) {
    syncPool(st.prevPool, st.prevAgentLayer, st.prevTex, 0.035, 0)
    return
  }
  const arr = result.snapshots[snapIndex(result, t)].agents
  const n = arr.length / 4
  syncPool(st.prevPool, st.prevAgentLayer, st.prevTex, 0.035, n)
  for (let i = 0; i < n; i++) {
    st.prevPool[i].position.set(arr[i * 4 + 1], arr[i * 4 + 2])
  }
}

// ---------- 热力图 ----------
function updateHeat(st: any, p: {
  result: SimResult | null
  plan: Plan
  simConfig: SimConfig
}, t: number) {
  const { result, plan, simConfig } = p
  if (!result || plan.floors.length === 0) {
    if (st.heatSprite.visible) { st.heatSprite.visible = false; st.pulsePoints = [] }
    return
  }
  const scale = st.viewport.scale.x || 1
  const cellWorld = Math.min(2, Math.max(0.25, HEAT_SCREEN_PX / scale))
  const idx = Math.min(result.snapshots.length - 1, Math.max(0, Math.floor(t / result.snapDt)))
  const key = `${idx}|${cellWorld.toFixed(3)}|${simConfig.densityThreshold}`
  if (key === st.lastHeatKey) return
  st.lastHeatKey = key
  st.heatSprite.visible = true

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const r of plan.floors) {
    minX = Math.min(minX, r.x); minY = Math.min(minY, r.y)
    maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h)
  }
  minX -= 1; minY -= 1; maxX += 1; maxY += 1
  const cols = Math.max(1, Math.ceil((maxX - minX) / cellWorld))
  const rows = Math.max(1, Math.ceil((maxY - minY) / cellWorld))
  const counts = new Float32Array(cols * rows)
  const agents = result.snapshots[idx].agents
  for (let i = 0; i < agents.length / 4; i++) {
    const c = Math.floor((agents[i * 4 + 1] - minX) / cellWorld)
    const r = Math.floor((agents[i * 4 + 2] - minY) / cellWorld)
    if (c >= 0 && r >= 0 && c < cols && r < rows) counts[r * cols + c]++
  }
  // 3x3 平滑
  const smooth = new Float32Array(cols * rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0, n = 0
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nc = c + dc, nr = r + dr
        if (nc >= 0 && nr >= 0 && nc < cols && nr < rows) { sum += counts[nr * cols + nc]; n++ }
      }
      smooth[r * cols + c] = sum / n
    }
  }
  const cellArea = cellWorld * cellWorld
  const T = simConfig.densityThreshold
  const cv = st.heatCanvas
  if (cv.width !== cols || cv.height !== rows) { cv.width = cols; cv.height = rows }
  const ctx = cv.getContext('2d')!
  const img = ctx.createImageData(cols, rows)
  const pulses: { x: number; y: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dens = smooth[r * cols + c] / cellArea
      const o = (r * cols + c) * 4
      if (dens <= 0.05) continue
      let band = 0
      if (dens > T * 0.75) band = 3
      else if (dens > T * 0.5) band = 2
      else if (dens > T * 0.25) band = 1
      if (dens > T) band = 4
      const [color, alpha] = BAND_COLORS[band]
      img.data[o] = (color >> 16) & 255
      img.data[o + 1] = (color >> 8) & 255
      img.data[o + 2] = color & 255
      img.data[o + 3] = Math.round(alpha * 255)
      if (dens > T && pulses.length < 300) {
        pulses.push({ x: minX + (c + 0.5) * cellWorld, y: minY + (r + 0.5) * cellWorld })
      }
    }
  }
  ctx.putImageData(img, 0, 0)
  st.heatTex.update()
  st.heatSprite.position.set(minX, minY)
  st.heatSprite.width = cols * cellWorld
  st.heatSprite.height = rows * cellWorld
  st.pulsePoints = pulses
}
