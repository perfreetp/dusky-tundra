/**
 * 姿态预计算 Worker：在后台线程构建 L1 基准姿态，
 * 主线程切换楼层时大概率直接命中缓存。
 *
 * 注：core 内核零 three 依赖，可直接在 Worker 中复用。
 * 当前为预留骨架——主线程实测冷重算仅 ~1.5ms（37 绳），
 * 默认无需启用；在低端机预算吃紧时由 Engine 按需 postMessage 触发。
 */
import { solveRopePose } from '../core/rope/ropePathSolver';
import { allocatePose } from '../core/rope/poseCache';
import { NullColliderProvider } from '../core/rope/nullCollider';
import type {
  FloorState,
  RopeDefinition,
  SceneConfig,
  SolveOptions,
} from '../core/model/types';

export interface PrecomputeRequest {
  type: 'precompute';
  scene: SceneConfig;
  ropes: RopeDefinition[];
  floors: FloorState[];
  options: SolveOptions;
  loopLengths: Record<string, number>;
}

export interface PrecomputeResponse {
  type: 'precompute-done';
  floorId: string;
  ropeCount: number;
  elapsedMs: number;
}

self.onmessage = (ev: MessageEvent<PrecomputeRequest>) => {
  const msg = ev.data;
  if (msg.type !== 'precompute') return;

  for (const floor of msg.floors) {
    const t0 = performance.now();
    for (const def of msg.ropes) {
      const pose = allocatePose(def.id, `${def.id}|${floor.floorId}`);
      // Worker 内无 BVH 碰撞体时用 NullProvider；碰撞修正可在主线程回填
      solveRopePose(
        def,
        msg.scene,
        floor,
        msg.options,
        new NullColliderProvider(),
        pose,
        msg.loopLengths[def.id] ?? 0,
        msg.ropes.filter((d) => d.kind === def.kind).length,
      );
    }
    const response: PrecomputeResponse = {
      type: 'precompute-done',
      floorId: floor.floorId,
      ropeCount: msg.ropes.length,
      elapsedMs: performance.now() - t0,
    };
    self.postMessage(response);
  }
};
