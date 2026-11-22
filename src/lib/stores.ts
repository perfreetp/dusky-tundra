import { writable } from 'svelte/store';
import type { Decal, MaterialState } from './types';
import { DEFAULT_MATERIALS } from './types';

export const projectName = writable('未命名涂装');
export const decals = writable<Decal[]>([]);
export const materials = writable<MaterialState>(structuredClone(DEFAULT_MATERIALS));
/** 曲面细分档位 0=低 1=中 2=高 */
export const subdivision = writable(1);
export const selectedId = writable<string | null>(null);
/** 视图/聚焦指令,n 递增触发 */
export const viewCommand = writable<{ kind: 'view' | 'focus'; name: string; n: number }>({
  kind: 'view',
  name: 'threequarter',
  n: 0,
});
export const fps = writable(0);
export const triangleCount = writable(0);
export const statusMessage = writable('');
/** 请求载入自定义车身文件 */
export const bodyImport = writable<File | null>(null);
/** 请求恢复内置车身(计数触发) */
export const bodyReset = writable(0);

/** 强制触发一次贴花重绘(数组内容被原地修改时使用) */
export function bumpDecals(): void {
  decals.update((l) => l);
}

export function requestView(name: string): void {
  viewCommand.update((v) => ({ kind: 'view', name, n: v.n + 1 }));
}

export function requestFocus(name: string): void {
  viewCommand.update((v) => ({ kind: 'focus', name, n: v.n + 1 }));
}

export function toast(msg: string): void {
  statusMessage.set(msg);
}
