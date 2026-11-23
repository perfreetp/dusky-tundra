<script lang="ts">
  import { onMount } from 'svelte';
  import { SceneManager } from './lib/engine';
  import { annotations, persons, carFloor, carTransparent, clipOn, engineInfo, modelInfo, statusMsg } from './lib/store';
  import { loadState, saveState, loadModelFile } from './lib/persistence';
  import Toolbar from './components/Toolbar.svelte';
  import SidePanel from './components/SidePanel.svelte';
  import Overlay from './components/Overlay.svelte';

  let canvas: HTMLCanvasElement;
  let sm: SceneManager;
  let ready = false;

  let persistTimer: ReturnType<typeof setTimeout> | undefined;
  function persist() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      if (!sm) return;
      saveState({
        carFloor: sm.carFloorCurrent,
        carTransparent: sm.transparentOn,
        clipOn: sm.clipEnabled,
        shaftModelName: sm.shaftModelName === '内置默认模型' ? null : sm.shaftModelName,
        carModelName: sm.carModelName === '内置默认模型' ? null : sm.carModelName,
        annotations: sm.listAnnotations(),
        persons: sm.listPersons()
      });
    }, 400);
  }

  onMount(() => {
    sm = new SceneManager();
    let disposed = false;

    (async () => {
      await sm.init(canvas);
      if (disposed) return;
      engineInfo.set(`渲染引擎:${sm.engineKind}`);

      sm.onSync = () => {
        annotations.set(sm.listAnnotations());
        persons.set(sm.listPersons());
        persist();
      };
      sm.onStatus = (m) => statusMsg.set(m);

      // 恢复浏览器中保存的模型与标注数据
      const saved = loadState();
      try {
        const shaftFile = await loadModelFile('shaft');
        if (shaftFile) {
          await sm.loadModel('shaft', new File([shaftFile.buf], shaftFile.name));
        }
        const carFile = await loadModelFile('car');
        if (carFile) {
          await sm.loadModel('car', new File([carFile.buf], carFile.name));
        }
      } catch {
        statusMsg.set('已保存模型恢复失败,使用默认模型');
      }
      modelInfo.set({ shaft: sm.shaftModelName, car: sm.carModelName });

      if (saved) {
        for (const a of saved.annotations ?? []) sm.addAnnotation(a);
        for (const p of saved.persons ?? []) sm.addPerson(p);
        if (saved.carFloor) {
          sm.setCarFloor(saved.carFloor);
          carFloor.set(saved.carFloor);
        }
        if (saved.carTransparent) {
          carTransparent.set(true);
          sm.setTransparent(true);
        }
        if (saved.clipOn) {
          clipOn.set(true);
          sm.setClip(true);
        }
      }

      // 轿厢移动时楼层分组联动刷新(节流)
      let last = 0;
      sm.scene.registerBeforeRender(() => {
        const now = performance.now();
        if (now - last > 500) {
          last = now;
          annotations.set(sm.listAnnotations());
          persons.set(sm.listPersons());
        }
      });

      ready = true;
    })();

    return () => {
      disposed = true;
      sm?.engine?.dispose();
    };
  });
</script>

<div class="app">
  {#if sm}
    <Toolbar {sm} onPersist={persist} />
  {/if}
  <div class="main">
    <div class="viewport">
      <canvas bind:this={canvas}></canvas>
      {#if ready && sm}
        <Overlay {sm} />
      {/if}
    </div>
    {#if ready && sm}
      <SidePanel {sm} />
    {/if}
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .main {
    flex: 1;
    display: flex;
    min-height: 0;
  }
  .viewport {
    position: relative;
    flex: 1;
    min-width: 0;
  }
  canvas {
    width: 100%;
    height: 100%;
    display: block;
    outline: none;
    touch-action: none;
  }
</style>
