/**
 * 16ms 预算基准：36 绳（超过默认 9 绳的压力场景）× 全楼层连续切换。
 * 运行：npx vitest bench（或 vitest run 此文件做断言式回归）。
 */
import { describe, expect, it } from 'vitest';
import {
  createDefaultSceneConfig,
  createDefaultFloorDefs,
  createTractionRopes,
  createGovernorRope,
} from '../../config/defaultSceneConfig';
import { buildAllFloorStates } from '../model/floorModel';
import { solveRopePose } from './ropePathSolver';
import { allocatePose, releasePose } from './poseCache';
import { NullColliderProvider } from './nullCollider';
import { LOD_SPECS } from '../perf/budgets';
import { perfProbe } from '../perf/perfProbe';
import type { RopeDefinition } from '../model/types';

/** 构造 36 根曳引绳（多槽扩展）+ 1 根限速器绳的压力场景 */
function buildStressRopes(): RopeDefinition[] {
  const scene = createDefaultSceneConfig();
  // 复制曳引绳定义并扩展到 36 根（重写 id 与槽位）
  const base = createTractionRopes(scene);
  const ropes: RopeDefinition[] = [];
  for (let i = 0; i < 36; i++) {
    const src = base[i % base.length]!;
    ropes.push({
      ...src,
      id: `stress-${String(i).padStart(2, '0')}`,
      stations: src.stations.map((st) =>
        st.type === 'sheave'
          ? { ...st, grooveIndex: i % scene.sheaves[0]!.grooveCount }
          : st,
      ),
    });
  }
  ropes.push(createGovernorRope());
  return ropes;
}

describe('16ms 性能预算（37 绳连续楼层切换）', () => {
  it('mid LOD 全量冷启动重算 ≤ 16ms', () => {
    const scene = createDefaultSceneConfig();
    const ropes = buildStressRopes();
    const floors = buildAllFloorStates(scene, createDefaultFloorDefs());
    const options = {
      lod: 'mid' as const,
      collisionIterations: LOD_SPECS.mid.collisionIterations,
      collisionMargin: 0.005,
    };
    const colliders = new NullColliderProvider();
    const poses = ropes.map((d) => allocatePose(d.id, 'bench'));

    // 预热
    for (let r = 0; r < ropes.length; r++) {
      solveRopePose(ropes[r]!, scene, floors[5]!, options, colliders, poses[r]!);
    }

    // 测量切换到一个未缓存楼层的整批重算
    const target = floors[8]!;
    const t0 = performance.now();
    let totalNodes = 0;
    for (let r = 0; r < ropes.length; r++) {
      const res = solveRopePose(ropes[r]!, scene, target, options, colliders, poses[r]!);
      totalNodes += res.nodeCount;
    }
    const elapsed = performance.now() - t0;

    // eslint-disable-next-line no-console
    console.log(
      `[bench] ${ropes.length} 绳, ${totalNodes} 节点, mid LOD 冷重算 = ${elapsed.toFixed(2)} ms`,
    );
    expect(elapsed).toBeLessThanOrEqual(16);

    for (const p of poses) releasePose(p);
    void perfProbe;
  });

  it('low LOD 冷重算显著低于 mid（降级链有效）', () => {
    const scene = createDefaultSceneConfig();
    const ropes = buildStressRopes();
    const floors = buildAllFloorStates(scene, createDefaultFloorDefs());
    const colliders = new NullColliderProvider();

    const measure = (lod: 'mid' | 'low') => {
      const poses = ropes.map((d) => allocatePose(d.id, lod));
      const opts = {
        lod,
        collisionIterations: LOD_SPECS[lod].collisionIterations,
        collisionMargin: 0.005,
      };
      const t0 = performance.now();
      for (let r = 0; r < ropes.length; r++) {
        solveRopePose(ropes[r]!, scene, floors[3]!, opts, colliders, poses[r]!);
      }
      const e = performance.now() - t0;
      for (const p of poses) releasePose(p);
      return e;
    };

    const mid = measure('mid');
    const low = measure('low');
    // eslint-disable-next-line no-console
    console.log(`[bench] mid=${mid.toFixed(2)}ms low=${low.toFixed(2)}ms`);
    expect(low).toBeLessThan(mid);
  });
});
