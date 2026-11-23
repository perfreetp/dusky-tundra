/**
 * WebGL 回退粒子系统：CPU 推进（复用 volumeSampler 的三线性插值），
 * GPU 只负责线段/点的绘制。语义与 particleGpu 完全一致：
 * 同容量上限、同 stepSize/trailLength 参数、同速率色带。
 * 每粒子最多 TRAIL-1 段拖尾，缓冲按 2 万 × 全段预分配（约 250 万顶点，
 * 实际绘制由 drawRange 按当前活动粒子与段数裁剪）。
 */

import {
  NormalBlending,
  BufferGeometry,
  DataTexture,
  Float32BufferAttribute,
  Group,
  LineSegments,
  Points,
  PointsMaterial,
  LineBasicMaterial,
  DynamicDrawUsage,
} from 'three';
import { MAX_PARTICLES } from '../state/store';
import type { VolumeGrid } from './volumeSampler';
import { sampleVelocity, volumeBounds } from './volumeSampler';
import { speedColor } from './colormap';

const TRAIL = 32;
const MAX_SEG = TRAIL - 1;

export interface CpuParticleSystem {
  group: Group;
  update: (dt: number) => void;
  setActiveCount: (n: number) => void;
  setStepSize: (s: number) => void;
  setTrailLength: (n: number) => void;
  reseed: (seeds: Float32Array) => void;
  dispose: () => void;
}

interface CpuParticle {
  x: number;
  y: number;
  z: number;
  age: number;
  seed: number;
  trail: Float32Array; // TRAIL*4
  head: number;
}

export function createCpuParticles(
  grid: VolumeGrid,
  speedLUT: DataTexture,
  initialSeeds: Float32Array,
): CpuParticleSystem {
  void speedLUT;
  const N = MAX_PARTICLES;
  const bounds = volumeBounds(grid);
  const particles: CpuParticle[] = new Array(N);
  for (let i = 0; i < N; i++) {
    particles[i] = {
      x: 0,
      y: -999,
      z: 0,
      age: -1,
      seed: (((i * 2654435761) >>> 0) / 4294967296) || 0.001,
      trail: new Float32Array(TRAIL * 4),
      head: 0,
    };
  }
  let seeds = initialSeeds.slice();
  let activeCount = N;
  let stepSize = 0.5;
  let trailLength = 24;

  // ---- 线段几何：每粒子 MAX_SEG 段 × 2 顶点，按上限一次性分配 ----
  // 注意：r187 WebGL 后端可能把大 attribute 转成 PBO 纹理并替换其 array，
  // 因此不能持有独立数组闭包，写入时一律经 attribute.array 取当前引用。
  const maxLineVerts = N * MAX_SEG * 2;
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute(
    'position',
    new Float32BufferAttribute(new Float32Array(maxLineVerts * 3), 3).setUsage(DynamicDrawUsage),
  );
  lineGeo.setAttribute(
    'color',
    new Float32BufferAttribute(new Float32Array(maxLineVerts * 3), 3).setUsage(DynamicDrawUsage),
  );
  lineGeo.setDrawRange(0, 0);
  const lineMat = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: NormalBlending,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  lines.renderOrder = 3;

  // ---- 粒子头 ----
  const headGeo = new BufferGeometry();
  headGeo.setAttribute(
    'position',
    new Float32BufferAttribute(new Float32Array(N * 3), 3).setUsage(DynamicDrawUsage),
  );
  headGeo.setAttribute(
    'color',
    new Float32BufferAttribute(new Float32Array(N * 3), 3).setUsage(DynamicDrawUsage),
  );
  headGeo.setDrawRange(0, 0);
  const headMat = new PointsMaterial({
    size: 0.07,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: NormalBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const heads = new Points(headGeo, headMat);
  heads.frustumCulled = false;
  heads.renderOrder = 4;

  const group = new Group();
  group.add(lines);
  group.add(heads);

  // 全局注册表：CDP 冒烟测试按组对象身份读取，避免 StrictMode/重挂载后的实例混淆
  const registry = (globalThis as unknown as { __aeroParticles?: Set<CpuParticleSystem> }).__aeroParticles ??
    ((globalThis as unknown as { __aeroParticles?: Set<CpuParticleSystem> }).__aeroParticles = new Set());
  const api: CpuParticleSystem = {
    group,
    update,
    setActiveCount: (n) => {
      activeCount = Math.max(0, Math.min(N, Math.round(n)));
    },
    setStepSize: (s) => {
      stepSize = s;
    },
    setTrailLength: (n) => {
      trailLength = Math.max(2, Math.min(TRAIL, Math.round(n)));
    },
    reseed: (newSeeds: Float32Array) => {
      seeds = newSeeds.slice();
      for (const p of particles) p.age = -1;
    },
    dispose: () => {
      registry.delete(api);
      lineGeo.dispose();
      headGeo.dispose();
      lineMat.dispose();
      headMat.dispose();
    },
  };
  registry.add(api);

  const scratch = new Float32Array(new ArrayBuffer(12));

  function fract(v: number) {
    return v - Math.floor(v);
  }

  function seedParticle(p: CpuParticle) {
    if (seeds.length < 3) return;
    const idx = Math.floor(p.seed * (seeds.length / 3)) % (seeds.length / 3);
    p.x = seeds[idx * 3];
    p.y = seeds[idx * 3 + 1];
    p.z = seeds[idx * 3 + 2];
    p.age = fract(p.seed * 7.13) * 2;
    p.head = 0;
  }

  function inBounds(x: number, y: number, z: number) {
    return (
      x >= bounds.min[0] && x <= bounds.max[0] &&
      y >= bounds.min[1] && y <= bounds.max[1] &&
      z >= bounds.min[2] && z <= bounds.max[2]
    );
  }

  function update(dt: number) {
    const clampedDt = Math.min(dt, 1 / 20);
    let vert = 0;
    let headCount = 0;
    const maxSpeed = grid.maxSpeed || 1;
    const segs = Math.min(trailLength - 1, MAX_SEG);
    // 每帧从 attribute 取当前数组引用（PBO 路径可能已替换 array）
    const linePos = lineGeo.attributes.position.array as Float32Array;
    const lineColor = lineGeo.attributes.color.array as Float32Array;
    const headPos = headGeo.attributes.position.array as Float32Array;
    const headColor = headGeo.attributes.color.array as Float32Array;

    for (let i = 0; i < N; i++) {
      const p = particles[i];
      if (i >= activeCount) continue;

      if (p.age < 0) seedParticle(p);
      let v = sampleVelocity(grid, p.x, p.y, p.z, scratch);
      if (!v) {
        // 种子落在体数据外：换种子立即重试，避免粒子永久死亡
        p.seed = fract(p.seed + 0.6180339887);
        seedParticle(p);
        v = sampleVelocity(grid, p.x, p.y, p.z, scratch);
        if (!v) {
          p.age = -1;
          continue;
        }
      }
      p.x += v[0] * clampedDt * stepSize;
      p.y += v[1] * clampedDt * stepSize;
      p.z += v[2] * clampedDt * stepSize;
      p.age -= clampedDt;
      if (!inBounds(p.x, p.y, p.z) || p.age < 0) {
        p.age = -1;
        continue;
      }

      const speedNorm = Math.min(1, Math.hypot(v[0], v[1], v[2]) / maxSpeed);
      p.trail[p.head * 4] = p.x;
      p.trail[p.head * 4 + 1] = p.y;
      p.trail[p.head * 4 + 2] = p.z;
      p.trail[p.head * 4 + 3] = speedNorm;
      p.head = (p.head + 1) % TRAIL;

      // 粒子头
      headPos[headCount * 3] = p.x;
      headPos[headCount * 3 + 1] = p.y;
      headPos[headCount * 3 + 2] = p.z;
      const hc = speedColor(speedNorm);
      headColor[headCount * 3] = hc[0];
      headColor[headCount * 3 + 1] = hc[1];
      headColor[headCount * 3 + 2] = hc[2];
      headCount++;

      // 拖尾线段（解环，按当前 trailLength 截断）
      for (let s = 0; s < segs && vert + 2 <= maxLineVerts; s++) {
        const i0 = (p.head - 1 - s + TRAIL) % TRAIL;
        const i1 = (p.head - 2 - s + TRAIL * 2) % TRAIL;
        const t0 = p.trail[i0 * 4 + 3];
        const t1 = p.trail[i1 * 4 + 3];
        const fade0 = Math.max(0.1, 1 - s / trailLength);
        const fade1 = Math.max(0.1, 1 - (s + 1) / trailLength);
        const c0 = speedColor(t0);
        const c1 = speedColor(t1);
        linePos[vert * 3] = p.trail[i0 * 4];
        linePos[vert * 3 + 1] = p.trail[i0 * 4 + 1];
        linePos[vert * 3 + 2] = p.trail[i0 * 4 + 2];
        lineColor[vert * 3] = c0[0] * fade0;
        lineColor[vert * 3 + 1] = c0[1] * fade0;
        lineColor[vert * 3 + 2] = c0[2] * fade0;
        vert++;
        linePos[vert * 3] = p.trail[i1 * 4];
        linePos[vert * 3 + 1] = p.trail[i1 * 4 + 1];
        linePos[vert * 3 + 2] = p.trail[i1 * 4 + 2];
        lineColor[vert * 3] = c1[0] * fade1;
        lineColor[vert * 3 + 1] = c1[1] * fade1;
        lineColor[vert * 3 + 2] = c1[2] * fade1;
        vert++;
      }
    }

    // r187：updateRanges 为空时 gl.bufferSubData 全量重传整个 array，
    // 因此每帧清空区间、只置 needsUpdate，确保扩容后的写入完整上传。
    const linePosAttr = lineGeo.attributes.position as Float32BufferAttribute;
    const lineColAttr = lineGeo.attributes.color as Float32BufferAttribute;
    linePosAttr.clearUpdateRanges();
    lineColAttr.clearUpdateRanges();
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;
    lineGeo.setDrawRange(0, vert);
    const headPosAttr = headGeo.attributes.position as Float32BufferAttribute;
    const headColAttr = headGeo.attributes.color as Float32BufferAttribute;
    headPosAttr.clearUpdateRanges();
    headColAttr.clearUpdateRanges();
    headPosAttr.needsUpdate = true;
    headColAttr.needsUpdate = true;
    headGeo.setDrawRange(0, headCount);
  }

  return api;
}
