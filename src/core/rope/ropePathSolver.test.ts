import { describe, expect, it } from 'vitest';
import {
  createDefaultFloorDefs,
  createDefaultRopes,
  createDefaultSceneConfig,
  GOVERNOR_LOOP_LENGTH,
} from '../../config/defaultSceneConfig';
import { buildAllFloorStates } from '../model/floorModel';
import { solveRopePose, computeTangents } from './ropePathSolver';
import { allocatePose, PoseCache, poseCacheKey, releasePose } from './poseCache';
import { LOD_SPECS, DEFAULT_SOLVE_OPTIONS } from '../perf/budgets';
import { NullColliderProvider } from './nullCollider';
import type { ClosestHit, ColliderProvider, Vec3 } from '../model/types';
import { solveCollisions } from './collisionProject';

/** 测试用盒体碰撞体（导轨近似）：距 XZ 中心线 halfWidth 外无碰撞 */
class BoxCollider implements ColliderProvider {
  constructor(private center: Vec3, private half: Vec3) {}
  boundsMaybeHit(p: Vec3): boolean {
    return (
      Math.abs(p[0] - this.center[0]) < this.half[0] + 0.05 &&
      Math.abs(p[2] - this.center[2]) < this.half[2] + 0.05 &&
      p[1] > this.center[1] - this.half[1] &&
      p[1] < this.center[1] + this.half[1]
    );
  }
  closestPoint(p: Vec3, out: ClosestHit): ClosestHit | null {
    const cx = Math.max(
      this.center[0] - this.half[0],
      Math.min(this.center[0] + this.half[0], p[0]),
    );
    const cy = Math.max(
      this.center[1] - this.half[1],
      Math.min(this.center[1] + this.half[1], p[1]),
    );
    const cz = Math.max(
      this.center[2] - this.half[2],
      Math.min(this.center[2] + this.half[2], p[2]),
    );
    out.point = [cx, cy, cz];
    out.distance = Math.hypot(p[0] - cx, p[1] - cy, p[2] - cz);
    out.faceIndex = 0;
    return out;
  }
  segmentIntersects(): boolean {
    return false;
  }
}

describe('绳姿态求解器（默认场景）', () => {
  const scene = createDefaultSceneConfig();
  const ropes = createDefaultRopes(scene);
  const floors = buildAllFloorStates(scene, createDefaultFloorDefs());

  it('生成 8 根曳引绳 + 1 根限速器绳', () => {
    expect(ropes).toHaveLength(9);
    expect(ropes.filter((r) => r.kind === 'traction')).toHaveLength(8);
  });

  it('对重与轿厢反向运动（1:1 守恒）', () => {
    const f0 = floors[0]!;
    const fTop = floors[floors.length - 1]!;
    const dCar = fTop.carY - f0.carY;
    const dCw = fTop.counterweightY - f0.counterweightY;
    expect(dCar).toBeCloseTo(scene.hoistway.travel, 9);
    expect(dCw).toBeCloseTo(-scene.hoistway.travel, 9);
  });

  it.each([0, 5, 11])('楼层 %s：每根绳求解成功且弧节点严格贴合轮缘', (fi) => {
    const floor = floors[fi]!;
    const colliders = new NullColliderProvider();
    for (const def of ropes) {
      const pose = allocatePose(def.id, 'test');
      solveRopePose(
        def,
        scene,
        floor,
        { ...DEFAULT_SOLVE_OPTIONS, lod: 'high' },
        colliders,
        pose,
        def.kind === 'governor' ? GOVERNOR_LOOP_LENGTH : 0,
        8,
      );
      expect(pose.nodeCount).toBeGreaterThan(8);
      expect(pose.nodeCount).toBeLessThanOrEqual(220);

      // 弧节点：到所属绳轮【槽位点】的距离恒等于节圆半径
      for (let i = 0; i < pose.nodeCount; i++) {
        if (pose.arcFlags[i] !== 1) continue;
        const px = pose.positions[i * 3]!;
        const py = pose.positions[i * 3 + 1]!;
        const pz = pose.positions[i * 3 + 2]!;
        // 若节点真贴合某绳轮，则所有绳轮中最小的 |径向距离-节圆半径| 必然 ≈ 0
        let minErr = Infinity;
        for (const s of scene.sheaves) {
          const dx = px - s.center[0];
          const dy = py - s.center[1];
          const dz = pz - s.center[2];
          const axial = dx * s.axis[0] + dy * s.axis[1] + dz * s.axis[2];
          const radial = Math.hypot(
            dx - s.axis[0] * axial,
            dy - s.axis[1] * axial,
            dz - s.axis[2] * axial,
          );
          minErr = Math.min(minErr, Math.abs(radial - s.pitchRadius));
        }
        // Float32 存储，0.01mm 精度
        expect(minErr).toBeCloseTo(0, 5);
      }

      // 自由节点对每个绳轮：若落在该轮槽位轴向范围内，平面内径向距离不得小于节圆半径
      for (let i = 0; i < pose.nodeCount; i++) {
        if (pose.arcFlags[i] === 1) continue;
        const px = pose.positions[i * 3]!;
        const py = pose.positions[i * 3 + 1]!;
        const pz = pose.positions[i * 3 + 2]!;
        for (const s of scene.sheaves) {
          const dx = px - s.center[0];
          const dy = py - s.center[1];
          const dz = pz - s.center[2];
          const axial = dx * s.axis[0] + dy * s.axis[1] + dz * s.axis[2];
          const grooveSpan =
            Math.abs(s.firstGrooveOffset) +
            Math.max(0, s.grooveCount - 1) * s.groovePitch +
            0.02;
          if (Math.abs(axial) > grooveSpan) continue;
          const radial = Math.hypot(
            dx - s.axis[0] * axial,
            dy - s.axis[1] * axial,
            dz - s.axis[2] * axial,
          );
          // 容差 1mm（样条/浮点）
          expect(radial).toBeGreaterThanOrEqual(s.pitchRadius - 1e-3);
        }
      }
      releasePose(pose);
    }
  });

  it('缓存键命中：同档位重复求解走缓存', () => {
    const cache = new PoseCache();
    const floor = floors[3]!;
    const def = ropes[0]!;
    const key = poseCacheKey(def.id, floor.floorId, floor.loadCoeff);
    const pose = allocatePose(def.id, key);
    solveRopePose(def, scene, floor, DEFAULT_SOLVE_OPTIONS, new NullColliderProvider(), pose);
    cache.set(key, pose);
    expect(cache.get(key)).toBe(pose);
    expect(cache.hits.hit).toBe(1);
    cache.clear();
  });

  it('LOD 分级节点数 high > mid > low', () => {
    const floor = floors[6]!;
    const def = ropes[0]!;
    const counts: number[] = [];
    for (const lod of ['high', 'mid', 'low'] as const) {
      const pose = allocatePose(def.id, lod);
      solveRopePose(
        def,
        scene,
        floor,
        { lod, collisionIterations: LOD_SPECS[lod].collisionIterations, collisionMargin: 0.005 },
        new NullColliderProvider(),
        pose,
      );
      counts.push(pose.nodeCount);
      releasePose(pose);
    }
    expect(counts[0]!).toBeGreaterThan(counts[1]!);
    expect(counts[1]!).toBeGreaterThan(counts[2]!);
  });

  it('碰撞修正：侵入盒体的节点被推出且弧节点零位移', () => {
    const floor = floors[6]!;
    const def = ropes[0]!;
    const pose = allocatePose(def.id, 'coll');
    solveRopePose(def, scene, floor, DEFAULT_SOLVE_OPTIONS, new NullColliderProvider(), pose);

    // 在绳路径中部放置一个侵入盒体
    const mid = Math.floor(pose.nodeCount / 2);
    const box = new BoxCollider(
      [pose.positions[mid * 3]!, pose.positions[mid * 3 + 1]!, pose.positions[mid * 3 + 2]!],
      [0.05, 0.6, 0.05],
    );

    const arcBefore = new Float32Array(
      pose.positions.filter((_, i) => pose.arcFlags[Math.floor(i / 3)] === 1),
    );
    const result = solveCollisions(pose, box, def.radius, 0.005, 3);
    expect(result.iterations).toBeGreaterThan(0);
    expect(result.correctedNodes).toBeGreaterThan(0);

    // 弧节点零位移
    let ai = 0;
    for (let i = 0; i < pose.nodeCount; i++) {
      if (pose.arcFlags[i] === 1) {
        for (let c = 0; c < 3; c++) {
          expect(pose.positions[i * 3 + c]).toBe(arcBefore[ai++]);
        }
      }
    }

    // 修正后所有自由节点到盒面距离 >= r + margin
    const hit: ClosestHit = { point: [0, 0, 0], distance: 0, faceIndex: -1 };
    for (let i = 0; i < pose.nodeCount; i++) {
      if (pose.arcFlags[i] === 1) continue;
      const p: Vec3 = [
        pose.positions[i * 3]!,
        pose.positions[i * 3 + 1]!,
        pose.positions[i * 3 + 2]!,
      ];
      const h = box.closestPoint(p, hit);
      if (h) expect(h.distance).toBeGreaterThanOrEqual(def.radius + 0.005 - 1e-9);
    }
    releasePose(pose);
  });

  it('computeTangents 输出归一化切线', () => {
    const floor = floors[2]!;
    const def = ropes[1]!;
    const pose = allocatePose(def.id, 'tan');
    solveRopePose(def, scene, floor, DEFAULT_SOLVE_OPTIONS, new NullColliderProvider(), pose);
    computeTangents(pose);
    for (let i = 0; i < pose.nodeCount; i++) {
      const l = Math.hypot(
        pose.tangents[i * 3]!,
        pose.tangents[i * 3 + 1]!,
        pose.tangents[i * 3 + 2]!,
      );
      expect(l).toBeCloseTo(1, 6);
    }
    releasePose(pose);
  });
});
