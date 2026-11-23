/**
 * 绳姿态求解总管线（五阶段）：
 *   A 绳长/对重（floorModel 已在 FloorState 中给出）
 *   B 站点展开 + 轮缘包角解析贴合（stationExpander / wrapArc）
 *   C 自由段节点采样（freeSpanSpline）
 *   D 摆幅在渲染层逐帧叠加（swingModel，不进本管线）
 *   E 净空表 + BVH 碰撞迭代修正（clearanceTable / collisionProject）
 * 输出写入调用方提供的 RopePose（池化），函数本身零分配返回。
 */
import type {
  ColliderProvider,
  FloorState,
  RopeDefinition,
  RopePose,
  SceneConfig,
  SolveOptions,
} from '../model/types';
import { LOD_SPECS } from '../perf/budgets';
import { perfProbe } from '../perf/perfProbe';
import { expandStations } from './stationExpander';
import { sampleArc, arcLength, type PathSegment } from './wrapArc';
import { sampleSpan, spanNodeCount } from './freeSpanSpline';
import { computeClearanceTable } from './clearanceTable';
import { solveCollisions } from './collisionProject';
import { computePoseTension } from '../model/tensionModel';
import { tensionSheaveClosureY } from '../model/floorModel';

/** 限速器环路几何常量（与默认场景配置保持一致） */
const GOVERNOR_FIXED_DROP = -2.0;

export interface SolveResult {
  nodeCount: number;
  totalLength: number;
  collisionQueries: number;
}

/** 计算限速器张紧轮闭合 Y（曳引绳场景返回 0） */
export function resolveTensionSheaveY(
  def: RopeDefinition,
  scene: SceneConfig,
  floor: FloorState,
  loopLength: number,
): number {
  if (def.kind !== 'governor') return 0;
  const gov = scene.sheaves.find((s) => s.kind === 'governor');
  if (!gov) return 0;
  return tensionSheaveClosureY(
    loopLength,
    gov.center[1],
    floor.carY,
    GOVERNOR_FIXED_DROP,
  );
}

/**
 * 求解单根绳的基准姿态。
 * @param loopLength 限速器环路总长（曳引绳传 0）
 * @param ropeCount 同组绳数（张力均摊用）
 */
export function solveRopePose(
  def: RopeDefinition,
  scene: SceneConfig,
  floor: FloorState,
  options: SolveOptions,
  colliders: ColliderProvider,
  output: RopePose,
  loopLength = 0,
  ropeCount = 1,
): SolveResult {
  perfProbe.mark(`solve.${def.id}`);
  const lod = LOD_SPECS[options.lod];
  const tensionSheaveY = resolveTensionSheaveY(def, scene, floor, loopLength);

  // 阶段 B：站点展开（解析切线 + 包角）
  const segments = expandStations(def.stations, scene, floor, tensionSheaveY);

  // 预估节点预算：按段长度比例分配 LOD 目标节点
  let totalLen = 0;
  for (const seg of segments) {
    totalLen += seg.kind === 'arc' ? arcLength(seg) : v3dist(seg.from, seg.to);
  }

  let write = 0;
  let flagOffset = 0;
  // 池化数组含脏数据：先清零标志位（positions/spanIds 会被全量覆写）
  output.arcFlags.fill(0);
  output.spanIds.fill(0xffff);
  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si]!;
    if (seg.kind === 'arc') {
      const k = sampleArc(
        seg,
        lod.arcSamples,
        output.positions,
        write,
        output.arcFlags,
        flagOffset,
      );
      for (let j = 0; j < k; j++) output.spanIds[flagOffset + j] = 0xffff;
      write += k;
      flagOffset += k;
    } else {
      const len = v3dist(seg.from, seg.to);
      // 限速器闭合绳环跨度大，采用更稀疏的间距控制总节点数
      const spacing = def.kind === 'governor' ? lod.spanSpacing * 1.6 : lod.spanSpacing;
      const count = spanNodeCount(len, spacing, 3, 60);
      const k = sampleSpan(
        seg,
        count,
        def.kind === 'governor' ? 0.0008 : 0.002,
        output.positions,
        write,
        output.spanIds,
        flagOffset,
      );
      write += k;
      flagOffset += k;
    }
  }

  output.nodeCount = write;
  output.version++;

  // 切线（中心差分，弧段端点同样适用）
  computeTangents(output);

  // 阶段 E：净空表 + 碰撞迭代（弧段锁定）
  computeClearanceTable(output, colliders);
  const coll = solveCollisions(
    output,
    colliders,
    def.radius,
    options.collisionMargin,
    options.collisionIterations,
  );
  // 碰撞修正后切线重算
  computeTangents(output);

  // 张力分段渐变
  computePoseTension(output, def, floor, scene, ropeCount);

  // 回填档位绳长（精确路径长度）
  floor.ropeLengths[def.id] = totalLen;

  perfProbe.measure(`solve.${def.id}`, `solve.${def.id}`);
  return { nodeCount: write, totalLength: totalLen, collisionQueries: coll.queryCount };
}

function v3dist(a: [number, number, number], b: [number, number, number]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** 中心差分计算切线并归一化，写入 output.tangents */
export function computeTangents(output: RopePose): void {
  const n = output.nodeCount;
  for (let i = 0; i < n; i++) {
    const prev = Math.max(0, i - 1);
    const next = Math.min(n - 1, i + 1);
    let tx = output.positions[next * 3]! - output.positions[prev * 3]!;
    let ty = output.positions[next * 3 + 1]! - output.positions[prev * 3 + 1]!;
    let tz = output.positions[next * 3 + 2]! - output.positions[prev * 3 + 2]!;
    const l = Math.hypot(tx, ty, tz) || 1;
    tx /= l;
    ty /= l;
    tz /= l;
    output.tangents[i * 3] = tx;
    output.tangents[i * 3 + 1] = ty;
    output.tangents[i * 3 + 2] = tz;
  }
}

/** 批求解一组绳（楼层切换主入口），返回总耗时元数据 */
export function solveRopeBatch(
  defs: RopeDefinition[],
  scene: SceneConfig,
  floor: FloorState,
  options: SolveOptions,
  colliders: ColliderProvider,
  poses: Map<string, RopePose>,
  cache: { get(key: string): RopePose | undefined; set(key: string, pose: RopePose): void },
  keyOf: (def: RopeDefinition) => string,
  allocate: (def: RopeDefinition, key: string) => RopePose,
  loopLengths: Record<string, number>,
): { solved: number; fromCache: number } {
  let solved = 0;
  let fromCache = 0;
  for (const def of defs) {
    const key = keyOf(def);
    let pose = cache.get(key);
    if (pose) {
      poses.set(def.id, pose);
      fromCache++;
      continue;
    }
    pose = allocate(def, key);
    pose.cacheKey = key;
    solveRopePose(
      def,
      scene,
      floor,
      options,
      colliders,
      pose,
      loopLengths[def.id] ?? 0,
      defs.filter((d) => d.kind === def.kind).length,
    );
    cache.set(key, pose);
    poses.set(def.id, pose);
    solved++;
  }
  return { solved, fromCache };
}

export type { PathSegment };
