import { describe, it, expect } from 'vitest';
import { buildSurfaceDataset, buildVolumeDataset, sampleFlow, DEFAULT_GRID } from '../data/sampleGenerator';
import { decodeSurface, decodeVolume } from '../data/loader';

describe('示例数据生成器', () => {
  it('表面数据：区域、Cp 范围与解码一致', () => {
    const raw = buildSurfaceDataset();
    const s = decodeSurface(raw);
    expect(s.positions.length / 3).toBeGreaterThan(100);
    expect(s.indices!.length % 3).toBe(0);
    expect(s.cp.length).toBe(s.positions.length / 3);
    const regionIds = s.dataset.geometry.regions!.map((r) => r.id);
    expect(regionIds).toContain('rearWing');
    expect(regionIds).toContain('diffuser');
    // group 三角形区间连续且覆盖全部索引
    const triCount = s.indices!.length / 3;
    let covered = 0;
    for (const r of s.dataset.geometry.regions!) {
      expect(r.triangleStart).toBe(covered);
      covered += r.triangleCount;
    }
    expect(covered).toBe(triCount);
    expect(s.cpMin).toBeLessThan(0); // 存在吸力面
    expect(s.cpMax).toBeGreaterThan(0.4); // 存在滞止高压
    expect(s.dataset.coefficients!.rearWing.cl).toBeLessThan(0); // 下压力为负 Cl
  });

  it('体数据：十万级体素、速度非零、标量长度匹配', () => {
    const raw = buildVolumeDataset();
    const v = decodeVolume(raw);
    const [nx, ny, nz] = DEFAULT_GRID.size;
    expect(v.grid.velocities.length).toBe(nx * ny * nz * 3);
    expect(nx * ny * nz).toBeGreaterThanOrEqual(100000);
    expect(v.scalar!.length).toBe(nx * ny * nz);
    expect(v.grid.maxSpeed).toBeGreaterThan(20);
  });

  it('解析流场在尾翼区存在旋转结构（横向速度分量非零）', () => {
    const [, vy1, vz1] = sampleFlow(3.0, 1.02, 0.92);
    expect(Math.abs(vy1) + Math.abs(vz1)).toBeGreaterThan(0.5);
  });

  it('两种数据指纹均非空且不同', () => {
    const a = buildSurfaceDataset().fingerprint;
    const b = buildVolumeDataset().fingerprint;
    expect(a.length).toBeGreaterThan(10);
    expect(a).not.toBe(b);
  });
});
