import { computed, reactive, readonly } from 'vue';
import type {
  Branch,
  GddConfig,
  HarvestWindow,
  SchemeFile,
  Variety
} from './types';
import { DEFAULT_VARIETIES } from './core/varieties';
import { MonotoneCurve, makeRng } from './core/mathUtils';

interface StoreState {
  varieties: Variety[];
  activeVarietyId: string;
  branches: Branch[];
  gdd: GddConfig;
  harvest: HarvestWindow;
  timelineGdd: number;
  playing: boolean;
  playbackSpeed: number;
}

const state = reactive<StoreState>({
  varieties: cloneData(DEFAULT_VARIETIES),
  activeVarietyId: DEFAULT_VARIETIES[0].id,
  branches: [],
  gdd: {
    dailyAvgTemp: 22,
    baseTemp: 10,
    days: 55
  },
  harvest: {
    openMin: 0.35,
    openMax: 0.7
  },
  timelineGdd: 0,
  playing: false,
  playbackSpeed: 1
});

let nextBranchId = 1;

/** 纯数据深拷贝：JSON 往返可剥离 Vue readonly/reactive 代理，structuredClone 对代理会抛错 */
function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** 当前积温（日平均温 − 生物学零度）× 累积天数 */
const totalGdd = computed(() =>
  Math.max(0, (state.gdd.dailyAvgTemp - state.gdd.baseTemp) * state.gdd.days)
);

const activeVariety = computed<Variety>(
  () => state.varieties.find((v) => v.id === state.activeVarietyId) ?? state.varieties[0]
);

const activeCurve = computed(() => new MonotoneCurve(activeVariety.value.curve));

/** 采收窗口：按开放度阈值反推积温，再换算为发育天数与日历日期 */
const harvestWindowGdd = computed(() => {
  const curve = activeCurve.value;
  const gddMin = curve.invert(state.harvest.openMin);
  const gddMax = curve.invert(state.harvest.openMax);
  const dailyGain = Math.max(0.1, state.gdd.dailyAvgTemp - state.gdd.baseTemp);
  return {
    gddMin,
    gddMax,
    dayMin: gddMin === null ? null : gddMin / dailyGain,
    dayMax: gddMax === null ? null : gddMax / dailyGain
  };
});

function setActiveVariety(id: string): void {
  state.activeVarietyId = id;
}

function updateActiveVariety(patch: Partial<Variety>): void {
  const v = state.varieties.find((x) => x.id === state.activeVarietyId);
  if (!v) return;
  Object.assign(v, patch);
}

function updatePetal(patch: Partial<Variety['petal']>): void {
  const v = activeVariety.value;
  Object.assign(v.petal, patch);
  // 层数限制 5~9
  v.petal.layers = Math.min(9, Math.max(5, v.petal.layers));
}

function updatePetalControl(kind: 'bend' | 'curl', index: number, value: number): void {
  const v = activeVariety.value;
  v.petal[kind][index] = value;
}

function updateColor(which: 'deep' | 'pale', rgb: { x: number; y: number; z: number }): void {
  activeVariety.value.color[which] = rgb;
}

function updateCurvePoint(index: number, patch: Partial<{ gdd: number; open: number }>): void {
  const curve = activeVariety.value.curve;
  if (!curve[index]) return;
  Object.assign(curve[index], patch);
}

function insertCurvePoint(gdd: number, open: number): void {
  const curve = activeVariety.value.curve;
  curve.push({ gdd: Math.max(0, gdd), open: Math.min(1, Math.max(0, open)) });
  curve.sort((a, b) => a.gdd - b.gdd);
}

function removeCurvePoint(index: number): void {
  const curve = activeVariety.value.curve;
  if (curve.length <= 2) return;
  curve.splice(index, 1);
}

function addVariety(): string {
  const src = activeVariety.value;
  const id = `var-${Date.now().toString(36)}`;
  const clone: Variety = cloneData(src);
  clone.id = id;
  clone.name = `${src.name} · 副本`;
  state.varieties.push(clone);
  state.activeVarietyId = id;
  return id;
}

function removeVariety(id: string): void {
  if (state.varieties.length <= 1) return;
  const idx = state.varieties.findIndex((v) => v.id === id);
  if (idx < 0) return;
  state.varieties.splice(idx, 1);
  if (state.activeVarietyId === id) state.activeVarietyId = state.varieties[0].id;
}

/** 在基地地块上随机摆放 n 支花，积温偏移模拟分批定植 */
function scatterBranches(n: number): void {
  const centered = new URLSearchParams(window.location.search).has('center');
  const rng = makeRng(nextBranchId * 1000003 + 7);
  for (let i = 0; i < n; i++) {
    state.branches.push({
      id: nextBranchId++,
      position: centered
        ? { x: 0, y: 0, z: 0 }
        : {
            x: (rng() - 0.5) * 16,
            y: 0,
            z: (rng() - 0.5) * 12
          },
      scale: 0.85 + rng() * 0.3,
      yaw: rng() * Math.PI * 2,
      gddOffset: centered ? 0 : rng() * totalGdd.value * 0.35,
      variant: Math.floor(rng() * 4)
    });
  }
}

function clearBranches(): void {
  state.branches.splice(0, state.branches.length);
}

function setTimelineGdd(gdd: number): void {
  state.timelineGdd = Math.min(totalGdd.value, Math.max(0, gdd));
}

function updateGdd(patch: Partial<GddConfig>): void {
  Object.assign(state.gdd, patch);
  state.timelineGdd = Math.min(state.timelineGdd, totalGdd.value);
}

function updateHarvest(patch: Partial<HarvestWindow>): void {
  Object.assign(state.harvest, patch);
}

function setPlaying(v: boolean): void {
  state.playing = v;
}

function setPlaybackSpeed(v: number): void {
  state.playbackSpeed = v;
}

function exportScheme(): SchemeFile {
  return {
    format: 'rose-bloom-scheme',
    version: 1,
    exportedAt: new Date().toISOString(),
    gdd: cloneData(state.gdd),
    harvest: cloneData(state.harvest),
    varieties: cloneData(state.varieties),
    activeVarietyId: state.activeVarietyId,
    branches: cloneData(state.branches),
    timelineGdd: state.timelineGdd
  };
}

function importScheme(file: SchemeFile): { ok: boolean; error?: string } {
  if (file.format !== 'rose-bloom-scheme' || file.version !== 1) {
    return { ok: false, error: '文件格式或版本不匹配' };
  }
  state.gdd = file.gdd;
  state.harvest = file.harvest;
  state.varieties = file.varieties;
  state.activeVarietyId = file.activeVarietyId ?? file.varieties[0]?.id;
  state.branches = file.branches;
  state.timelineGdd = Math.min(file.timelineGdd ?? 0, totalGdd.value);
  nextBranchId = state.branches.reduce((m, b) => Math.max(m, b.id + 1), 1);
  state.playing = false;
  return { ok: true };
}

export function useStore() {
  return {
    state: readonly(state),
    totalGdd,
    activeVariety,
    activeCurve,
    harvestWindowGdd,
    setActiveVariety,
    updateActiveVariety,
    updatePetal,
    updatePetalControl,
    updateColor,
    updateCurvePoint,
    insertCurvePoint,
    removeCurvePoint,
    addVariety,
    removeVariety,
    scatterBranches,
    clearBranches,
    setTimelineGdd,
    updateGdd,
    updateHarvest,
    setPlaying,
    setPlaybackSpeed,
    exportScheme,
    importScheme
  };
}
