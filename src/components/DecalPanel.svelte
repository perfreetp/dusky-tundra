<script lang="ts">
  import { decals, selectedId } from '../lib/stores';
  import { createDecal, DECAL_TYPE_NAMES, type Decal, type DecalType } from '../lib/types';

  const TYPES: DecalType[] = ['text', 'rect', 'circle', 'triangle', 'star', 'stripe'];
  const FONTS = ['Arial, sans-serif', 'Impact, sans-serif', 'Georgia, serif', 'Courier New, monospace'];

  $: sel = $decals.find((d) => d.id === $selectedId) ?? null;

  function add(type: DecalType): void {
    const d = createDecal(type);
    decals.update((l) => [...l, d]);
    selectedId.set(d.id);
  }

  function remove(id: string): void {
    decals.update((l) => l.filter((d) => d.id !== id));
    if ($selectedId === id) selectedId.set(null);
  }

  function update(id: string, patch: Partial<Decal>): void {
    decals.update((l) => l.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  function label(d: Decal): string {
    return d.type === 'text' ? `文字 "${d.text}"` : DECAL_TYPE_NAMES[d.type];
  }
</script>

<div class="panel">
  <div class="add-row">
    {#each TYPES as t}
      <button on:click={() => add(t)}>+ {DECAL_TYPE_NAMES[t]}</button>
    {/each}
  </div>

  <div class="decal-list">
    {#each $decals as d (d.id)}
      <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
      <div class="decal-item" class:active={$selectedId === d.id} on:click={() => selectedId.set(d.id)}>
        <span class="dot" style="background:{d.color}"></span>
        <span class="name">{label(d)}</span>
        <button class="del" title="删除" on:click|stopPropagation={() => remove(d.id)}>✕</button>
      </div>
    {:else}
      <div class="empty">尚未添加贴花,点击上方按钮添加</div>
    {/each}
  </div>

  {#if sel}
    {@const sid = sel.id}
    <div class="editor">
      {#if sel.type === 'text'}
        <label>
          文字内容
          <input value={sel.text} on:input={(e) => update(sid, { text: e.currentTarget.value })} />
        </label>
        <label>
          字体
          <select value={sel.font} on:change={(e) => update(sid, { font: e.currentTarget.value })}>
            {#each FONTS as f}
              <option value={f}>{f.split(',')[0]}</option>
            {/each}
          </select>
        </label>
      {/if}
      <label>
        颜色
        <input type="color" value={sel.color} on:input={(e) => update(sid, { color: e.currentTarget.value })} />
      </label>
      <label>
        尺寸 {sel.size.toFixed(2)} m
        <input
          type="range"
          min="0.05"
          max="3"
          step="0.01"
          value={sel.size}
          on:input={(e) => update(sid, { size: +e.currentTarget.value })}
        />
      </label>
      <label>
        旋转 {sel.rotation.toFixed(0)}°
        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={sel.rotation}
          on:input={(e) => update(sid, { rotation: +e.currentTarget.value })}
        />
      </label>
    </div>
  {/if}
</div>

<style>
  .panel {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .add-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .decal-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 220px;
    overflow-y: auto;
  }
  .decal-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 4px;
    background: #161c26;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .decal-item.active {
    border-color: #2f6fed;
    background: #1a2334;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #0008;
    flex: none;
  }
  .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .del {
    padding: 0 6px;
    font-size: 11px;
  }
  .empty {
    color: #66738a;
    padding: 8px;
    text-align: center;
  }
  .editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid #232b38;
    padding-top: 10px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #9aa7ba;
  }
  input:not([type]),
  select {
    background: #0d1219;
    border: 1px solid #2e3a4c;
    color: #dde3ea;
    border-radius: 4px;
    padding: 4px 6px;
  }
</style>
