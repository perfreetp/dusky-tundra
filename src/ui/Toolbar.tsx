import { useMemo, useRef } from 'react';
import { useAppStore, exportShareFile, parseShareFile, type RegionId } from '../state/store';
import type { LoadedSurface, LoadedVolume } from '../data/loader';
import { parseDatasets, decodeSurface, decodeVolume } from '../data/loader';
import { isSurfaceDataset, isVolumeDataset } from '../types/dataset';

interface Props {
  surface: LoadedSurface | null;
  volume: LoadedVolume | null;
  onData: (d: { surface?: LoadedSurface; volume?: LoadedVolume }) => void;
  onReset: () => void;
}

export function Toolbar({ surface, volume, onData, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const shareImportRef = useRef<HTMLInputElement>(null);
  const viewMode = useAppStore((s) => s.view.mode);
  const setView = useAppStore((s) => s.setView);
  const highlight = useAppStore((s) => s.highlight);
  const setHighlight = useAppStore((s) => s.setHighlight);
  const resetAll = useAppStore((s) => s.resetAll);
  const datasetName = useAppStore((s) => s.loadedDatasetName);

  const coefficients = surface?.dataset.coefficients;
  const coeffList = useMemo(() => {
    if (!coefficients) return [];
    return Object.entries(coefficients).map(([id, c]) => ({ id, ...c }));
  }, [coefficients]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const next: { surface?: LoadedSurface; volume?: LoadedVolume } = {};
    for (const file of Array.from(files)) {
      const datasets = await parseDatasets(file);
      for (const d of datasets) {
        if (isSurfaceDataset(d)) next.surface = decodeSurface(d);
        if (isVolumeDataset(d)) next.volume = decodeVolume(d);
      }
    }
    onData(next);
  }

  function handleShareExport() {
    const share = exportShareFile();
    const blob = new Blob([JSON.stringify(share, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeroflow-share-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShareImport(file: File | undefined) {
    if (!file) return;
    const share = parseShareFile(await file.text());
    // 数据指纹不一致时仅警告，参数仍可应用（用户可能载入了同族数据）
    const fp = useAppStore.getState().datasetFingerprints;
    const st = share.state.datasetFingerprints;
    if (
      (st.surface && st.surface !== fp.surface) ||
      (st.volume && st.volume !== fp.volume)
    ) {
      const ok = window.confirm(
        '分享文件对应的数据集与当前载入数据不一致，仍要应用其视角与色带配置吗？',
      );
      if (!ok) return;
    }
    useAppStore.getState().importState(share.state);
  }

  const regionButtons: { id: RegionId; label: string }[] = [
    { id: 'none', label: '无高亮' },
    { id: 'rearWing', label: '尾翼' },
    { id: 'diffuser', label: '扩散器' },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <strong className="brand">AeroFlow Viz</strong>
        <button onClick={() => fileRef.current?.click()}>导入数据 JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button onClick={handleShareExport}>导出分享文件</button>
        <button onClick={() => shareImportRef.current?.click()}>导入分享文件</button>
        <input
          ref={shareImportRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(e) => handleShareImport(e.target.files?.[0])}
        />
        <button
          onClick={() => {
            resetAll();
            onReset();
          }}
        >
          重置参数
        </button>
      </div>

      <div className="toolbar-row">
        <span className="toolbar-label">视角：</span>
        <div className="seg">
          <button className={viewMode === 'free' ? 'active' : ''} onClick={() => setView({ mode: 'free' })}>
            绕车自由漫游
          </button>
          <button className={viewMode === 'ground' ? 'active' : ''} onClick={() => setView({ mode: 'ground' })}>
            贴地低角度
          </button>
        </div>
        <span className="toolbar-label">区域高亮：</span>
        <div className="seg">
          {regionButtons.map((b) => (
            <button key={b.id} className={highlight === b.id ? 'active' : ''} onClick={() => setHighlight(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {(coeffList.length > 0 || surface || volume) && (
        <div className="toolbar-row coeff-row">
          <span className="toolbar-label">
            升阻力系数{highlight !== 'none' ? `（${highlight === 'rearWing' ? '尾翼' : '扩散器'}）` : ''}：
          </span>
          {coeffList.length === 0 && <em className="muted">数据未提供分区系数</em>}
          {coeffList
            .filter((c) => highlight === 'none' || c.id === highlight)
            .map((c) => (
              <span key={c.id} className={`coeff-chip ${highlight === c.id ? 'chip-hot' : ''}`}>
                {regionName(c.id)}
                <b>
                  Cl {c.cl.toFixed(3)}
                </b>
                <b>
                  Cd {c.cd.toFixed(3)}
                </b>
              </span>
            ))}
          <span className="spacer" />
          <span className="muted small">{datasetName ?? '未命名数据集'}</span>
        </div>
      )}
    </div>
  );
}

function regionName(id: string): string {
  return (
    {
      rearWing: '尾翼',
      diffuser: '扩散器',
      frontWing: '前翼',
      body: '车身',
      wheels: '车轮',
    }[id] ?? id
  );
}
