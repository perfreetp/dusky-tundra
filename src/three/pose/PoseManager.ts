/**
 * 姿态管理：基准姿态缓存 + 渲染缓冲（逐帧摆幅）+ 楼层切换重算调度。
 * 与 three 解耦，只操作 core 数据结构。
 */
import type {
  FloorState,
  RopeDefinition,
  RopePose,
  SceneConfig,
  SolveOptions,
} from '../../core/model/types';
import type { ColliderProvider } from '../../core/model/types';
import { solveRopeBatch, computeTangents } from '../../core/rope/ropePathSolver';
import { PoseCache, allocatePose, poseCacheKey } from '../../core/rope/poseCache';
import { applySwing } from '../../core/rope/swingModel';
import { MAX_NODES_PER_ROPE } from '../../core/perf/budgets';
import { perfProbe } from '../../core/perf/perfProbe';

export class PoseManager {
  readonly cache = new PoseCache();
  /** 当前生效的基准姿态（无摆幅） */
  readonly basePoses = new Map<string, RopePose>();
  /** 逐帧渲染缓冲（基准 + 摆幅），按绳预分配 */
  private renderedBuffers = new Map<string, Float32Array>();
  private radii = new Map<string, number>();
  private loopLengths: Record<string, number>;

  constructor(
    private scene: SceneConfig,
    private ropes: RopeDefinition[],
    loopLengths: Record<string, number>,
  ) {
    this.loopLengths = loopLengths;
    for (const r of ropes) {
      this.renderedBuffers.set(r.id, new Float32Array(MAX_NODES_PER_ROPE * 3));
      this.radii.set(r.id, r.radius);
    }
  }

  /** 楼层/负载切换：批量重算（命中缓存的跳过） */
  rebuild(floor: FloorState, options: SolveOptions, colliders: ColliderProvider): {
    solved: number;
    fromCache: number;
    elapsedMs: number;
  } {
    perfProbe.mark('pose.rebuild');
    const { solved, fromCache } = solveRopeBatch(
      this.ropes,
      this.scene,
      floor,
      options,
      colliders,
      this.basePoses,
      this.cache,
      (def) => poseCacheKey(def.id, floor.floorId, floor.loadCoeff),
      (def, key) => allocatePose(def.id, key),
      this.loopLengths,
    );
    // 渲染缓冲首帧直接拷贝基准
    for (const [id, pose] of this.basePoses) {
      const buf = this.renderedBuffers.get(id)!;
      buf.set(pose.positions.subarray(0, pose.nodeCount * 3));
    }
    const elapsedMs = perfProbe.measure('pose.rebuild', 'pose.rebuild');
    return { solved, fromCache, elapsedMs };
  }

  /** 逐帧：把摆幅叠加到渲染缓冲（不写回基准） */
  applyFrameSwing(time: number, floor: FloorState, margin: number): void {
    for (const def of this.ropes) {
      const pose = this.basePoses.get(def.id);
      const buf = this.renderedBuffers.get(def.id);
      if (!pose || !buf) continue;
      applySwing(def, pose, buf, time, floor, pose.clearances, def.radius, margin);
    }
  }

  getRendered(id: string): Float32Array | undefined {
    return this.renderedBuffers.get(id);
  }

  getRadius(id: string): number {
    return this.radii.get(id) ?? 0.006;
  }

  get radiusMap(): Map<string, number> {
    return this.radii;
  }

  get renderedMap(): Map<string, Float32Array> {
    return this.renderedBuffers;
  }

  /** 重新计算全部切线（外部修正后调用） */
  refreshTangents(): void {
    for (const pose of this.basePoses.values()) computeTangents(pose);
  }

  get ropeCount(): number {
    return this.ropes.length;
  }
}
