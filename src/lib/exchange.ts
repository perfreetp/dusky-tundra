import type { SceneManager } from './engine';
import type { ExportFile } from './types';

export function buildExport(sm: SceneManager): ExportFile {
  return {
    type: 'elevator-rescue-locate',
    version: 1,
    exportedAt: new Date().toISOString(),
    carFloor: sm.carFloorCurrent,
    floorCount: sm.floorCount,
    floorHeight: sm.floorHeight,
    annotations: sm.listAnnotations().map((a) => {
      const w = sm.worldPositionOf(a.id)!;
      return { ...a, worldPosition: [w.x, w.y, w.z] };
    }),
    persons: sm.listPersons().map((p) => {
      const w = sm.worldPositionOf(p.id)!;
      return { ...p, worldPosition: [w.x, w.y, w.z] };
    })
  };
}

export function downloadExport(sm: SceneManager): void {
  const data = buildExport(sm);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `电梯困人定位-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importExport(sm: SceneManager, file: File): Promise<string> {
  const text = await file.text();
  const data = JSON.parse(text) as ExportFile;
  if (data.type !== 'elevator-rescue-locate') throw new Error('不是有效的定位结果文件');
  sm.clearAll();
  for (const a of data.annotations ?? []) {
    const { worldPosition: _w, ...rest } = a;
    sm.addAnnotation(rest);
  }
  for (const p of data.persons ?? []) {
    const { worldPosition: _w, ...rest } = p;
    sm.addPerson(rest);
  }
  if (typeof data.carFloor === 'number') sm.setCarFloor(data.carFloor);
  return `已导入 ${data.annotations?.length ?? 0} 个故障点、${data.persons?.length ?? 0} 个被困点`;
}
