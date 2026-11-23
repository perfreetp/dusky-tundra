import { captureSnapshotA, clearSnapshotA, setSchemeView, store } from '../state/store';

export default function ComparePanel() {
  const snap = () => store.snapshotA;
  const view = () => store.schemeView;

  return (
    <div class="panel">
      <div class="panel-title">方案对比</div>
      {!snap() ? (
        <>
          <div class="empty-hint">把当前布置保存为方案 A，之后编辑的布置为方案 B，可生成 B−A 差值覆盖。</div>
          <button class="btn primary" onClick={() => captureSnapshotA()} disabled={!store.result || store.computing}>
            保存当前为方案 A
          </button>
        </>
      ) : (
        <>
          <div class="snapshot-meta">
            方案 A 已保存 · {snap()!.speakerCount} 只音箱 · {snap()!.pointCount} 采样点
          </div>
          <div class="segmented">
            <button class={`seg ${view() === 'A' ? 'active' : ''}`} onClick={() => setSchemeView('A')}>
              看 A
            </button>
            <button class={`seg ${view() === 'B' ? 'active' : ''}`} onClick={() => setSchemeView('B')}>
              看 B
            </button>
            <button class={`seg ${view() === 'diff' ? 'active' : ''}`} onClick={() => setSchemeView('diff')}>
              差值 B−A
            </button>
          </div>
          <button class="btn" onClick={() => captureSnapshotA()} disabled={store.computing}>
            用当前布置更新方案 A
          </button>
          <button class="btn danger" onClick={() => clearSnapshotA()}>
            清除方案 A
          </button>
        </>
      )}
    </div>
  );
}
