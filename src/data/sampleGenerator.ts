/**
 * 内置示例数据生成器：程序化赛车几何（带区域 group）+ 解析速度场。
 * 解析场同时驱动表面 Cp（伯努利近似）与体素速度，保证数据自洽，
 * 也作为粒子系统 CPU 回退路径与单元测试的基准场。
 */

import {
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
} from 'three';
import type {
  MeshRegion,
  SurfacePressureDataset,
  VelocityVolumeDataset,
} from '../types/dataset';
import { encodeFloat32, encodeUint32, fingerprintFloat32 } from './encoding';

const FREE_STREAM: [number, number, number] = [-28, 0, 0];

/**
 * 解析流场（世界坐标，m/s）。
 * 组成：自由来流 + 车头滞止 + 车体绕流 + 地面效应 +
 *      尾翼双梢涡 + 扩散器上洗 + 尾迹亏损。
 */
export function sampleFlow(x: number, y: number, z: number): [number, number, number] {
  let vx = FREE_STREAM[0];
  let vy = 0;
  let vz = 0;

  // 车头滞止区（x≈-2.6 附近减速）
  const noseD = Math.hypot(x + 2.6, y - 0.35, z);
  const stag = Math.exp(-(noseD * noseD) / 0.55);
  vx += 26 * stag;

  // 车体绕流：在车身椭圆柱外产生 YZ 平面排挤
  const bodyRx = 2.4;
  const bodyRy = 0.55;
  const bodyRz = 0.95;
  const qx = (x + 0.1) / bodyRx;
  const qy = (y - 0.45) / bodyRy;
  const qz = z / bodyRz;
  const q2 = qx * qx + qy * qy + qz * qz;
  if (q2 < 2.2) {
    const fall = Math.exp(-q2 * 1.4);
    vy += 14 * qy * fall;
    vz += 14 * qz * fall;
    vx *= 1 - 0.35 * fall;
  }

  // 地面效应：贴近地面法向速度衰减、地板下方加速
  if (y < 0.5) {
    const g = Math.exp(-y * 6);
    vy *= 1 - 0.85 * g;
    const underFloor = Math.abs(z) < 0.95 && x > -2.2 && x < 1.6;
    if (underFloor) vx *= 1 - 0.35 * g;
  }

  // 尾翼梢涡：左右两条反向旋转、沿 +X 拖出的涡
  for (const side of [-1, 1]) {
    const vcX = x - 2.25;
    const vcY = y - 1.02;
    const vcZ = z - side * 0.92;
    const r2 = vcY * vcY + vcZ * vcZ;
    const axial = Math.exp(-Math.max(vcX, -0.4) * 0.55) * (vcX > -0.4 ? 1 : 0);
    const core = Math.exp(-r2 / 0.12) * axial;
    // 涡切向速度（绕 X 轴），两侧反向
    const swirl = 9 * core;
    vy += -side * swirl * (vcZ / (Math.sqrt(r2) + 0.08));
    vz += side * swirl * (vcY / (Math.sqrt(r2) + 0.08));
    // 下洗
    vy -= 3.2 * core;
  }

  // 扩散器上洗与加速
  const dD = Math.hypot(x - 1.9, (y - 0.2) * 1.6, z);
  const dif = Math.exp(-(dD * dD) / 0.5);
  vy += 7 * dif;
  vx -= 5 * dif;

  // 尾迹亏损（车后 x>2.4 的低速区，随距离恢复）
  if (x > 2.3) {
    const wake = Math.exp(-((y - 0.5) ** 2 + z * z) / 1.1) * Math.exp(-(x - 2.3) * 0.5);
    vx *= 1 - 0.55 * wake;
  }

  return [vx, vy, vz];
}

interface GeoPart {
  positions: number[];
  indices: number[];
  region: string;
}

function boxPart(
  w: number,
  h: number,
  d: number,
  pos: [number, number, number],
  rot: [number, number, number],
  region: string,
  seg: [number, number, number] = [1, 1, 1],
  taperNose = false,
): GeoPart {
  const g = new BoxGeometry(w, h, d, seg[0], seg[1], seg[2]);
  if (taperNose) {
    const arr = g.attributes.position as { array: Float32Array; count: number };
    for (let i = 0; i < arr.count; i++) {
      const px = arr.array[i * 3];
      if (px < -w * 0.25) {
        const k = Math.min(1, (-px - w * 0.25) / (w * 0.25));
        arr.array[i * 3 + 1] *= 1 - 0.45 * k;
        arr.array[i * 3 + 2] *= 1 - 0.55 * k;
      }
    }
    g.computeVertexNormals();
  }
  g.rotateX(rot[0]);
  g.rotateY(rot[1]);
  g.rotateZ(rot[2]);
  g.translate(pos[0], pos[1], pos[2]);
  return toPart(g, region);
}

function spherePart(
  r: number,
  pos: [number, number, number],
  scale: [number, number, number],
  region: string,
): GeoPart {
  const g = new SphereGeometry(r, 24, 16);
  g.scale(scale[0], scale[1], scale[2]);
  g.translate(pos[0], pos[1], pos[2]);
  return toPart(g, region);
}

function cylinderPart(
  rTop: number,
  rBot: number,
  h: number,
  pos: [number, number, number],
  rot: [number, number, number],
  region: string,
): GeoPart {
  const g = new CylinderGeometry(rTop, rBot, h, 20, 1);
  g.rotateX(rot[0]);
  g.rotateY(rot[1]);
  g.rotateZ(rot[2]);
  g.translate(pos[0], pos[1], pos[2]);
  return toPart(g, region);
}

function toPart(g: BoxGeometry | SphereGeometry | CylinderGeometry, region: string): GeoPart {
  const p = g.attributes.position.array as Float32Array;
  const idx = g.index!.array as Uint16Array;
  g.dispose();
  return { positions: Array.from(p), indices: Array.from(idx), region };
}

function buildCarParts(): GeoPart[] {
  const parts: GeoPart[] = [];
  // 主车体（车头收窄）
  parts.push(boxPart(5.0, 0.62, 1.8, [-0.1, 0.42, 0], [0, 0, 0], 'body', [14, 2, 4], true));
  // 驾驶舱
  parts.push(spherePart(1, [-0.35, 0.78, 0], [0.95, 0.42, 0.68], 'body'));
  // 前翼
  parts.push(boxPart(0.65, 0.05, 2.05, [-2.45, 0.2, 0], [0, 0, -0.06], 'frontWing'));
  parts.push(boxPart(0.5, 0.3, 0.04, [-2.45, 0.32, 1.02], [0, 0, 0], 'frontWing'));
  parts.push(boxPart(0.5, 0.3, 0.04, [-2.45, 0.32, -1.02], [0, 0, 0], 'frontWing'));
  // 尾翼主翼面 + 端板 + 支架
  parts.push(boxPart(0.55, 0.06, 2.0, [2.2, 1.06, 0], [0, 0, 0.12], 'rearWing'));
  parts.push(boxPart(0.5, 0.34, 0.04, [2.2, 1.12, 1.0], [0, 0, 0.12], 'rearWing'));
  parts.push(boxPart(0.5, 0.34, 0.04, [2.2, 1.12, -1.0], [0, 0, 0.12], 'rearWing'));
  parts.push(boxPart(0.08, 0.42, 0.06, [2.05, 0.82, 0.45], [0, 0, 0], 'rearWing'));
  parts.push(boxPart(0.08, 0.42, 0.06, [2.05, 0.82, -0.45], [0, 0, 0], 'rearWing'));
  // 扩散器（楔形底板 + 导流鳍）
  parts.push(boxPart(1.1, 0.28, 1.7, [1.85, 0.18, 0], [0, 0, -0.18], 'diffuser'));
  for (const z of [-0.6, -0.2, 0.2, 0.6]) {
    parts.push(boxPart(0.9, 0.22, 0.03, [1.9, 0.2, z], [0, 0, -0.1], 'diffuser'));
  }
  // 四个车轮
  for (const wx of [-1.65, 1.55]) {
    for (const wz of [-0.95, 0.95]) {
      parts.push(cylinderPart(0.36, 0.36, 0.3, [wx, 0.36, wz], [Math.PI / 2, 0, 0], 'wheels'));
    }
  }
  return parts;
}

const REGION_NAMES: Record<string, string> = {
  body: '车身',
  frontWing: '前翼',
  rearWing: '尾翼',
  diffuser: '扩散器',
  wheels: '车轮',
};

export function buildSurfaceDataset(): SurfacePressureDataset & { fingerprint: string } {
  const parts = buildCarParts();
  const positions: number[] = [];
  const indices: number[] = [];
  const regions: MeshRegion[] = [];
  const regionOrder: string[] = [];

  for (const part of parts) {
    const base = positions.length / 3;
    positions.push(...part.positions);
    const triStart = indices.length / 3;
    for (const ix of part.indices) indices.push(ix + base);
    const last = regionOrder[regionOrder.length - 1];
    if (last === part.region) {
      const r = regions[regions.length - 1];
      r.triangleCount += part.indices.length / 3;
    } else {
      regionOrder.push(part.region);
      regions.push({
        id: part.region,
        name: REGION_NAMES[part.region] ?? part.region,
        triangleStart: triStart,
        triangleCount: part.indices.length / 3,
      });
    }
  }

  // 每顶点 Cp：由解析流速反推伯努利压力系数
  const cp = new Float32Array(positions.length / 3);
  const vInf2 = FREE_STREAM[0] * FREE_STREAM[0];
  let cpMin = Infinity;
  let cpMax = -Infinity;
  for (let i = 0; i < cp.length; i++) {
    const [vx, vy, vz] = sampleFlow(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2],
    );
    let c = 1 - (vx * vx + vy * vy + vz * vz) / vInf2;
    // 形状修正：朝上的翼面吸力更强、车头正面滞止加压
    c = Math.max(-3, Math.min(1.2, c));
    cp[i] = c;
    cpMin = Math.min(cpMin, c);
    cpMax = Math.max(cpMax, c);
  }

  const posF32 = new Float32Array(positions);
  const idxU32 = new Uint32Array(indices);
  return {
    format: 'aero-surface-pressure',
    version: 1,
    meta: {
      name: '示例赛车 · 表面压力',
      freeStream: { speed: 28, direction: [-1, 0, 0] },
      notes: '程序化生成的演示数据，Cp 由解析流场伯努利近似得到',
      createdAt: new Date().toISOString(),
    },
    geometry: {
      positions: encodeFloat32(posF32),
      indices: encodeUint32(idxU32),
      regions,
    },
    pressure: {
      values: encodeFloat32(cp),
      min: cpMin,
      max: cpMax,
    },
    coefficients: {
      rearWing: { cl: -1.24, cd: 0.182, area: 1.1 },
      diffuser: { cl: -0.93, cd: 0.076, area: 1.87 },
      frontWing: { cl: -0.61, cd: 0.094, area: 1.33 },
      body: { cl: -0.28, cd: 0.315, area: 8.4 },
    },
    fingerprint: fingerprintFloat32(posF32, 7),
  };
}

export const DEFAULT_GRID = {
  size: [64, 34, 48] as [number, number, number], // 104 448 体素，十万级
  origin: [-4.2, -0.3, -3.2] as [number, number, number],
  spacing: [10.4 / 63, 4.3 / 33, 6.4 / 47] as [number, number, number],
};

export function buildVolumeDataset(
  gridSpec = DEFAULT_GRID,
): VelocityVolumeDataset & { fingerprint: string } {
  const [nx, ny, nz] = gridSpec.size;
  const n = nx * ny * nz;
  const vel = new Float32Array(n * 3);
  const scalar = new Float32Array(n);
  const vInf2 = FREE_STREAM[0] * FREE_STREAM[0];
  let maxSpeed = 0;
  let p = 0;
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const x = gridSpec.origin[0] + i * gridSpec.spacing[0];
        const y = gridSpec.origin[1] + j * gridSpec.spacing[1];
        const z = gridSpec.origin[2] + k * gridSpec.spacing[2];
        const [vx, vy, vz] = sampleFlow(x, y, z);
        vel[p] = vx;
        vel[p + 1] = vy;
        vel[p + 2] = vz;
        const sp2 = vx * vx + vy * vy + vz * vz;
        maxSpeed = Math.max(maxSpeed, Math.sqrt(sp2));
        scalar[p / 3] = 1 - sp2 / vInf2;
        p += 3;
      }
    }
  }

  return {
    format: 'aero-velocity-volume',
    version: 1,
    meta: {
      name: '示例赛车 · 空间速度场',
      freeStream: { speed: 28, direction: [-1, 0, 0] },
      notes: `规则网格 ${nx}×${ny}×${nz}，共 ${n.toLocaleString()} 体素`,
      createdAt: new Date().toISOString(),
    },
    grid: { ...gridSpec },
    velocity: {
      values: encodeFloat32(vel),
      maxSpeed,
    },
    scalar: { name: '压力系数 Cp', values: encodeFloat32(scalar) },
    fingerprint: fingerprintFloat32(vel, 13),
  };
}
