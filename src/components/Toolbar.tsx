import { addSpeaker, setDisplayMode, store } from '../state/store';

export default function Toolbar() {
  let fileInput: HTMLInputElement | undefined;

  const onFile = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) window.dispatchEvent(new CustomEvent('venue:import-gltf', { detail: file }));
    input.value = '';
  };

  return (
    <div class="toolbar">
      <div class="brand">场馆扩声覆盖分析</div>
      <button class="btn primary" onClick={() => addSpeaker()}>
        ＋ 添加音箱
      </button>
      <button class="btn" onClick={() => fileInput?.click()}>
        导入 GLTF/GLB
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".gltf,.glb"
        style={{ display: 'none' }}
        onChange={onFile}
      />
      <div class="toolbar-sep" />
      <button
        class={`btn toggle ${store.displayMode === 'isolate' ? 'active' : ''}`}
        onClick={() => setDisplayMode(store.displayMode === 'isolate' ? 'absolute' : 'isolate')}
        disabled={!store.selectedId}
        title="只显示选中音箱的覆盖贡献"
      >
        隔离选中音箱
      </button>
      <div class="toolbar-spacer" />
      <div class={`status ${store.computing ? 'busy' : ''}`}>
        {store.importing
          ? '模型导入中…'
          : store.computing
            ? '计算中…'
            : `采样点 ${store.points.length} · 音箱 ${store.speakers.length}`}
      </div>
    </div>
  );
}
