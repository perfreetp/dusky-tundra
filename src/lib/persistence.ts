import { get } from 'svelte/store';
import { decals, materials, subdivision, projectName } from './stores';
import type { ProjectState } from './types';

const KEY = 'livery-studio-project-v1';

export function collectProject(): ProjectState {
  return {
    version: 1,
    name: get(projectName),
    decals: get(decals),
    materials: get(materials),
    subdivision: get(subdivision),
  };
}

export function saveLocal(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(collectProject()));
  } catch {
    /* 存储满或被禁用时静默失败 */
  }
}

export function applyProject(p: ProjectState): void {
  if (!p || !Array.isArray(p.decals) || !p.materials) throw new Error('invalid project');
  projectName.set(p.name ?? '未命名涂装');
  decals.set(p.decals);
  materials.set(p.materials);
  subdivision.set(typeof p.subdivision === 'number' ? p.subdivision : 1);
}

export function loadLocal(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    applyProject(JSON.parse(raw) as ProjectState);
    return true;
  } catch {
    return false;
  }
}

export function exportFile(): void {
  const p = collectProject();
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${p.name || 'livery'}.livery.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importFile(f: File): Promise<boolean> {
  try {
    applyProject(JSON.parse(await f.text()) as ProjectState);
    return true;
  } catch {
    return false;
  }
}

/** 任一工程状态变化后防抖自动保存到 localStorage */
export function autosave(): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = (): void => {
    clearTimeout(timer);
    timer = setTimeout(saveLocal, 600);
  };
  const unsubs = [
    decals.subscribe(schedule),
    materials.subscribe(schedule),
    subdivision.subscribe(schedule),
    projectName.subscribe(schedule),
  ];
  return () => {
    unsubs.forEach((u) => u());
    clearTimeout(timer);
  };
}
