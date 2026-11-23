// 轻量 manifold 引导:只加载 wasm 核心 + GC 包装,避开 manifoldCAD 的 gltf-transform 重依赖
// 类型仍复用 manifoldCAD 的声明(类形一致)
import { getManifoldModule, getManifoldModuleSync } from 'manifold-3d/lib/wasm.js';
import { garbageCollectManifold } from 'manifold-3d/lib/garbage-collector.js';
import type { Manifold as ManifoldType } from 'manifold-3d/manifoldCAD';

let ready: Promise<void> | null = null;

/** 初始化 wasm 模块(幂等),Worker 启动时调用一次 */
export function ensureManifold(): Promise<void> {
  if (!ready) {
    ready = getManifoldModule().then(() => {
      const m = getManifoldModuleSync()!;
      garbageCollectManifold(m);
    });
  }
  return ready;
}

/** 同步取得已初始化模块上的 Manifold 类(需先 await ensureManifold) */
export function getManifold(): typeof ManifoldType {
  const m = getManifoldModuleSync();
  if (!m) throw new Error('Manifold 尚未初始化,请先 await ensureManifold()');
  return m.Manifold as unknown as typeof ManifoldType;
}
