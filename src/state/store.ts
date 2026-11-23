/**
 * 全局视图状态。持久化策略：
 *  - 所有阈值/开关/视角参数变化时节流写入 localStorage（key 带版本号）
 *  - 相机位姿单独高频节流（rAF 循环里调用 saveCamera）
 *  - 导出分享文件 = 持久化状态 + 数据指纹；导入时校验指纹，数据不一致只给出警告
 */

import { create } from 'zustand';

export type ViewMode = 'free' | 'ground';
export type RegionId = 'none' | 'rearWing' | 'diffuser';
export type AxisId = 'yz' | 'zx' | 'xy';

export interface ClipPlaneState {
  enabled: boolean;
  /** 归一化位置 0..1（沿该轴在体数据包围盒内） */
  position: number;
}

export interface PersistedState {
  version: 1;
  pressure: {
    /** 色带阈值，实际 Cp 值；区间外的片元被隐藏 */
    low: number;
    high: number;
    bandMode: 'clamp' | 'hide';
    opacity: number;
  };
  clipPlanes: Record<AxisId, ClipPlaneState>;
  particles: {
    enabled: boolean;
    count: number;
    /** 推进步长（世界单位/帧的基准系数） */
    stepSize: number;
    /** 拖尾长度（历史点数） */
    trailLength: number;
    /** 撒播区域：车身关键区域 id 列表 */
    seedRegions: RegionId[];
  };
  volume: {
    enabled: boolean;
    /** 光线步进最大步数 */
    maxSteps: number;
    /** 密度系数 */
    density: number;
    /** 不透明度上限 */
    alphaScale: number;
  };
  view: {
    mode: ViewMode;
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    groundHeight: number;
  };
  highlight: RegionId;
  datasetFingerprints: {
    surface: string | null;
    volume: string | null;
  };
  loadedDatasetName: string | null;
}

export const MAX_PARTICLES = 20000;

export const defaultPersistedState: PersistedState = {
  version: 1,
  pressure: {
    low: -2.5,
    high: 1.2,
    bandMode: 'hide',
    opacity: 1,
  },
  clipPlanes: {
    yz: { enabled: false, position: 0.5 },
    zx: { enabled: false, position: 0.5 },
    xy: { enabled: false, position: 0.5 },
  },
  particles: {
    enabled: true,
    count: 8000,
    stepSize: 0.5,
    trailLength: 24,
    seedRegions: ['rearWing', 'diffuser'],
  },
  volume: {
    enabled: true,
    maxSteps: 96,
    density: 1.1,
    alphaScale: 0.55,
  },
  view: {
    mode: 'free',
    cameraPosition: [6, 3.2, 7.5],
    cameraTarget: [0, 0.5, 0],
    groundHeight: 0,
  },
  highlight: 'none',
  datasetFingerprints: { surface: null, volume: null },
  loadedDatasetName: null,
};

const STORAGE_KEY = 'aeroflow-viz-state-v1';

export interface ShareFile {
  kind: 'aeroflow-share';
  shareVersion: 1;
  exportedAt: string;
  note?: string;
  state: PersistedState;
}

interface AppStore extends PersistedState {
  /** 载入数据后按数据范围收敛阈值 */
  setPressureRange: (min: number, max: number) => void;
  setPressureThreshold: (patch: Partial<PersistedState['pressure']>) => void;
  setClipPlane: (axis: AxisId, patch: Partial<ClipPlaneState>) => void;
  setParticles: (patch: Partial<PersistedState['particles']>) => void;
  setVolume: (patch: Partial<PersistedState['volume']>) => void;
  setView: (patch: Partial<PersistedState['view']>) => void;
  saveCamera: (position: [number, number, number], target: [number, number, number]) => void;
  setHighlight: (r: RegionId) => void;
  setFingerprints: (fp: Partial<PersistedState['datasetFingerprints']>, name: string | null) => void;
  importState: (s: PersistedState) => void;
  resetAll: () => void;
}

function loadInitial(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultPersistedState);
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.version !== 1) return structuredClone(defaultPersistedState);
    // 合并默认值，兼容后续新增字段
    return {
      ...structuredClone(defaultPersistedState),
      ...parsed,
      pressure: { ...defaultPersistedState.pressure, ...parsed.pressure },
      clipPlanes: { ...defaultPersistedState.clipPlanes, ...parsed.clipPlanes },
      particles: { ...defaultPersistedState.particles, ...parsed.particles },
      volume: { ...defaultPersistedState.volume, ...parsed.volume },
      view: { ...defaultPersistedState.view, ...parsed.view },
      datasetFingerprints: { ...defaultPersistedState.datasetFingerprints, ...parsed.datasetFingerprints },
    };
  } catch {
    return structuredClone(defaultPersistedState);
  }
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePersist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      const s = useAppStore.getState();
      const { ...rest } = s;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripStore(rest)));
    } catch {
      // 隐私模式/配额不足时静默降级，内存状态仍可用
    }
  }, 150);
}

function stripStore(s: Record<string, unknown>): PersistedState {
  const copy: Record<string, unknown> = {};
  for (const k of Object.keys(defaultPersistedState)) copy[k] = s[k];
  return copy as unknown as PersistedState;
}

export const useAppStore = create<AppStore>((set) => ({
  ...loadInitial(),

  setPressureRange: (min, max) =>
    set((st) => ({
      pressure: {
        ...st.pressure,
        low: Math.max(min, Math.min(st.pressure.low, max)),
        high: Math.min(max, Math.max(st.pressure.high, min)),
      },
    })),

  setPressureThreshold: (patch) => {
    set((st) => ({ pressure: { ...st.pressure, ...patch } }));
    schedulePersist();
  },

  setClipPlane: (axis, patch) => {
    set((st) => ({ clipPlanes: { ...st.clipPlanes, [axis]: { ...st.clipPlanes[axis], ...patch } } }));
    schedulePersist();
  },

  setParticles: (patch) => {
    set((st) => ({
      particles: {
        ...st.particles,
        ...patch,
        count: Math.min(MAX_PARTICLES, Math.max(0, Math.round(patch.count ?? st.particles.count))),
      },
    }));
    schedulePersist();
  },

  setVolume: (patch) => {
    set((st) => ({ volume: { ...st.volume, ...patch } }));
    schedulePersist();
  },

  setView: (patch) => {
    set((st) => ({ view: { ...st.view, ...patch } }));
    schedulePersist();
  },

  saveCamera: (cameraPosition, cameraTarget) => {
    set((st) => ({ view: { ...st.view, cameraPosition, cameraTarget } }));
    schedulePersist();
  },

  setHighlight: (r) => {
    set({ highlight: r });
    schedulePersist();
  },

  setFingerprints: (fp, name) => {
    set((st) => ({
      datasetFingerprints: { ...st.datasetFingerprints, ...fp },
      loadedDatasetName: name ?? st.loadedDatasetName,
    }));
    schedulePersist();
  },

  importState: (s) => {
    set({ ...structuredClone(defaultPersistedState), ...structuredClone(s) });
    schedulePersist();
  },

  resetAll: () => {
    set(structuredClone(defaultPersistedState));
    schedulePersist();
  },
}));

export function exportShareFile(note?: string): ShareFile {
  const s = useAppStore.getState();
  return {
    kind: 'aeroflow-share',
    shareVersion: 1,
    exportedAt: new Date().toISOString(),
    note,
    state: stripStore(s as unknown as Record<string, unknown>),
  };
}

export function parseShareFile(json: string): ShareFile {
  const obj = JSON.parse(json) as ShareFile;
  if (obj.kind !== 'aeroflow-share' || obj.shareVersion !== 1 || !obj.state) {
    throw new Error('不是有效的 AeroFlow 分享文件');
  }
  return obj;
}
