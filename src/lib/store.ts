import { reactive } from 'vue';
import type {
  CollisionRecord,
  FrameStats,
  MaterialZone,
  MeshPart,
} from './types';
import { COLLISION_PRESETS } from './types';
import { assignZones, meshVolume } from './meshIO';

/* ---------- 非响应式网格数据(大数组不进 Vue 响应式系统) ---------- */
export const meshData = {
  parts: [] as MeshPart[],
  fileName: '',
};

/* ---------- 响应式 UI 状态 ---------- */
export const state = reactive({
  loaded: false,
  loading: false,
  computing: false,
  error: '',
  zones: [
    { id: 1, name: '前舱吸能区', xMin: 0, xMax: 0.35, yieldStrength: 250, color: '#e0a32e' },
    { id: 2, name: '乘员舱高强钢', xMin: 0.35, xMax: 0.75, yieldStrength: 550, color: '#3e8fe0' },
    { id: 3, name: '后舱结构区', xMin: 0.75, xMax: 1, yieldStrength: 320, color: '#4fc06a' },
  ] as MaterialZone[],
  presetIndex: 0,
  impulse: 8000,
  collisions: [] as CollisionRecord[],
  stats: {
    vertexCount: 0,
    triangleCount: 0,
    initialVolume: 0,
    currentVolume: 0,
    maxStress: 0,
    maxStressPoint: [0, 0, 0] as [number, number, number],
    maxStressZone: '',
    exceededVertices: 0,
    lastComputeMs: 0,
    collisionCount: 0,
  } as FrameStats,
  // 视图
  showGhost: false,
  shellOpacity: 0.32,
  showZoneColors: false,
  clipEnabled: false,
  clipAxis: 'x' as 'x' | 'y' | 'z',
  clipPos: 0,
  clipRange: [0, 0] as [number, number],
  // 应力着色上限(0 = 自动按当前最大应力)
  stressCap: 0,
  // 视口重绘信号
  viewVersion: 0,
});

/* ---------- 变形计算 Worker 封装 ---------- */
interface WorkerResult {
  positions: Float32Array[];
  stress: Float32Array[];
  volumes: number[];
  maxStress: number;
  maxPoint: [number, number, number];
  maxZone: number;
  exceeded: number;
  timeMs: number;
}

class Engine {
  private worker: Worker | null = null;
  private seq = 0;
  private pending = new Map<number, (r: WorkerResult) => void>();

  private ensure(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('../workers/deform.worker.ts', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = (ev: MessageEvent) => {
        const msg = ev.data;
        const resolve = this.pending.get(msg.id);
        if (resolve) {
          this.pending.delete(msg.id);
          resolve(msg as WorkerResult);
        }
      };
    }
    return this.worker;
  }

  private call(type: string, payload: Record<string, unknown>, transfer: Transferable[] = []): Promise<WorkerResult> {
    const w = this.ensure();
    const id = ++this.seq;
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      w.postMessage({ id, type, ...payload }, transfer);
    });
  }

  async init(parts: MeshPart[]): Promise<WorkerResult> {
    // 发送副本,主线程保留数据
    const payload = parts.map((p) => ({
      name: p.name,
      positions: p.positions.slice(),
      indices: p.indices,
      zoneOfVertex: p.zoneOfVertex.slice(),
    }));
    const transfer: Transferable[] = [];
    for (const p of payload) transfer.push(p.positions.buffer);
    return this.call('init', { parts: payload, yieldStrengths: yields() }, transfer);
  }

  collide(dir: [number, number, number], impulse: number): Promise<WorkerResult> {
    return this.call('collide', { dir, impulse });
  }

  setZones(parts: MeshPart[]): Promise<WorkerResult> {
    const zones = parts.map((p) => p.zoneOfVertex.slice());
    return this.call('setZones', { zones, yieldStrengths: yields() }, zones.map((z) => z.buffer));
  }

  reset(): Promise<WorkerResult> {
    return this.call('reset', {});
  }

  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}

export const engine = new Engine();

function yields(): number[] {
  return state.zones.map((z) => z.yieldStrength);
}

/* ---------- 高层操作 ---------- */

function applyResult(r: WorkerResult): void {
  for (let i = 0; i < meshData.parts.length; i++) {
    const part = meshData.parts[i];
    part.positions.set(r.positions[i]);
    part.stress.set(r.stress[i]);
  }
  const s = state.stats;
  s.currentVolume = r.volumes.reduce((a, b) => a + b, 0);
  s.maxStress = r.maxStress;
  s.maxStressPoint = r.maxPoint;
  s.maxStressZone = state.zones[r.maxZone]?.name ?? '';
  s.exceededVertices = r.exceeded;
  s.lastComputeMs = r.timeMs;
  state.viewVersion++;
}

export async function loadParts(parts: MeshPart[], fileName: string): Promise<void> {
  state.loading = true;
  state.error = '';
  try {
    for (const p of parts) assignZones(p, state.zones);
    meshData.parts = parts;
    meshData.fileName = fileName;
    state.collisions = [];
    state.stats.collisionCount = 0;

    const r = await engine.init(parts);
    applyResult(r);
    const s = state.stats;
    s.vertexCount = parts.reduce((a, p) => a + p.positions.length / 3, 0);
    s.triangleCount = parts.reduce((a, p) => a + p.indices.length / 3, 0);
    s.initialVolume = parts.reduce((a, p) => a + meshVolume(p.original, p.indices), 0);
    s.currentVolume = s.initialVolume;
    s.maxStress = 0;
    updateClipRange();
    state.loaded = true;
  } catch (e) {
    state.error = e instanceof Error ? e.message : String(e);
  } finally {
    state.loading = false;
  }
}

export async function applyCollision(): Promise<void> {
  if (!state.loaded || state.computing) return;
  state.computing = true;
  try {
    const preset = COLLISION_PRESETS[state.presetIndex];
    const r = await engine.collide(preset.dir, state.impulse);
    applyResult(r);
    state.stats.collisionCount++;
    state.collisions.push({
      id: state.collisions.length + 1,
      presetName: preset.name,
      dir: preset.dir,
      impulse: state.impulse,
      maxStress: r.maxStress,
      timeMs: r.timeMs,
    });
  } finally {
    state.computing = false;
  }
}

export async function applyZones(): Promise<void> {
  if (!state.loaded) return;
  for (const p of meshData.parts) assignZones(p, state.zones);
  await engine.setZones(meshData.parts);
  state.viewVersion++;
}

export async function resetFrame(): Promise<void> {
  if (!state.loaded || state.computing) return;
  state.computing = true;
  try {
    const r = await engine.reset();
    applyResult(r);
    state.collisions = [];
    state.stats.collisionCount = 0;
  } finally {
    state.computing = false;
  }
}

export function updateClipRange(): void {
  if (!meshData.parts.length) return;
  const axisIdx = { x: 0, y: 1, z: 2 }[state.clipAxis];
  let mn = Infinity;
  let mx = -Infinity;
  for (const part of meshData.parts) {
    const p = part.positions;
    for (let i = axisIdx; i < p.length; i += 3) {
      if (p[i] < mn) mn = p[i];
      if (p[i] > mx) mx = p[i];
    }
  }
  state.clipRange = [mn, mx];
  state.clipPos = Math.min(mx, Math.max(mn, state.clipPos || (mn + mx) / 2));
}
