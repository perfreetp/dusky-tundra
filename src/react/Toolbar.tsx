import { useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { Engine } from '../three/Engine';
import type { Store, StoreState } from '../state/store';
import {
  createDefaultSceneConfig,
  createDefaultRopes,
  createDefaultFloors,
  GOVERNOR_LOOP_LENGTH,
} from '../config/defaultSceneConfig';
import { buildDocument, downloadJson, parseDocument } from '../core/io/poseSerializer';
import { exportScreenshot } from '../three/export/screenshot';

interface Props {
  engineRef: MutableRefObject<Engine | null>;
  store: Store<StoreState>;
}

export function Toolbar({ engineRef, store }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const jsonRef = useRef<HTMLInputElement>(null);

  const exportPose = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const scene = createDefaultSceneConfig();
    const ropes = createDefaultRopes(scene);
    const floors = createDefaultFloors(scene);
    const doc = buildDocument({
      scene,
      ropes,
      floors,
      runtime: {
        selectedFloorId: store.getState().selectedFloorId,
        loadOverride: null,
        clipHeight: store.getState().clipHeight,
        ropeOpacity: store.getState().ropeOpacity,
        lodLevel: store.getState().lodLevel,
        showSectionMarkers: store.getState().showSectionMarkers,
        showTensionColor: store.getState().showTensionColor,
        playing: store.getState().playing,
      },
      loopLengths: { 'governor-loop': GOVERNOR_LOOP_LENGTH },
      poses: engine.getPoseManager().basePoses,
    });
    downloadJson(doc, `rope-pose-${store.getState().selectedFloorId}.json`);
  };

  const importPose = async (file: File) => {
    const text = await file.text();
    const doc = parseDocument(text);
    // 参数模式：校验通过即可回导复算；嵌入模式可直接灌缓存（此处先确认契约有效）
    const engine = engineRef.current;
    if (!engine) return;
    engine.requestRebuild();
    // eslint-disable-next-line no-alert
    alert(`姿态文件已导入：${doc.ropes.length} 根绳，${doc.floors.length} 个楼层档位`);
  };

  const importGlb = async (file: File) => {
    const engine = engineRef.current;
    if (!engine) return;
    const url = URL.createObjectURL(file);
    try {
      const { importGlb } = await import('../three/bvh/gltfImportPipeline');
      const result = await importGlb(
        url,
        engine.getBvhRegistry(),
        createDefaultSceneConfig(),
      );
      // GLB 几何加入场景；绳系统在标注完整前继续用默认参数化
      engine.attachImportedObject(result.object);
      // eslint-disable-next-line no-alert
      alert(
        `GLB 已导入：${result.colliderNames.length} 个碰撞体` +
          (result.usedFallback ? '，绳轮标注缺失，绳系统使用默认场景' : ''),
      );
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`GLB 导入失败：${(e as Error).message}`);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const shot = () => {
    const engine = engineRef.current;
    if (engine) exportScreenshot(engine.screenshot());
  };

  return (
    <section className="panel toolbar">
      <h2>文件</h2>
      <div className="btn-grid">
        <button className="btn" onClick={() => fileRef.current?.click()}>
          导入 GLB
        </button>
        <button className="btn" onClick={() => jsonRef.current?.click()}>
          导入 JSON
        </button>
        <button className="btn" onClick={exportPose}>
          导出姿态 JSON
        </button>
        <button className="btn primary" onClick={shot}>
          导出 PNG
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".glb,.gltf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importGlb(f);
          e.target.value = '';
        }}
      />
      <input
        ref={jsonRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importPose(f);
          e.target.value = '';
        }}
      />
    </section>
  );
}
