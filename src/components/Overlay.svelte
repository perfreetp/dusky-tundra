<script lang="ts">
  import { onMount } from 'svelte';
  import type { SceneManager, OverlayItem } from '../lib/engine';

  export let sm: SceneManager;

  interface PlacedItem extends OverlayItem {
    lx: number;
    ly: number;
    anchorLeft: boolean;
  }

  let items: PlacedItem[] = [];
  let vw = 0;
  let vh = 0;

  const LABEL_W = 210;
  const LABEL_H = 44;

  onMount(() => {
    let raf = 0;
    const tick = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const raw = sm.getOverlayItems();
      items = raw.map((it, i) => {
        // 标签放在锚点左/右侧,避免超出屏幕
        const anchorLeft = it.x > vw / 2;
        let lx = anchorLeft ? it.x - LABEL_W - 26 : it.x + 26;
        let ly = it.y - LABEL_H - 14 - (i % 3) * 6;
        lx = Math.max(8, Math.min(vw - LABEL_W - 8, lx));
        ly = Math.max(8, Math.min(vh - LABEL_H - 8, ly));
        return { ...it, lx, ly, anchorLeft };
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  });

  function lineEnd(it: PlacedItem): { x: number; y: number } {
    return { x: it.anchorLeft ? it.lx + LABEL_W : it.lx, y: it.ly + LABEL_H / 2 };
  }
</script>

<svg class="leader-layer">
  {#each items as it (it.id)}
    {#if it.visible}
      {@const end = lineEnd(it)}
      <line
        x1={it.x} y1={it.y} x2={end.x} y2={end.y}
        class="leader {it.kind}"
        stroke-dasharray={it.clipped ? '5 4' : 'none'}
      />
      <circle cx={it.x} cy={it.y} r="3.5" class="dot {it.kind}" />
    {/if}
  {/each}
</svg>

{#each items as it (it.id)}
  {#if it.visible}
    <button
      class="label {it.kind}"
      style="left:{it.lx}px; top:{it.ly}px; width:{LABEL_W}px;"
      on:click={() => sm.flyToItem(it.id)}
      title="点击飞向该点"
    >
      <span class="l1">{it.lines[0]}</span>
      {#if it.lines[1]}<span class="l2">{it.lines[1]}</span>{/if}
    </button>
  {/if}
{/each}

<style>
  .leader-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }
  .leader {
    stroke-width: 1.6;
    stroke: #ff5a4d;
  }
  .leader.person {
    stroke: #ffb020;
  }
  .dot {
    fill: #ff5a4d;
    stroke: #fff;
    stroke-width: 1;
  }
  .dot.person {
    fill: #ffb020;
  }
  .label {
    position: absolute;
    z-index: 6;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 5px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255, 90, 77, 0.7);
    background: rgba(20, 22, 28, 0.88);
    color: #ffd9d5;
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
    pointer-events: auto;
  }
  .label.person {
    border-color: rgba(255, 176, 32, 0.7);
    color: #ffe3ae;
  }
  .label:hover {
    background: rgba(45, 48, 60, 0.95);
  }
  .l1 {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .l2 {
    opacity: 0.8;
    font-family: ui-monospace, monospace;
    font-size: 11px;
  }
</style>
