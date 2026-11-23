import { describe, it, expect } from 'vitest';
import { sampleVelocity, sampleScalar, sampleSpeed, volumeBounds, worldToVoxel, type VolumeGrid } from '../render/volumeSampler';

function makeGrid(nx = 4, ny = 3, nz = 2): VolumeGrid {
  const velocities = new Float32Array(nx * ny * nz * 3);
  const scalar = new Float32Array(nx * ny * nz);
  let p = 0;
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        // 线性场 v = (i, 2j, 3k)，插值结果可解析验证
        velocities[p] = i;
        velocities[p + 1] = 2 * j;
        velocities[p + 2] = 3 * k;
        scalar[p / 3] = i + j + k;
        p += 3;
      }
  return {
    size: [nx, ny, nz],
    origin: [0, 0, 0],
    spacing: [1, 1, 1],
    velocities,
    scalar,
    maxSpeed: Math.hypot(nx - 1, 2 * (ny - 1), 3 * (nz - 1)),
  };
}

describe('体积场三线性采样', () => {
  const grid = makeGrid();

  it('网格点上精确取值', () => {
    const out = new Float32Array(new ArrayBuffer(12));
    const v = sampleVelocity(grid, 2, 1, 0, out)!;
    expect(v[0]).toBe(2);
    expect(v[1]).toBe(2);
    expect(v[2]).toBe(0);
  });

  it('体素中心取相邻八点均值', () => {
    const out = new Float32Array(new ArrayBuffer(12));
    const v = sampleVelocity(grid, 0.5, 0.5, 0.5, out)!;
    expect(v[0]).toBeCloseTo(0.5);
    expect(v[1]).toBeCloseTo(1);
    expect(v[2]).toBeCloseTo(1.5);
  });

  it('边界外返回 null', () => {
    const out = new Float32Array(new ArrayBuffer(12));
    expect(sampleVelocity(grid, -0.1, 0, 0, out)).toBeNull();
    expect(sampleVelocity(grid, 0, 0, 1.01, out)).toBeNull();
  });

  it('标量场插值与速度模长', () => {
    expect(sampleScalar(grid, 0.5, 0.5, 0.5)).toBeCloseTo(1.5);
    expect(Number.isNaN(sampleScalar(grid, 5, 5, 5))).toBe(true);
    const out = new Float32Array(new ArrayBuffer(12));
    const s = sampleSpeed(grid, 1, 1, 1, out);
    expect(s).toBeCloseTo(Math.hypot(1, 2, 3));
  });

  it('世界坐标/体素坐标与包围盒互逆', () => {
    const [i, j, k] = worldToVoxel(grid, 2, 1, 0);
    expect([i, j, k]).toEqual([2, 1, 0]);
    const b = volumeBounds(grid);
    expect(b.max).toEqual([3, 2, 1]);
  });
});
