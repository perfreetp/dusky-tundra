<script lang="ts">
  import { decals, selectedId } from '../lib/stores';
  import { ATLAS } from '../lib/three/carBody';
  import { STAR_SVG_PATH } from '../lib/shapes';
  import type { Decal } from '../lib/types';

  const regions = Object.values(ATLAS);
  const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

  let svg: SVGSVGElement;
  let drag: {
    id: string;
    mode: 'move' | 'rotate' | 'scale';
    startX: number;
    startY: number;
    cx: number;
    cy: number;
    orig: Decal;
  } | null = null;

  $: selected = $decals.find((d) => d.id === $selectedId) ?? null;

  function toAtlas(e: PointerEvent): { x: number; y: number } {
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return { x: pt.x / 1000, y: pt.y / 1000 };
  }

  function startDrag(e: PointerEvent, d: Decal, mode: 'move' | 'rotate' | 'scale'): void {
    e.stopPropagation();
    e.preventDefault();
    selectedId.set(d.id);
    const p = toAtlas(e);
    drag = { id: d.id, mode, startX: p.x, startY: p.y, cx: d.x, cy: d.y, orig: { ...d } };
  }

  function onMove(e: PointerEvent): void {
    if (!drag) return;
    const p = toAtlas(e);
    const g = drag;
    decals.update((list) =>
      list.map((d) => {
        if (d.id !== g.id) return d;
        if (g.mode === 'move') {
          return { ...d, x: clamp01(g.orig.x + p.x - g.startX), y: clamp01(g.orig.y + p.y - g.startY) };
        }
        if (g.mode === 'rotate') {
          const a0 = Math.atan2(g.startY - g.cy, g.startX - g.cx);
          const a1 = Math.atan2(p.y - g.cy, p.x - g.cx);
          return { ...d, rotation: g.orig.rotation + ((a1 - a0) * 180) / Math.PI };
        }
        const d0 = Math.hypot(g.startX - g.cx, g.startY - g.cy) || 1e-4;
        const d1 = Math.hypot(p.x - g.cx, p.y - g.cy);
        return { ...d, size: Math.max(0.05, g.orig.size * (d1 / d0)) };
      }),
    );
  }

  function endDrag(): void {
    drag = null;
  }

  function rotHandle(d: Decal): { x: number; y: number } {
    const r = d.size * 140 * 0.75 + 24;
    const a = (d.rotation * Math.PI) / 180;
    return { x: d.x * 1000 + Math.sin(a) * r, y: d.y * 1000 - Math.cos(a) * r };
  }

  function scaleHandle(d: Decal): { x: number; y: number } {
    const r = d.size * 140 * 0.85 + 10;
    const a = ((d.rotation + 45) * Math.PI) / 180;
    return { x: d.x * 1000 + Math.cos(a) * r, y: d.y * 1000 + Math.sin(a) * r };
  }
</script>

<div class="unwrap">
  <div class="unwrap-title">二维展开图(UV 图集)· 拖动移动 · 圆点旋转 · 方块缩放</div>
  <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
  <svg
    bind:this={svg}
    viewBox="0 0 1000 1000"
    preserveAspectRatio="xMidYMid meet"
    on:pointerdown={() => selectedId.set(null)}
    on:pointermove={onMove}
    on:pointerup={endDrag}
    on:pointerleave={endDrag}
  >
    {#each Array(11) as _, i}
      <line x1={i * 100} y1="0" x2={i * 100} y2="1000" class="grid" />
      <line x1="0" y1={i * 100} x2="1000" y2={i * 100} class="grid" />
    {/each}

    {#each regions as r}
      <rect
        x={r.x0 * 1000}
        y={r.y0 * 1000}
        width={(r.x1 - r.x0) * 1000}
        height={(r.y1 - r.y0) * 1000}
        class="region"
      />
      <text x={r.x0 * 1000 + 6} y={r.y0 * 1000 + 16} class="region-label">{r.label}</text>
    {/each}

    {#each $decals as d (d.id)}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <g
        transform="translate({d.x * 1000} {d.y * 1000}) rotate({d.rotation}) scale({d.size * 140})"
        on:pointerdown={(e) => startDrag(e, d, 'move')}
        class="decal"
      >
        {#if d.type === 'text'}
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="0.32"
            font-family={d.font}
            font-weight="700"
            fill={d.color}>{d.text}</text
          >
        {:else if d.type === 'rect'}
          <rect x="-0.5" y="-0.3" width="1" height="0.6" fill={d.color} />
        {:else if d.type === 'stripe'}
          <rect x="-0.5" y="-0.12" width="1" height="0.24" fill={d.color} />
        {:else if d.type === 'circle'}
          <circle r="0.5" fill={d.color} />
        {:else if d.type === 'triangle'}
          <polygon points="0,-0.5 0.5,0.4 -0.5,0.4" fill={d.color} />
        {:else if d.type === 'star'}
          <path d={STAR_SVG_PATH} fill={d.color} />
        {/if}
        {#if $selectedId === d.id}
          <rect
            x="-0.6"
            y="-0.6"
            width="1.2"
            height="1.2"
            fill="none"
            stroke="#4da3ff"
            stroke-width="0.04"
            stroke-dasharray="0.1 0.06"
          />
        {/if}
      </g>
    {/each}

    {#if selected}
      {@const rh = rotHandle(selected)}
      {@const sh = scaleHandle(selected)}
      <line x1={selected.x * 1000} y1={selected.y * 1000} x2={rh.x} y2={rh.y} class="handle-line" />
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <circle cx={rh.x} cy={rh.y} r="9" class="handle" on:pointerdown={(e) => startDrag(e, selected, 'rotate')} />
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <rect
        x={sh.x - 8}
        y={sh.y - 8}
        width="16"
        height="16"
        class="handle"
        on:pointerdown={(e) => startDrag(e, selected, 'scale')}
      />
    {/if}
  </svg>
</div>

<style>
  .unwrap {
    flex: 1;
    min-height: 180px;
    border-top: 1px solid #232b38;
    display: flex;
    flex-direction: column;
  }
  .unwrap-title {
    padding: 4px 10px;
    font-size: 12px;
    color: #8b98ab;
    background: #11151d;
  }
  svg {
    flex: 1;
    width: 100%;
    min-height: 0;
    background: #0a0d12;
    touch-action: none;
  }
  .grid {
    stroke: #161d28;
    stroke-width: 1;
  }
  .region {
    fill: #10161f;
    stroke: #2b3a55;
    stroke-width: 1.5;
  }
  .region-label {
    fill: #5f7ba6;
    font-size: 14px;
  }
  .decal {
    cursor: grab;
  }
  .handle {
    fill: #4da3ff;
    stroke: #fff;
    stroke-width: 1.5;
    cursor: pointer;
  }
  .handle-line {
    stroke: #4da3ff;
    stroke-width: 1.5;
    stroke-dasharray: 4 3;
  }
</style>
