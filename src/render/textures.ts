/**
 * 体纹理构建：
 *  - velocityTexture: Data3DTexture，RGBA32F，rgb=速度、a=速率（归一化 0..1）
 *  - scalarTexture:   Data3DTexture，R32F（可选），存 Cp 等标量
 *  - speedLUT / pressureLUT: 1D DataTexture，着色器采样色带
 *
 * 纹理采用 clamp 边界，体素中心采样约定（着色器里 uv 先减半格）。
 */

import {
  Data3DTexture,
  DataTexture,
  RedFormat,
  RGBAFormat,
  FloatType,
  ClampToEdgeWrapping,
  LinearFilter,
  NearestFilter,
  SRGBColorSpace,
} from 'three';
import type { VolumeGrid } from './volumeSampler';
import { buildPressureLUT, buildSpeedLUT } from './colormap';

export interface VolumeTextures {
  velocity: Data3DTexture;
  scalar: Data3DTexture | null;
  /** 体数据世界包围盒（体素中心范围） */
  worldMin: [number, number, number];
  worldMax: [number, number, number];
  /** 归一化用最大速率 */
  maxSpeed: number;
  voxelCount: number;
}

export function buildVolumeTextures(grid: VolumeGrid): VolumeTextures {
  const [nx, ny, nz] = grid.size;
  const count = nx * ny * nz;
  const rgba = new Float32Array(count * 4);
  const maxSpeed = grid.maxSpeed || 1;
  const v = grid.velocities;
  for (let i = 0, o = 0; i < count; i++, o += 4) {
    rgba[o] = v[i * 3];
    rgba[o + 1] = v[i * 3 + 1];
    rgba[o + 2] = v[i * 3 + 2];
    rgba[o + 3] = Math.min(1, Math.hypot(v[i * 3], v[i * 3 + 1], v[i * 3 + 2]) / maxSpeed);
  }
  const velocity = new Data3DTexture(rgba, nx, ny, nz);
  velocity.format = RGBAFormat;
  velocity.type = FloatType;
  velocity.wrapR = ClampToEdgeWrapping;
  velocity.wrapS = ClampToEdgeWrapping;
  velocity.wrapT = ClampToEdgeWrapping;
  velocity.magFilter = LinearFilter;
  velocity.minFilter = LinearFilter;
  velocity.needsUpdate = true;

  let scalar: Data3DTexture | null = null;
  if (grid.scalar) {
    const r32 = new Float32Array(count);
    r32.set(grid.scalar);
    scalar = new Data3DTexture(r32, nx, ny, nz);
    scalar.format = RedFormat;
    scalar.type = FloatType;
    scalar.wrapR = ClampToEdgeWrapping;
    scalar.wrapS = ClampToEdgeWrapping;
    scalar.wrapT = ClampToEdgeWrapping;
    scalar.magFilter = LinearFilter;
    scalar.minFilter = LinearFilter;
    scalar.needsUpdate = true;
  }

  const worldMin: [number, number, number] = [...grid.origin];
  const worldMax: [number, number, number] = [
    grid.origin[0] + (nx - 1) * grid.spacing[0],
    grid.origin[1] + (ny - 1) * grid.spacing[1],
    grid.origin[2] + (nz - 1) * grid.spacing[2],
  ];

  return { velocity, scalar, worldMin, worldMax, maxSpeed, voxelCount: count };
}

export function buildLutTextures(): { speedLUT: DataTexture; pressureLUT: DataTexture } {
  const speedLUT = new DataTexture(buildSpeedLUT(256), 256, 1, RGBAFormat);
  speedLUT.wrapS = ClampToEdgeWrapping;
  speedLUT.magFilter = LinearFilter;
  speedLUT.minFilter = NearestFilter;
  speedLUT.colorSpace = SRGBColorSpace;
  speedLUT.needsUpdate = true;

  const pressureLUT = new DataTexture(buildPressureLUT(256), 256, 1, RGBAFormat);
  pressureLUT.wrapS = ClampToEdgeWrapping;
  pressureLUT.magFilter = LinearFilter;
  pressureLUT.minFilter = NearestFilter;
  pressureLUT.colorSpace = SRGBColorSpace;
  pressureLUT.needsUpdate = true;

  return { speedLUT, pressureLUT };
}
