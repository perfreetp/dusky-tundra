import { useEffect, useMemo, useState } from 'react';
import { ViewCanvas } from './ui/ViewCanvas';
import { Toolbar } from './ui/Toolbar';
import { ClipPanel, ParticlePanel, PressurePanel, VolumePanel } from './ui/ControlPanels';
import { buildSurfaceDataset, buildVolumeDataset } from './data/sampleGenerator';
import { decodeSurface, decodeVolume, type LoadedSurface, type LoadedVolume } from './data/loader';
import { useAppStore } from './state/store';

export default function App() {
  // 首屏直接生成内置示例数据（十万级体素），用户随后可导入自己的 JSON 替换
  const initial = useMemo(() => {
    const s = decodeSurface(buildSurfaceDataset());
    const v = decodeVolume(buildVolumeDataset());
    return { surface: s, volume: v };
  }, []);

  const [surface, setSurface] = useState<LoadedSurface | null>(initial.surface);
  const [volume, setVolume] = useState<LoadedVolume | null>(initial.volume);
  const [sceneKey, setSceneKey] = useState(0);
  const setFingerprints = useAppStore((s) => s.setFingerprints);
  const setPressureRange = useAppStore((s) => s.setPressureRange);

  useEffect(() => {
    setFingerprints(
      {
        surface: surface?.fingerprint ?? null,
        volume: volume?.fingerprint ?? null,
      },
      surface?.dataset.meta.name ?? volume?.dataset.meta.name ?? null,
    );
    if (surface) setPressureRange(surface.cpMin, surface.cpMax);
    // 仅在数据集替换时执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface, volume]);

  return (
    <div className="app-shell">
      <Toolbar
        surface={surface}
        volume={volume}
        onData={(d) => {
          if (d.surface) setSurface(d.surface);
          if (d.volume) setVolume(d.volume);
          setSceneKey((k) => k + 1); // 强制重建 WebGPU 场景以替换纹理/几何
        }}
        onReset={() => setSceneKey((k) => k + 1)}
      />
      <div className="main-area">
        <ViewCanvas key={sceneKey} surface={surface} volume={volume} />
        <aside className="side-panel">
          <PressurePanel cpMin={surface?.cpMin ?? -3} cpMax={surface?.cpMax ?? 1.2} />
          <ClipPanel />
          <VolumePanel />
          <ParticlePanel />
          <footer className="panel-foot">
            参数自动保存在浏览器本地；导出分享文件可在他人处复现同一视角与色带配置。
          </footer>
        </aside>
      </div>
    </div>
  );
}
