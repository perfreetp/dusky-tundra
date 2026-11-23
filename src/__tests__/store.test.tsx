import { describe, it, expect, beforeEach } from 'vitest';
import {
  useAppStore,
  exportShareFile,
  parseShareFile,
  defaultPersistedState,
  MAX_PARTICLES,
} from '../state/store';

describe('状态持久化与分享文件', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.getState().resetAll();
  });

  it('阈值修改后写入 localStorage 并可重新读出', async () => {
    useAppStore.getState().setPressureThreshold({ low: -1.11, high: 0.66 });
    // 持久化是 150ms 节流
    await new Promise((r) => setTimeout(r, 220));
    const raw = localStorage.getItem('aeroflow-viz-state-v1')!;
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.pressure.low).toBeCloseTo(-1.11);
    expect(parsed.pressure.high).toBeCloseTo(0.66);
  });

  it('剖切面/粒子/体渲染更新都被持久化', async () => {
    useAppStore.getState().setClipPlane('yz', { enabled: true, position: 0.23 });
    useAppStore.getState().setParticles({ count: 12345, stepSize: 0.9, trailLength: 18 });
    useAppStore.getState().setVolume({ density: 2.2 });
    useAppStore.getState().setHighlight('rearWing');
    await new Promise((r) => setTimeout(r, 220));
    const parsed = JSON.parse(localStorage.getItem('aeroflow-viz-state-v1')!);
    expect(parsed.clipPlanes.yz.enabled).toBe(true);
    expect(parsed.clipPlanes.yz.position).toBeCloseTo(0.23);
    expect(parsed.particles.count).toBe(12345);
    expect(parsed.volume.density).toBeCloseTo(2.2);
    expect(parsed.highlight).toBe('rearWing');
  });

  it('粒子数被钳制在 0..上限', () => {
    useAppStore.getState().setParticles({ count: 999999 });
    expect(useAppStore.getState().particles.count).toBe(MAX_PARTICLES);
    useAppStore.getState().setParticles({ count: -5 });
    expect(useAppStore.getState().particles.count).toBe(0);
  });

  it('导出 -> 解析分享文件往返一致', () => {
    useAppStore.getState().setPressureThreshold({ low: -0.77 });
    const share = exportShareFile('演示配置');
    const json = JSON.stringify(share);
    const back = parseShareFile(json);
    expect(back.kind).toBe('aeroflow-share');
    expect(back.note).toBe('演示配置');
    expect(back.state.pressure.low).toBeCloseTo(-0.77);
    useAppStore.getState().importState(back.state);
    expect(useAppStore.getState().pressure.low).toBeCloseTo(-0.77);
  });

  it('非法分享文件被拒绝', () => {
    expect(() => parseShareFile(JSON.stringify({ kind: 'nope' }))).toThrow();
  });

  it('相机位姿保存与视角模式', async () => {
    useAppStore.getState().saveCamera([1, 2, 3], [0, 0.5, 0]);
    useAppStore.getState().setView({ mode: 'ground' });
    await new Promise((r) => setTimeout(r, 220));
    const parsed = JSON.parse(localStorage.getItem('aeroflow-viz-state-v1')!);
    expect(parsed.view.cameraPosition).toEqual([1, 2, 3]);
    expect(parsed.view.mode).toBe('ground');
  });

  it('resetAll 恢复默认值', () => {
    useAppStore.getState().setHighlight('diffuser');
    useAppStore.getState().resetAll();
    expect(useAppStore.getState().highlight).toBe(defaultPersistedState.highlight);
    expect(useAppStore.getState().particles.count).toBe(defaultPersistedState.particles.count);
  });
});
