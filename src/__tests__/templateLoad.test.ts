import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { decodeSurface, decodeVolume, parseDatasets } from '../data/loader';
import { isSurfaceDataset, isVolumeDataset, type SurfacePressureDataset, type VelocityVolumeDataset } from '../types/dataset';

// 直接读取 generate-template 产物的等价内存对象（测试环境不读 public 静态目录）
import { buildSurfaceDataset, buildVolumeDataset } from '../data/sampleGenerator';

describe('模板数据加载往返', () => {
  it('表面数据集可解码且区域/系数完整', () => {
    const raw = buildSurfaceDataset();
    const blob = new Blob([JSON.stringify(raw)], { type: 'application/json' });
    return parseDatasets(blob).then((datasets) => {
      expect(datasets.length).toBe(1);
      expect(isSurfaceDataset(datasets[0])).toBe(true);
      const s = decodeSurface(datasets[0] as SurfacePressureDataset);
      expect(s.cp.length).toBe(s.positions.length / 3);
      expect(s.dataset.coefficients!.rearWing.cd).toBeGreaterThan(0);
      expect(s.fingerprint.length).toBeGreaterThan(10);
    });
  });

  it('速度场数据集可解码且三线性采样在界内有效', async () => {
    const raw = buildVolumeDataset();
    const blob = new Blob([JSON.stringify(raw)], { type: 'application/json' });
    const datasets = await parseDatasets(blob);
    expect(isVolumeDataset(datasets[0])).toBe(true);
    const v = decodeVolume(datasets[0] as VelocityVolumeDataset);
    expect(v.grid.velocities.length).toBe(v.grid.size.reduce((a, b) => a * b, 1) * 3);
    expect(v.scalar).not.toBeNull();
  });

  it('打包数组（surface+volume）可一次解析归类', async () => {
    const bundle = [buildSurfaceDataset(), buildVolumeDataset()];
    const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
    const datasets = await parseDatasets(blob);
    expect(datasets.length).toBe(2);
    expect(isSurfaceDataset(datasets[0])).toBe(true);
    expect(isVolumeDataset(datasets[1])).toBe(true);
  });

  it('生成的 public 模板文件是合法 JSON 且带正确 format', () => {
    const text = readFileSync('public/sample-data/surface-pressure.json', 'utf-8');
    const obj = JSON.parse(text);
    expect(obj.format).toBe('aero-surface-pressure');
    const vol = JSON.parse(readFileSync('public/sample-data/velocity-volume.json', 'utf-8'));
    expect(vol.format).toBe('aero-velocity-volume');
  });
});
