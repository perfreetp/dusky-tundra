<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { SceneManager } from '../lib/three/scene';
  import {
    decals,
    materials,
    subdivision,
    viewCommand,
    fps,
    triangleCount,
    bodyImport,
    bodyReset,
    toast,
  } from '../lib/stores';

  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;

  onMount(() => {
    const scene = new SceneManager(canvas);
    scene.onFps = (v) => fps.set(v);
    scene.onTriangles = (n) => triangleCount.set(n);

    const unsubs = [
      decals.subscribe((d) => scene.renderDecals(d)),
      materials.subscribe((m) => {
        scene.setBaseColor(m.baseColor);
        scene.updateMaterials(m);
        scene.renderDecals(get(decals));
      }),
      subdivision.subscribe((l) => {
        scene.setSubdivision(l);
        scene.renderDecals(get(decals));
      }),
      viewCommand.subscribe((c) => {
        if (c.n === 0) return;
        if (c.kind === 'view') scene.setView(c.name);
        else scene.focusPart(c.name);
      }),
      bodyImport.subscribe(async (f) => {
        if (!f) return;
        const ok = await scene.loadCustomBody(f);
        toast(ok ? '车身已导入,已生成柱面展开图' : '无法解析该车身文件(支持 .obj / .glb / .gltf)');
        if (ok) scene.renderDecals(get(decals));
        bodyImport.set(null);
      }),
      bodyReset.subscribe((n) => {
        if (n === 0) return;
        scene.resetBuiltin();
        scene.renderDecals(get(decals));
        toast('已恢复内置车身');
      }),
    ];

    const ro = new ResizeObserver(() => scene.resize(wrap.clientWidth, wrap.clientHeight));
    ro.observe(wrap);
    scene.resize(wrap.clientWidth, wrap.clientHeight);

    return () => {
      unsubs.forEach((u) => u());
      ro.disconnect();
      scene.dispose();
    };
  });
</script>

<div class="viewport" bind:this={wrap}>
  <canvas bind:this={canvas}></canvas>
  <div class="hud">{$fps} FPS · {$triangleCount.toLocaleString()} 三角面片</div>
</div>

<style>
  .viewport {
    flex: 1.4;
    position: relative;
    min-height: 0;
    overflow: hidden;
  }
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  .hud {
    position: absolute;
    top: 8px;
    left: 10px;
    font-family: ui-monospace, Consolas, monospace;
    font-size: 12px;
    color: #7ee787;
    background: rgba(10, 14, 20, 0.65);
    padding: 3px 8px;
    border-radius: 4px;
    pointer-events: none;
  }
</style>
