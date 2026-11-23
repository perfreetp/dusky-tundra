// @ts-nocheck: three.js TSL 链式节点的 @types 覆盖不完整，运行时 API 已按 r187 验证
/**
 * WebGPU 流线粒子系统（compute shader 推进，全部驻留 GPU）。
 *
 * 数据布局（SoA 存储缓冲，容量按 2 万粒子上限一次性分配）：
 *   position[N]   vec3  当前位置
 *   velocity[N]   vec3  上一帧速度
 *   age[N]        float 寿命（秒），-1 表示待重生
 *   seed[N]       float 确定性随机种子
 *   trail[N*T]    vec4  xyz=历史位置 w=归一化速率；每粒子环形缓冲
 *   head[N]       uint  环形缓冲写头
 *
 * 每帧一次 compute dispatch（workgroup 64）：
 *   体素三线性采样速度场 -> 按 stepSize 推进 -> 越界/到期在撒播点表重生
 *   -> 写环形拖尾；渲染端解环绘制连续线段 + 粒子头。
 */

import {
  NormalBlending,
  BufferGeometry,
  Data3DTexture,
  DataTexture,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Mesh,
  SphereGeometry,
  Uint32BufferAttribute,
  Vector3,
} from 'three';
import {
  NodeMaterial,
  StorageInstancedBufferAttribute,
  WebGPURenderer,
} from 'three/webgpu';
import {
  Fn,
  instanceIndex,
  storage,
  texture3DLoad,
  uniform,
  vec3,
  float,
  uint,
  ivec3,
  If,
  select,
  mix,
  length,
  attribute,
  texture,
  vec2,
  vec4,
} from 'three/tsl';
import { MAX_PARTICLES } from '../state/store';

const TRAIL = 32; // 拖尾环形缓冲深度（段数上限）
const MAX_SEEDS = 4096;

export interface GpuParticleSystem {
  group: Group;
  /** 注入 renderer 后每帧驱动 compute */
  bindRenderer: (renderer: WebGPURenderer) => void;
  update: (dt: number) => void;
  setActiveCount: (n: number) => void;
  setStepSize: (s: number) => void;
  setTrailLength: (n: number) => void;
  reseed: (seeds: Float32Array) => void;
  dispose: () => void;
}

export function createGpuParticles(
  velocityTex: Data3DTexture,
  gridSize: [number, number, number],
  worldMin: [number, number, number],
  worldMax: [number, number, number],
  speedLUT: DataTexture,
  initialSeeds: Float32Array,
): GpuParticleSystem {
  const N = MAX_PARTICLES;

  // ---- 存储缓冲（固定上限分配，调粒子数只改 activeCount）----
  const positionAttr = new StorageInstancedBufferAttribute(new Float32Array(N * 3), 3);
  const velocityAttr = new StorageInstancedBufferAttribute(new Float32Array(N * 3), 3);
  const ageAttr = new StorageInstancedBufferAttribute(new Float32Array(N), 1);
  const seedAttr = new StorageInstancedBufferAttribute(new Float32Array(N), 1);
  const trailAttr = new StorageInstancedBufferAttribute(new Float32Array(N * TRAIL * 4), 4);
  const headAttr = new StorageInstancedBufferAttribute(new Uint32Array(N), 1);
  const seedBuf = new StorageInstancedBufferAttribute(new Float32Array(MAX_SEEDS * 3), 3);

  const positionNode = storage(positionAttr, 'vec3');
  const velocityNode = storage(velocityAttr, 'vec3');
  const ageNode = storage(ageAttr, 'float');
  const seedNode = storage(seedAttr, 'float');
  const trailNode = storage(trailAttr, 'vec4');
  const headNode = storage(headAttr, 'uint');
  const seedTableNode = storage(seedBuf, 'vec3');

  const uStep = uniform(0.5);
  const uTrailLen = uniform(24);
  const uDt = uniform(1 / 60);
  const uMaxSpeed = uniform(30);
  const uActive = uniform(N);
  const uSeedCount = uniform(0);
  const uGrid = uniform(new Vector3(gridSize[0], gridSize[1], gridSize[2]));
  const uMin = uniform(new Vector3(...worldMin));
  const uInvSize = uniform(
    new Vector3(
      1 / (worldMax[0] - worldMin[0]),
      1 / (worldMax[1] - worldMin[1]),
      1 / (worldMax[2] - worldMin[2]),
    ),
  );
  const uVelTex = velocityTex;

  const hash1 = Fn(([x]) => {
    const s = x.mul(127.1).sin().mul(43758.5453);
    return s.sub(s.floor());
  });

  const worldToUv = (p) =>
    vec3(
      p.x.sub(uMin.x).mul(uInvSize.x),
      p.y.sub(uMin.y).mul(uInvSize.y),
      p.z.sub(uMin.z).mul(uInvSize.z),
    );

  /** 体素三线性采样：texture3DLoad 取 8 角手动插值（load 不走 sampler filter） */
  const sampleVel = Fn(([p]) => {
    const uv = worldToUv(p).clamp(0, 0.9999);
    const gx = uv.x.mul(uGrid.x);
    const gy = uv.y.mul(uGrid.y);
    const gz = uv.z.mul(uGrid.z);
    const i0 = gx.floor().toUint();
    const j0 = gy.floor().toUint();
    const k0 = gz.floor().toUint();
    const tx = gx.sub(i0.toFloat());
    const ty = gy.sub(j0.toFloat());
    const tz = gz.sub(k0.toFloat());
    const i1 = select(i0.add(1), i0, i0.greaterThanEqual(uGrid.x.toUint().sub(1)));
    const j1 = select(j0.add(1), j0, j0.greaterThanEqual(uGrid.y.toUint().sub(1)));
    const k1 = select(k0.add(1), k0, k0.greaterThanEqual(uGrid.z.toUint().sub(1)));
    const loadAt = (i, j, k) => texture3DLoad(uVelTex, ivec3(i, j, k)).xyz;
    const c000 = loadAt(i0, j0, k0);
    const c100 = loadAt(i1, j0, k0);
    const c010 = loadAt(i0, j1, k0);
    const c110 = loadAt(i1, j1, k0);
    const c001 = loadAt(i0, j0, k1);
    const c101 = loadAt(i1, j0, k1);
    const c011 = loadAt(i0, j1, k1);
    const c111 = loadAt(i1, j1, k1);
    const x00 = mix(c000, c100, tx);
    const x10 = mix(c010, c110, tx);
    const x01 = mix(c001, c101, tx);
    const x11 = mix(c011, c111, tx);
    return mix(mix(x00, x10, ty), mix(x01, x11, ty), tz);
  });

  // ---- compute kernel ----
  const simulate = Fn(() => {
    const id = instanceIndex.toUint();
    If(id.lessThan(uActive), () => {
      const pos = positionNode.element(id);
      const vel = velocityNode.element(id);
      const age = ageNode.element(id);
      const seed = seedNode.element(id);

      If(age.lessThan(0), () => {
        const sid = seed
          .mul(uSeedCount.toFloat())
          .floor()
          .toUint()
          .mod(uSeedCount);
        pos.assign(seedTableNode.element(sid));
        age.assign(hash1(seed.mul(7.13)).mul(2.0));
      });

      const sampled = sampleVel(pos);
      vel.assign(sampled);
      pos.assign(pos.add(sampled.mul(uDt).mul(uStep)));
      age.assign(age.sub(uDt));

      const uv = worldToUv(pos);
      const outside = uv
        .x.lessThan(0)
        .or(uv.x.greaterThan(1))
        .or(uv.y.lessThan(0))
        .or(uv.y.greaterThan(1))
        .or(uv.z.lessThan(0))
        .or(uv.z.greaterThan(1));
      If(outside.or(age.lessThan(0)), () => {
        age.assign(float(-1));
      });

      const h = headNode.element(id);
      trailNode.element(id.mul(uint(TRAIL)).add(h)).assign(
        vec4(pos.x, pos.y, pos.z, length(sampled).div(uMaxSpeed).clamp(0, 1)),
      );
      headNode.element(id).assign(h.add(1).mod(uint(TRAIL)));
    });
  });
  const computeNode = simulate().compute(N, 64);

  // ---- 拖尾线段：每粒子 TRAIL-1 段 × 2 顶点，实例化 N 次 ----
  const segPositions: number[] = [];
  const segAges: number[] = [];
  const segCorner: number[] = [];
  for (let s = 0; s < TRAIL; s++) {
    for (const corner of [0, 1]) {
      segPositions.push(0, 0, 0);
      segAges.push(s);
      segCorner.push(corner);
    }
  }
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new Float32BufferAttribute(segPositions, 3));
  lineGeo.setAttribute('segAge', new Float32BufferAttribute(segAges, 1));
  lineGeo.setAttribute('corner', new Float32BufferAttribute(segCorner, 1));
  const lineIdx: number[] = [];
  for (let s = 0; s < TRAIL - 1; s++) {
    const a = s * 2;
    lineIdx.push(a, a + 1, a + 2, a + 1, a + 2, a + 3);
  }
  lineGeo.setIndex(new Uint32BufferAttribute(lineIdx, 1));
  const headInstance = new InstancedBufferAttribute(new Uint32Array(N), 1);
  lineGeo.setAttribute('iHead', headInstance);

  const lineMat = new NodeMaterial();
  // InstancedMesh 的实例属性在 TSL 中通过 attribute() 自动按实例解析
  const iHead = attribute('iHead', 'uint');
  const segAgeAttr = attribute('segAge', 'float');
  const cornerAttr = attribute('corner', 'float');
  const pid = instanceIndex.toUint();
  const slot0 = iHead.add(segAgeAttr.toUint()).mod(uint(TRAIL));
  const slot1 = iHead.add(segAgeAttr.add(1).toUint()).mod(uint(TRAIL));
  const p0 = trailNode.element(pid.mul(uint(TRAIL)).add(slot0));
  const p1 = trailNode.element(pid.mul(uint(TRAIL)).add(slot1));
  const trailPoint = select(cornerAttr.equal(0), p0, p1);
  lineMat.vertexNode = vec3(trailPoint.xyz);
  const ageFade = float(1).sub(segAgeAttr.div(uTrailLen.toFloat())).clamp(0.05, 1);
  const lutColor = texture(speedLUT, vec2(trailPoint.w, 0.5)).rgb;
  lineMat.fragmentNode = vec4(lutColor.mul(ageFade), ageFade.mul(0.85));
  lineMat.transparent = true;
  lineMat.blending = NormalBlending;
  lineMat.depthWrite = false;
  lineMat.side = DoubleSide;

  const lines = new InstancedMesh(lineGeo, lineMat, N);
  lines.frustumCulled = false;
  lines.renderOrder = 3;

  // ---- 粒子头：实例化小球 ----
  const headGeo = new SphereGeometry(0.022, 8, 6);
  const headMat = new NodeMaterial();
  const hp = positionNode.element(pid);
  const hv = velocityNode.element(pid);
  headMat.vertexNode = vec3(hp);
  const headT = length(hv).div(uMaxSpeed).clamp(0, 1);
  headMat.fragmentNode = vec4(texture(speedLUT, vec2(headT, 0.5)).rgb, 1);
  headMat.transparent = true;
  headMat.blending = NormalBlending;
  headMat.depthWrite = false;
  const heads = new InstancedMesh(headGeo, headMat, N);
  heads.frustumCulled = false;
  heads.renderOrder = 4;

  const group = new Group();
  group.add(lines as unknown as Mesh);
  group.add(heads as unknown as Mesh);

  // 初始化：种子、寿命、隐藏未出生粒子
  const seedCount = Math.min(initialSeeds.length / 3, MAX_SEEDS);
  (seedBuf.array as Float32Array).set(initialSeeds.subarray(0, seedCount * 3));
  uSeedCount.value = seedCount;
  const ageArr = ageAttr.array as Float32Array;
  const seedArr = seedAttr.array as Float32Array;
  const posArr = positionAttr.array as Float32Array;
  for (let i = 0; i < N; i++) {
    seedArr[i] = (((i * 2654435761) >>> 0) / 4294967296) || 0.001;
    ageArr[i] = -1;
    posArr[i * 3 + 1] = -999;
  }

  let renderer: WebGPURenderer | null = null;

  return {
    group,
    bindRenderer: (r) => {
      renderer = r;
    },
    update: (dt: number) => {
      uDt.value = Math.min(dt, 1 / 20);
      // compute 写 storage；实例绘制的 iHead 属性需要镜像一份
      (headInstance.array as Uint32Array).set(headAttr.array as Uint32Array);
      headInstance.needsUpdate = true;
      renderer?.compute(computeNode);
    },
    setActiveCount: (n) => {
      uActive.value = Math.max(0, Math.min(N, Math.round(n)));
    },
    setStepSize: (s) => {
      uStep.value = s;
    },
    setTrailLength: (n) => {
      uTrailLen.value = Math.max(2, Math.min(TRAIL, Math.round(n)));
    },
    reseed: (newSeeds: Float32Array) => {
      const s = newSeeds.subarray(0, MAX_SEEDS * 3);
      (seedBuf.array as Float32Array).set(s);
      uSeedCount.value = s.length / 3;
      for (let i = 0; i < N; i++) ageArr[i] = -1;
    },
    dispose: () => {
      lineGeo.dispose();
      headGeo.dispose();
      lineMat.dispose();
      headMat.dispose();
    },
  };
}