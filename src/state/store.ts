import { createStore, produce } from 'solid-js/store';
import type {
  DisplayMode,
  GridConfig,
  HoverInfo,
  SamplePoint,
  SchemeView,
  Snapshot,
  Speaker,
} from '../types';
import type { CalcResult } from '../acoustics/engine';

let idSeq = 1;
export function nextSpeakerId(): string {
  return `sp-${idSeq++}`;
}

export function makeSpeaker(partial: Partial<Speaker> = {}): Speaker {
  return {
    id: nextSpeakerId(),
    name: `音箱 ${idSeq - 1}`,
    x: 0,
    y: 14,
    z: 0,
    yaw: 0,
    tilt: 25,
    halfAngle: 30,
    spl: 110,
    range: 60,
    ...partial,
  };
}

interface AppState {
  speakers: Speaker[];
  selectedId: string | null;
  displayMode: DisplayMode;
  schemeView: SchemeView;
  grid: GridConfig;
  /** 采样点（由场景层下探生成后写回） */
  points: SamplePoint[];
  pointsVersion: number;
  /** 当前（B 方案）计算结果 */
  result: CalcResult | null;
  computing: boolean;
  /** 正在拖拽音箱（TransformControls），用于调度策略 */
  interacting: boolean;
  hover: HoverInfo | null;
  snapshotA: Snapshot | null;
  importing: boolean;
}

export const DEFAULT_THRESHOLDS: [number, number, number, number, number] = [75, 80, 85, 90, 95];

const initialSpeakers: Speaker[] = [
  makeSpeaker({ name: '音箱 1', x: -35, y: 16, z: -55, yaw: 35, tilt: 30 }),
  makeSpeaker({ name: '音箱 2', x: 35, y: 16, z: -55, yaw: -35, tilt: 30 }),
  makeSpeaker({ name: '音箱 3', x: 0, y: 18, z: 58, yaw: 180, tilt: 28 }),
];

export const [store, setStore] = createStore<AppState>({
  speakers: initialSpeakers,
  selectedId: initialSpeakers[0]?.id ?? null,
  displayMode: 'absolute',
  schemeView: 'B',
  grid: {
    density: 'medium',
    airAbsorption: false,
    thresholds: [...DEFAULT_THRESHOLDS] as [number, number, number, number, number],
  },
  points: [],
  pointsVersion: 0,
  result: null,
  computing: false,
  interacting: false,
  hover: null,
  snapshotA: null,
  importing: false,
});

/* ---------------- actions ---------------- */

export function addSpeaker(): void {
  const n = store.speakers.length;
  const sp = makeSpeaker({
    name: `音箱 ${n + 1}`,
    x: ((n % 5) - 2) * 12,
    z: -40 - (n % 3) * 8,
  });
  setStore('speakers', (list) => [...list, sp]);
  setStore('selectedId', sp.id);
}

export function removeSpeaker(id: string): void {
  setStore(
    'speakers',
    produce((list) => {
      const idx = list.findIndex((s) => s.id === id);
      if (idx >= 0) list.splice(idx, 1);
    }),
  );
  if (store.selectedId === id) {
    setStore('selectedId', store.speakers[0]?.id ?? null);
  }
}

export function selectSpeaker(id: string | null): void {
  setStore('selectedId', id);
}

export function updateSpeaker(id: string, patch: Partial<Speaker>): void {
  setStore(
    'speakers',
    (s) => s.id === id,
    produce((sp) => Object.assign(sp, patch)),
  );
}

export function setSchemeView(view: SchemeView): void {
  setStore('schemeView', view);
  if (view === 'diff') {
    setStore('displayMode', 'diff');
  } else if (store.displayMode === 'diff') {
    setStore('displayMode', 'absolute');
  }
}

export function setDisplayMode(mode: DisplayMode): void {
  setStore('displayMode', mode);
  // 隔离/绝对模式属于 B 方案视图，自动退出差值视图
  if (mode !== 'diff' && store.schemeView === 'diff') {
    setStore('schemeView', 'B');
  }
}

export function setDensity(density: GridConfig['density']): void {
  setStore('grid', 'density', density);
}

export function setAirAbsorption(on: boolean): void {
  setStore('grid', 'airAbsorption', on);
}

export function setThreshold(index: number, value: number): void {
  setStore(
    'grid',
    'thresholds',
    produce((arr) => {
      arr[index] = value;
    }),
  );
}

export function setPoints(points: SamplePoint[]): void {
  setStore(produce((s) => {
    s.points = points;
    s.pointsVersion += 1;
    s.snapshotA = null; // 网格变化后旧快照失效
  }));
}

export function setResult(result: CalcResult | null): void {
  setStore('result', result);
}

export function setComputing(v: boolean): void {
  setStore('computing', v);
}

export function setInteracting(v: boolean): void {
  setStore('interacting', v);
}

export function setHover(h: HoverInfo | null): void {
  setStore('hover', h);
}

export function setImporting(v: boolean): void {
  setStore('importing', v);
}

export function captureSnapshotA(): void {
  if (!store.result) return;
  const r = store.result;
  setStore('snapshotA', {
    speakers: store.speakers.map((s) => ({ ...s })),
    total: Float32Array.from(r.total),
    pointCount: r.pointCount,
    speakerCount: r.speakerCount,
    createdAt: Date.now(),
  });
}

export function clearSnapshotA(): void {
  setStore('snapshotA', null);
  if (store.schemeView !== 'B') setStore('schemeView', 'B');
}

export function selectedSpeaker(): Speaker | undefined {
  return store.speakers.find((s) => s.id === store.selectedId);
}
