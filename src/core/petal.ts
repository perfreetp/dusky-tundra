import type { PetalParams } from '../types';
import { clamp, lerp } from './mathUtils';

/**
 * 参数化花瓣曲面
 *
 * 局部坐标系（花瓣未做任何旋转时）：
 *   u ∈ [-1, 1] 横向（宽度方向），v ∈ [0, 1] 纵向（基部 → 顶端）
 *   x = 横向偏移，y = 沿花瓣长度方向，z = 曲面法向鼓起（带卷边）
 *
 * 弯曲 bend(v) 与卷边 curl(v) 均为 4 控制点 Catmull-Rom 样条，
 * 可在品种页调整。
 */

function catmull1D(p: [number, number, number, number], t: number): number {
  const x = clamp(t, 0, 1);
  const i = x < 1 ? Math.floor(x * 3) : 2;
  const s = x < 1 ? x * 3 - i : 1;
  const p0 = p[Math.max(0, i - 1)];
  const p1 = p[i];
  const p2 = p[Math.min(3, i + 1)];
  const p3 = p[Math.min(3, i + 2)];
  const s2 = s * s;
  const s3 = s2 * s;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * s +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * s2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * s3)
  );
}

export interface PetalSurfacePoint {
  x: number;
  y: number;
  z: number;
}

export interface PetalSurfaceOptions {
  /** 开放度附加弯曲：负值让花瓣向内抱合（花苞），正值让瓣尖向外反卷（盛开） */
  openBend?: number;
  /** 开放度附加卷边 */
  openCurl?: number;
}

/** 单片花瓣曲面采样 */
export function samplePetal(
  params: PetalParams,
  u: number,
  v: number,
  out: PetalSurfacePoint = { x: 0, y: 0, z: 0 },
  options: PetalSurfaceOptions = {}
): PetalSurfacePoint {
  // 宽度包络：基部收窄、中上部最宽、顶端圆头微收；保留最小宽度避免零面积退化三角形
  const envelope = Math.max(0.08, Math.sin(Math.PI * clamp(v, 0, 1)) ** 0.7 * (1 - 0.25 * v));
  const halfW = params.width * 0.5 * envelope;
  const x = u * halfW;

  // 中线纵向位置
  const y = params.length * v;

  // 弯曲：样条弯曲 + 开放度驱动的瓣尖反卷（v² 加权，基部不动）
  const openBend = (options.openBend ?? 0) * v * v;
  const bend = catmull1D(params.bend, v) * params.length + openBend * params.length;

  // 卷边：仅边缘生效，中线为 0，向两侧平滑增大（u² 处处可导，避免中缝法线退化）
  const edge = u * u;
  const openCurl = (options.openCurl ?? 0) * v;
  const curl =
    (catmull1D(params.curl, v) + openCurl) * params.width * 0.5 * edge;

  // 横向轻微杯状鼓起，让花瓣不是平板
  const cup = 0.12 * params.width * (1 - u * u) * Math.sin(Math.PI * v);

  out.x = x;
  out.y = y;
  out.z = bend + curl + cup;
  return out;
}

export interface PetalGeometryData {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  vertexCount: number;
}

/** 生成单片花瓣的三角形网格（平面着色所需法线由解析差分近似） */
export function buildPetalGeometry(
  params: PetalParams,
  options: PetalSurfaceOptions = {}
): PetalGeometryData {
  const nu = params.segU;
  const nv = params.segV;
  const row = nu + 1;
  const vertexCount = row * (nv + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const epsV = 1 / nv;

  const p = { x: 0, y: 0, z: 0 };
  const tmp = { x: 0, y: 0, z: 0 };
  const pV1 = { x: 0, y: 0, z: 0 };
  const pV0 = { x: 0, y: 0, z: 0 };

  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    for (let i = 0; i <= nu; i++) {
      const u = -1 + (2 * i) / nu;
      const idx = j * row + i;
      samplePetal(params, u, v, p, options);
      positions[idx * 3] = p.x;
      positions[idx * 3 + 1] = p.y;
      positions[idx * 3 + 2] = p.z;
      uvs[idx * 2] = (u + 1) / 2;
      uvs[idx * 2 + 1] = v;
    }
  }

  const normals = new Float32Array(vertexCount * 3);
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    for (let i = 0; i <= nu; i++) {
      const u = -1 + (2 * i) / nu;
      samplePetal(params, u, v, tmp, options);
      // 解析偏导，避免有限差分在 u=±1 / v=1 边界钳制后退化
      const env = Math.sin(Math.PI * clamp(v, 0, 1)) ** 0.7 * (1 - 0.25 * v);
      const halfW = params.width * 0.5 * env;
      const openCurl = (options.openCurl ?? 0) * v;

      // dP/du：x 方向线性变化，z 仅卷边项随 u 变化
      const dEdgeDu = 2 * u;
      const tux = halfW;
      const tuy = 0;
      const tuz =
        (catmull1D(params.curl, v) + openCurl) * params.width * 0.5 * dEdgeDu -
        0.24 * params.width * u * Math.sin(Math.PI * v);

      // dP/dv：包络宽度与杯状鼓起的纵向变化（中心差分，v 方向不做钳制退化）
      const v1 = clamp(v + epsV, 0, 1);
      const v0 = clamp(v - epsV, 0, 1);
      samplePetal(params, u, v1, pV1, options);
      samplePetal(params, u, v0, pV0, options);
      const span = v1 - v0 || 1;
      const tvx = (pV1.x - pV0.x) / span;
      const tvy = params.length;
      const tvz = (pV1.z - pV0.z) / span;

      // 法线 = tv × tu，使法线朝 +z
      let nx = tvy * tuz - tuy * tvz;
      let ny = tuy * tvx - tux * tvz;
      let nz = tux * tvy - tuy * tvx;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;
      const idx = j * row + i;
      normals[idx * 3] = nx;
      normals[idx * 3 + 1] = ny;
      normals[idx * 3 + 2] = nz;
    }
  }

  const indices = new Uint32Array(nu * nv * 6);
  let k = 0;
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * row + i;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      // 绕序使面法线朝 +z（花瓣外侧/受光面），与解析法线方向一致
      indices[k++] = a;
      indices[k++] = b;
      indices[k++] = c;
      indices[k++] = b;
      indices[k++] = d;
      indices[k++] = c;
    }
  }

  return { positions, normals, uvs, indices, vertexCount };
}

/**
 * 一朵花的布局描述（与开放度无关的静态部分）：
 * 每层花瓣的方位角、倾角基数、尺寸梯度，以及萼片布局。
 */
export interface CorollaLayout {
  layers: {
    count: number;
    /** 每片花瓣的绕轴方位角 */
    azimuths: number[];
    /** 层间尺寸缩放（内层小、外层大） */
    sizeScale: number;
    /** 层高度（内层稍高，形成花心包裹） */
    height: number;
    /** 倾角附加偏置（度） */
    tiltBias: number;
  }[];
  sepalCount: number;
  sepalAzimuths: number[];
}

export function buildCorollaLayout(params: PetalParams, rng: () => number): CorollaLayout {
  const layers: CorollaLayout['layers'] = [];
  for (let L = 0; L < params.layers; L++) {
    const t = params.layers === 1 ? 0 : L / (params.layers - 1); // 0 内层 → 1 外层
    const count = Math.round(params.petalsPerLayer * (0.62 + 0.55 * t));
    const azimuths: number[] = [];
    const phase = rng() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      azimuths.push((i / count) * Math.PI * 2 + phase + (rng() - 0.5) * 0.12);
    }
    layers.push({
      count,
      azimuths,
      sizeScale: lerp(0.45, 1, t),
      height: lerp(0.16, 0, t) * params.length,
      tiltBias: lerp(8, -6, t),
    });
  }
  const sepalCount = 5;
  const sepalAzimuths: number[] = [];
  const sp = rng() * Math.PI * 2;
  for (let i = 0; i < sepalCount; i++) {
    sepalAzimuths.push((i / sepalCount) * Math.PI * 2 + sp);
  }
  return { layers, sepalCount, sepalAzimuths };
}

/** 统计一朵花的花瓣实例总数（实例化分配用） */
export function countPetals(layout: CorollaLayout): number {
  return layout.layers.reduce((sum, l) => sum + l.count, 0);
}
