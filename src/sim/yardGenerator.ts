import type {
  EdgeLocation,
  GaugeProfile,
  GraphEdge,
  GraphNode,
  ShuntingPlan,
  SwitchDef,
  TrackDef,
  Vec2,
  VehicleStatic,
  YardData,
} from '../types'
import { densify, polylineLength } from './geometry'

export interface GeneratorOptions {
  /** 在场车辆总数（默认 300） */
  vehicleCount?: number
  /** 分类线条数 */
  classificationTracks?: number
}

const TRACK_SPACING = 6.5
const BOWL_X_WEST = 120
const BOWL_X_EAST = 540
const LADDER_X_START = -260
const LADDER_DX = 32
const LEAD_X_WEST = -480

/** 标准轨距铁路建筑限界（单侧半宽，按高度采样，单位米） */
export const STANDARD_GAUGE: GaugeProfile = {
  halfWidths: [
    { y: 0.0, w: 1.8 },
    { y: 0.35, w: 2.0 },
    { y: 1.25, w: 2.44 },
    { y: 3.1, w: 2.44 },
    { y: 4.0, w: 2.0 },
    { y: 4.8, w: 0.9 },
  ],
  maxHeight: 5.5,
}

interface VehicleTemplate {
  type: string
  length: number
  width: number
  height: number
  outline: { x: number; y: number }[]
  color: number
  tare: number
}

const VEHICLE_TEMPLATES: VehicleTemplate[] = [
  {
    type: 'C70敞车',
    length: 13.98,
    width: 3.2,
    height: 3.4,
    outline: [
      { x: 1.6, y: 0 },
      { x: 1.6, y: 2.0 },
      { x: 1.45, y: 2.3 },
      { x: 0, y: 2.3 },
    ],
    color: 0x8a5a2b,
    tare: 23.6,
  },
  {
    type: 'P70棚车',
    length: 17.08,
    width: 3.3,
    height: 4.7,
    outline: [
      { x: 1.65, y: 0 },
      { x: 1.65, y: 3.9 },
      { x: 1.5, y: 4.2 },
      { x: 0, y: 4.2 },
    ],
    color: 0x7a4a8a,
    tare: 27.8,
  },
  {
    type: 'NX70平车',
    length: 15.4,
    width: 3.0,
    height: 1.2,
    outline: [
      { x: 1.5, y: 0 },
      { x: 1.5, y: 0.9 },
      { x: 0, y: 0.9 },
    ],
    color: 0x556b7a,
    tare: 23.8,
  },
  {
    type: 'G70罐车',
    length: 12.3,
    width: 3.0,
    height: 4.1,
    outline: [
      { x: 1.5, y: 0 },
      { x: 1.5, y: 1.6 },
      { x: 1.35, y: 2.6 },
      { x: 0.8, y: 3.1 },
      { x: 0, y: 3.1 },
    ],
    color: 0x9aa3ad,
    tare: 20.4,
  },
  {
    type: 'JSQ汽车车',
    length: 26.7,
    width: 3.3,
    height: 4.7,
    outline: [
      { x: 1.65, y: 0 },
      { x: 1.65, y: 4.0 },
      { x: 1.4, y: 4.3 },
      { x: 0, y: 4.3 },
    ],
    color: 0x3f7a5d,
    tare: 38.0,
  },
]

function makeEdge(
  id: string,
  trackId: string,
  n1: string,
  n2: string,
  polyline: Vec2[],
  radius = Infinity,
): GraphEdge {
  const dense = densify(polyline, 4)
  return {
    id,
    trackId,
    n1,
    n2,
    polyline: dense,
    length: polylineLength(dense),
    radius,
  }
}

/** 伪随机（可复现） */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296

  }
}

export function generateYard(opts: GeneratorOptions = {}): YardData {
  const classCount = opts.classificationTracks ?? 12
  const departureCount = 2
  const bowlCount = classCount + departureCount
  const vehicleCount = opts.vehicleCount ?? 300
  const rand = mulberry32(20261124)

  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const switches: SwitchDef[] = []
  const tracks: TrackDef[] = []
  const node = (id: string, x: number, z: number): string => {
    nodes.push({ id, pos: { x, z } })
    return id
  }

  // ---------- 牵出线（南侧） ----------
  const leadZ = -(bowlCount * TRACK_SPACING) / 2
  const nLeadWest = node('N_LEAD_W', LEAD_X_WEST, leadZ)
  const nJunction = node('N_JP', LADDER_X_START - 30, leadZ)
  const leadEdgeId = 'EDGE_LEAD'
  edges.push(
    makeEdge(leadEdgeId, 'TR_LEAD', nLeadWest, nJunction, [
      { x: LEAD_X_WEST, z: leadZ },
      { x: LADDER_X_START - 20, z: leadZ },
    ]),
  )
  tracks.push({
    id: 'TR_LEAD',
    name: '牵出线',
    kind: 'lead',
    edgeIds: [leadEdgeId],
    color: 0x8899aa,
  })

  // ---------- 梯线道岔群 + 分类线/出发线 ----------
  const ladderEdgeIds: string[] = []
  for (let i = 0; i < bowlCount; i++) {
    const z = leadZ + i * TRACK_SPACING
    const rx = LADDER_X_START + i * LADDER_DX
    const rootId = node(`N_SW${i}`, rx, z)
    const westId = node(`N_T${i}_W`, BOWL_X_WEST, z)
    const eastId = node(`N_T${i}_E`, BOWL_X_EAST, z)

    // 道岔侧线 -> 股道西端
    const branchEdgeId = `EDGE_SW${i}_BRANCH`
    edges.push(
      makeEdge(branchEdgeId, `TR_BOWL_${i}`, rootId, westId, [
        { x: rx, z },
        { x: BOWL_X_WEST, z },
      ]),
    )
    // 股道正线
    const trackEdgeId = `EDGE_T${i}`
    edges.push(
      makeEdge(trackEdgeId, `TR_BOWL_${i}`, westId, eastId, [
        { x: BOWL_X_WEST, z },
        { x: BOWL_X_EAST, z },
      ]),
    )

    const isDeparture = i >= classCount
    tracks.push({
      id: `TR_BOWL_${i}`,
      name: isDeparture ? `出发线 ${i - classCount + 1}` : `分类线 ${String(i + 1).padStart(2, '0')}`,
      kind: isDeparture ? 'departure' : 'classification',
      edgeIds: [branchEdgeId, trackEdgeId],
      color: isDeparture ? 0x4fa8d8 : 0x6fcf97,
    })

    if (i < bowlCount - 1) {
      // 道岔直向 -> 下一梯线节点
      const nextZ = leadZ + (i + 1) * TRACK_SPACING
      const nextRx = LADDER_X_START + (i + 1) * LADDER_DX
      const ladderEdgeId = `EDGE_LADDER_${i}`
      edges.push(
        makeEdge(ladderEdgeId, 'TR_LADDER', rootId, `N_SW${i + 1}`, [
          { x: rx, z },
          { x: nextRx, z: nextZ },
        ]),
      )
      ladderEdgeIds.push(ladderEdgeId)
      switches.push({
        id: `SW_${i}`,
        root: rootId,
        a: westId, // 0 = 侧线进股道
        b: `N_SW${i + 1}`, // 1 = 直向沿梯线
        state: 1,
      })
    } else {
      // 末个道岔：直向也接入本股道
      switches.push({
        id: `SW_${i}`,
        root: rootId,
        a: westId,
        b: westId, // 末端无续行节点，两位置同向
        state: 0,
      })
    }
  }
  //  JP -> 首个梯线节点
  edges.push(
    makeEdge('EDGE_JP_SW0', 'TR_LADDER', nJunction, 'N_SW0', [
      nodes.find((n) => n.id === nJunction)!.pos,
      nodes.find((n) => n.id === 'N_SW0')!.pos,
    ]),
  )
  tracks.push({
    id: 'TR_LADDER',
    name: '梯线',
    kind: 'ladder',
    edgeIds: ['EDGE_JP_SW0', ...ladderEdgeIds],
    color: 0xb0b7c0,
  })

  // ---------- 到达场（3 条，南侧） ----------
  const rcvCount = 3
  const rcvEdgeIds: string[] = []
  for (let k = 0; k < rcvCount; k++) {
    const rz = leadZ - 14 - k * 7
    const rEast = node(`N_RCV${k}_E`, -120, rz)
    const rWest = node(`N_RCV${k}_W`, LEAD_X_WEST, rz)
    const edgeId = `EDGE_RCV${k}`
    edges.push(
      makeEdge(edgeId, `TR_RCV_${k}`, rWest, rEast, [
        { x: LEAD_X_WEST, z: rz },
        { x: -80, z: rz },
      ]),
    )
    rcvEdgeIds.push(edgeId)
    tracks.push({
      id: `TR_RCV_${k}`,
      name: `到达线 ${k + 1}`,
      kind: 'receiving',
      edgeIds: [edgeId],
      color: 0xe0b341,
    })
  }
  // 到达场小梯线：SR_k 横连到达线东端，末个道岔接 JP
  for (let k = 0; k < rcvCount; k++) {
    const rz = leadZ - 14 - k * 7
    const sx = -300 + k * 28
    const srId = node(`N_RSW${k}`, sx, rz)
    const rEastId = `N_RCV${k}_E`
    const branchId = `EDGE_RSW${k}_BRANCH`
    edges.push(
      makeEdge(branchId, 'TR_RCV_LADDER', srId, rEastId, [
        { x: sx, z: rz },
        { x: -120, z: rz },
      ]),
    )
    if (k < rcvCount - 1) {
      const nextZ = leadZ - 14 - (k + 1) * 7
      const nextSx = -180 + (k + 1) * 16
      const diagId = `EDGE_RSW${k}_NEXT`
      edges.push(
        makeEdge(diagId, 'TR_RCV_LADDER', srId, `N_RSW${k + 1}`, [
          { x: sx, z: rz },
          { x: nextSx, z: nextZ },
        ]),
      )
      switches.push({
        id: `RSW_${k}`,
        root: srId,
        a: rEastId,
        b: `N_RSW${k + 1}`,
        state: 1, // 默认直向保持梯线贯通；进路需要时自动扳到侧线
      })
    } else {
      const diagId = `EDGE_RSW_LAST_JP`
      edges.push(
        makeEdge(diagId, 'TR_RCV_LADDER', srId, nJunction, [
          { x: sx, z: rz },
          nodes.find((n) => n.id === nJunction)!.pos,
        ]),
      )
      switches.push({ id: `RSW_${k}`, root: srId, a: rEastId, b: nJunction, state: 1 })
    }
  }
  tracks.push({
    id: 'TR_RCV_LADDER',
    name: '到达场梯线',
    kind: 'ladder',
    edgeIds: rcvEdgeIds.length ? edges.filter((e) => e.trackId === 'TR_RCV_LADDER').map((e) => e.id) : [],
    color: 0xb0b7c0,
  })

  // ---------- 车辆 ----------
  const vehicles: VehicleStatic[] = []
  const initialPlacement: Record<string, EdgeLocation> = {}
  const placementGroups: { trackEdgeId: string; vehicles: VehicleStatic[] }[] = []

  const makeVehicle = (index: number): VehicleStatic => {
    const tpl = VEHICLE_TEMPLATES[Math.floor(rand() * VEHICLE_TEMPLATES.length)]
    const oversize = rand() < 0.07
    const width = oversize ? tpl.width + 2.0 : tpl.width
    const height = oversize ? tpl.height + 0.9 : tpl.height
    const outline = tpl.outline.map((p) => ({
      x: oversize ? p.x + 1.0 : p.x,
      y: oversize ? Math.min(p.y + 0.9, height) : p.y,
    }))
    return {
      id: `V${String(index + 1).padStart(4, '0')}`,
      type: oversize ? `${tpl.type}(超限)` : tpl.type,
      length: tpl.length,
      width,
      height,
      outline,
      outOfGauge: oversize,
      color: oversize ? 0xc0392b : tpl.color,
      tare: tpl.tare,
    }
  }

  let vIndex = 0
  // 到达线 0 上放置待解体车列（容量按边长裁剪），其余车辆均匀分布到分类线
  const rcvEdge0 = edges.find((e) => e.id === 'EDGE_RCV0')!
  const rcvCapacity = Math.max(8, Math.floor((rcvEdge0.length - 20) / 16))
  const rcvPlaced = Math.min(40, rcvCapacity, vehicleCount)
  const rcvGroup: VehicleStatic[] = []
  for (let i = 0; i < rcvPlaced; i++, vIndex++) {
    const veh = makeVehicle(vIndex)
    vehicles.push(veh)
    rcvGroup.push(veh)
  }
  placementGroups.push({ trackEdgeId: 'EDGE_RCV0', vehicles: rcvGroup })

  const remaining = vehicleCount - vIndex
  const perTrack = Math.ceil(remaining / classCount)
  for (let t = 0; t < classCount && vIndex < vehicleCount; t++) {
    const group: VehicleStatic[] = []
    const n = Math.min(perTrack, vehicleCount - vIndex)
    for (let i = 0; i < n; i++, vIndex++) {
      const veh = makeVehicle(vIndex)
      vehicles.push(veh)
      group.push(veh)
    }
    placementGroups.push({ trackEdgeId: `EDGE_T${t}`, vehicles: group })
  }

  // 车列首车前端距东端挡车器 5m，依次向西排列（车间 0.2m 车钩余量）
  const GAP = 0.2
  // 全部可停放正边：到达线 + 分类线 + 出发线（按容量均匀分配，保证全部车辆就位）
  const parkEdges = [
    ...[0, 1, 2].map((k) => edges.find((e) => e.id === `EDGE_RCV${k}`)!),
    ...tracks
      .filter((t) => t.kind === 'classification' || t.kind === 'departure')
      .map((t) => edges.find((e) => e.id === t.edgeIds[t.edgeIds.length - 1])!),
  ]
  const edgeCursor = new Map<string, number>(parkEdges.map((e) => [e.id, e.length - 5]))
  const placeOne = (veh: VehicleStatic, edgeId: string): boolean => {
    const cursor = edgeCursor.get(edgeId)!
    const centerOffset = cursor - veh.length / 2
    if (centerOffset < veh.length / 2 + 2) return false
    initialPlacement[veh.id] = { edgeId, offset: centerOffset }
    edgeCursor.set(edgeId, centerOffset - veh.length / 2 - GAP)
    return true
  }

  // 先按作业分组放置（到达线解体车列、分类线集结）
  for (const group of placementGroups) {
    for (let i = group.vehicles.length - 1; i >= 0; i--) {
      const veh = group.vehicles[i]
      if (!placeOne(veh, group.trackEdgeId)) {
        // 本组边满：轮换到余量最大的停放边
        const target = parkEdges
          .map((e) => ({ id: e.id, free: edgeCursor.get(e.id)! }))
          .sort((a, b) => b.free - a.free)[0]
        placeOne(veh, target.id)
      }
    }
  }
  // 兜底：任何未分配车辆
  for (const veh of vehicles) {
    if (initialPlacement[veh.id]) continue
    const target = parkEdges
      .map((e) => ({ id: e.id, free: edgeCursor.get(e.id)! }))
      .sort((a, b) => b.free - a.free)[0]
    placeOne(veh, target.id)
  }

  // ---------- 调车计划 ----------
  const plans: ShuntingPlan[] = []
  const rcvVehicles = rcvGroup
  const classTracks = tracks.filter((t) => t.kind === 'classification').map((t) => t.id)
  const depTracks = tracks.filter((t) => t.kind === 'departure').map((t) => t.id)

  // 计划 1：到达线解体，溜放到各分类线
  const cutJobs = rcvVehicles.slice(0, 24).map((veh, i) => ({
    id: `J1_${i}`,
    vehicleId: veh.id,
    fromTrackId: 'TR_RCV_0',
    toTrackId: classTracks[i % classTracks.length],
    note: `解体溜放 第 ${i + 1} 钩`,
    kind: 'uncouple' as const,
  }))
  plans.push({
    id: 'PLAN_BREAK',
    name: '到达列车解体作业',
    description: '将到达线 1 上的车列按去向分解溜放至各分类线',
    jobs: cutJobs,
  })

  // 计划 2：分类线编组挂运至出发线
  const bowlVeh = vehicles.filter((v) => !rcvVehicles.includes(v))
  const makeJobs = bowlVeh.slice(0, 18).map((veh, i) => ({
    id: `J2_${i}`,
    vehicleId: veh.id,
    fromTrackId: classTracks[i % classTracks.length],
    toTrackId: depTracks[i % depTracks.length],
    note: `编组挂运 第 ${i + 1} 钩`,
    kind: 'couple' as const,
  }))
  plans.push({
    id: 'PLAN_MAKE',
    name: '出发列车编组作业',
    description: '从各分类线连挂取车，编组后转往出发线',
    jobs: makeJobs,
  })

  // 计划 3：分类线间换位整理
  const sortJobs = bowlVeh.slice(18, 36).map((veh, i) => ({
    id: `J3_${i}`,
    vehicleId: veh.id,
    fromTrackId: classTracks[(i + 2) % classTracks.length],
    toTrackId: classTracks[(i + 5) % classTracks.length],
    note: `股道整理 第 ${i + 1} 钩`,
    kind: 'transfer' as const,
  }))
  plans.push({
    id: 'PLAN_SORT',
    name: '调车场股道整理',
    description: '分类线之间车辆换位，按到站重新集结',
    jobs: sortJobs,
  })

  // 计划 4：超限车专列取送
  const oversizeVehs = vehicles.filter((v) => v.outOfGauge).slice(0, 10)
  if (oversizeVehs.length > 0) {
    plans.push({
      id: 'PLAN_OVERSIZE',
      name: '超限货物车辆取送',
      description: '超限车辆经由指定线路送往出发线 2，作业前请进行限界检查',
      jobs: oversizeVehs.map((veh, i) => ({
        id: `J4_${i}`,
        vehicleId: veh.id,
        fromTrackId: 'TR_RCV_0',
        toTrackId: depTracks[depTracks.length - 1],
        note: `超限车取送 第 ${i + 1} 钩`,
        kind: 'transfer' as const,
      })),
    })
  }

  return {
    version: 1,
    nodes,
    switches,
    edges,
    tracks,
    gauge: STANDARD_GAUGE,
    vehicles,
    initialPlacement,
    plans,
  }
}
