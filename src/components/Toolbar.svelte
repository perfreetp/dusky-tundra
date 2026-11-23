<script lang="ts">
  import { carFloor, floorCount, mode, carTransparent, clipOn, engineInfo, modelInfo, statusMsg } from '../lib/store';
  import type { SceneManager } from '../lib/engine';
  import { downloadExport, importExport } from '../lib/exchange';
  import { saveModelFile } from '../lib/persistence';

  export let sm: SceneManager;
  export let onPersist: () => void;

  let shaftInput: HTMLInputElement;
  let carInput: HTMLInputElement;
  let importInput: HTMLInputElement;

  async function onModelFile(kind: 'shaft' | 'car', e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      statusMsg.set(`正在载入 ${file.name} …`);
      await sm.loadModel(kind, file);
      await saveModelFile(kind, file.name, await file.arrayBuffer());
      modelInfo.update((m) => ({ ...m, [kind]: file.name }));
      statusMsg.set(`已载入 ${kind === 'shaft' ? '井道' : '轿厢'}模型:${file.name}`);
      onPersist();
    } catch (err) {
      statusMsg.set(`模型载入失败:${err instanceof Error ? err.message : String(err)}`);
    }
    (e.currentTarget as HTMLInputElement).value = '';
  }

  async function onImport(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const msg = await importExport(sm, file);
      carFloor.set(sm.carFloorCurrent);
      statusMsg.set(msg);
      onPersist();
    } catch (err) {
      statusMsg.set(`导入失败:${err instanceof Error ? err.message : String(err)}`);
    }
    (e.currentTarget as HTMLInputElement).value = '';
  }

  function setMode(m: 'navigate' | 'annotate' | 'person') {
    mode.set(m);
    sm.mode = m;
  }
</script>

<header class="toolbar">
  <div class="row">
    <span class="brand">电梯困人救援空间定位</span>
    <span class="engine">{$engineInfo}</span>
  </div>
  <div class="row wrap">
    <button on:click={() => shaftInput.click()}>载入井道模型</button>
    <button on:click={() => carInput.click()}>载入轿厢模型</button>
    <button on:click={() => { sm.buildDefaultShaft(); sm.buildDefaultCar(); sm.setTransparent($carTransparent); modelInfo.set({ shaft: '内置默认模型', car: '内置默认模型' }); onPersist(); }}>恢复默认模型</button>

    <span class="sep"></span>

    <button class:active={$mode === 'navigate'} on:click={() => setMode('navigate')}>浏览</button>
    <button class:active={$mode === 'annotate'} on:click={() => setMode('annotate')}>标注故障点</button>
    <button class:active={$mode === 'person'} on:click={() => setMode('person')}>放置被困点</button>

    <span class="sep"></span>

    <label class="chk">
      <input type="checkbox" bind:checked={$carTransparent} on:change={() => { sm.setTransparent($carTransparent); onPersist(); }} />
      半透明
    </label>
    <label class="chk">
      <input type="checkbox" bind:checked={$clipOn} on:change={() => { sm.setClip($clipOn); onPersist(); }} />
      剖显模式
    </label>

    <span class="sep"></span>

    <label class="floor">
      停靠楼层 <b>{$carFloor}F</b>
      <input
        type="range"
        min="1"
        max={$floorCount}
        step="1"
        bind:value={$carFloor}
        on:input={() => { sm.setCarFloor($carFloor); onPersist(); }}
      />
    </label>

    <span class="sep"></span>

    <button on:click={() => downloadExport(sm)}>导出定位结果</button>
    <button on:click={() => importInput.click()}>导入</button>
    <button class="danger" on:click={() => { sm.clearAll(); onPersist(); }}>清空标注</button>
  </div>
  <div class="row status">
    <span>井道:{$modelInfo.shaft || '—'} · 轿厢:{$modelInfo.car || '—'}</span>
    <span class="msg">{$statusMsg}</span>
  </div>

  <input bind:this={shaftInput} type="file" accept=".glb,.gltf" hidden on:change={(e) => onModelFile('shaft', e)} />
  <input bind:this={carInput} type="file" accept=".glb,.gltf" hidden on:change={(e) => onModelFile('car', e)} />
  <input bind:this={importInput} type="file" accept=".json" hidden on:change={onImport} />
</header>

<style>
  .toolbar {
    background: rgba(18, 20, 26, 0.95);
    border-bottom: 1px solid #2a2e3a;
    color: #dfe3ec;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    z-index: 10;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .brand {
    font-weight: 700;
    font-size: 14px;
  }
  .engine {
    opacity: 0.6;
    font-size: 11px;
  }
  .sep {
    width: 1px;
    height: 18px;
    background: #2a2e3a;
  }
  button {
    background: #232735;
    color: #dfe3ec;
    border: 1px solid #333849;
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
  }
  button:hover {
    border-color: #8ab4ff;
  }
  button.active {
    background: #2d4a7a;
    border-color: #8ab4ff;
  }
  button.danger:hover {
    border-color: #ff5a4d;
    color: #ff8a80;
  }
  .chk {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .floor {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .floor input[type='range'] {
    width: 140px;
  }
  .status {
    opacity: 0.75;
    font-size: 11px;
    gap: 16px;
  }
  .msg {
    color: #9fd0a8;
  }
</style>
