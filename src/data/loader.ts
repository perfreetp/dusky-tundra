/**
 * JSON 数据导入：解析、基础校验、解码为类型化数组。
 * 支持单文件（一个数据集）与打包文件（surface + volume 两个数据集的数组）。
 */

import type {
  AnyAeroDataset,
  SurfacePressureDataset,
  VelocityVolumeDataset,
} from '../types/dataset';
import { asFloat32, asUint32, fingerprintFloat32 } from './encoding';
import type { VolumeGrid } from '../render/volumeSampler';

export interface LoadedSurface {
  dataset: SurfacePressureDataset;
  positions: Float32Array;
  indices: Uint32Array | null;
  cp: Float32Array;
  cpMin: number;
  cpMax: number;
  fingerprint: string;
}

export interface LoadedVolume {
  dataset: VelocityVolumeDataset;
  grid: VolumeGrid;
  scalar: Float32Array | null;
  fingerprint: string;
}

export async function parseDatasets(file: File | Blob): Promise<AnyAeroDataset[]> {
  const text = await file.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`JSON 解析失败：${(e as Error).message}`);
  }
  if (Array.isArray(json)) {
    return json.map((j) => validate(j as AnyAeroDataset));
  }
  return [validate(json as AnyAeroDataset)];
}

function validate(d: AnyAeroDataset): AnyAeroDataset {
  if (!d || typeof d !== 'object' || typeof (d as { format?: unknown }).format !== 'string') {
    throw new Error('数据缺少 format 字段');
  }
  if (d.format === 'aero-surface-pressure') return d;
  if (d.format === 'aero-velocity-volume') return d;
  throw new Error(`未知数据格式：${(d as { format: string }).format}`);
}

export function decodeSurface(dataset: SurfacePressureDataset): LoadedSurface {
  const positions = asFloat32(dataset.geometry.positions);
  if (positions.length % 3 !== 0) throw new Error('表面 positions 长度必须是 3 的倍数');
  const indices = dataset.geometry.indices ? asUint32(dataset.geometry.indices) : null;
  if (indices && indices.length % 3 !== 0) throw new Error('表面 indices 长度必须是 3 的倍数');
  const cp = asFloat32(dataset.pressure.values);
  if (cp.length !== positions.length / 3) {
    throw new Error(
      `压力值数量 ${cp.length} 与顶点数 ${positions.length / 3} 不一致`,
    );
  }
  let cpMin = dataset.pressure.min ?? Infinity;
  let cpMax = dataset.pressure.max ?? -Infinity;
  if (!Number.isFinite(cpMin) || !Number.isFinite(cpMax)) {
    cpMin = Infinity;
    cpMax = -Infinity;
    for (let i = 0; i < cp.length; i++) {
      if (cp[i] < cpMin) cpMin = cp[i];
      if (cp[i] > cpMax) cpMax = cp[i];
    }
  }
  return {
    dataset,
    positions,
    indices,
    cp,
    cpMin,
    cpMax,
    fingerprint: fingerprintFloat32(positions, 7),
  };
}

export function decodeVolume(dataset: VelocityVolumeDataset): LoadedVolume {
  const [nx, ny, nz] = dataset.grid.size;
  const expected = nx * ny * nz * 3;
  const velocities = asFloat32(dataset.velocity.values);
  if (velocities.length !== expected) {
    throw new Error(`速度场长度 ${velocities.length} 与网格 ${nx}×${ny}×${nz}×3 不匹配`);
  }
  const scalar = dataset.scalar ? asFloat32(dataset.scalar.values) : null;
  if (scalar && scalar.length !== nx * ny * nz) {
    throw new Error('标量场长度与体素数不一致');
  }
  let maxSpeed = dataset.velocity.maxSpeed ?? 0;
  if (!maxSpeed) {
    for (let i = 0; i < velocities.length; i += 3) {
      const s = Math.hypot(velocities[i], velocities[i + 1], velocities[i + 2]);
      if (s > maxSpeed) maxSpeed = s;
    }
  }
  return {
    dataset,
    grid: {
      size: [nx, ny, nz],
      origin: [...dataset.grid.origin] as [number, number, number],
      spacing: [...dataset.grid.spacing] as [number, number, number],
      velocities,
      scalar,
      maxSpeed,
    },
    scalar,
    fingerprint: fingerprintFloat32(velocities, 13),
  };
}
