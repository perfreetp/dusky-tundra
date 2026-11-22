<script lang="ts">
  import { onMount } from 'svelte';
  import Viewport from './components/Viewport.svelte';
  import UnwrapEditor from './components/UnwrapEditor.svelte';
  import DecalPanel from './components/DecalPanel.svelte';
  import MaterialPanel from './components/MaterialPanel.svelte';
  import {
    subdivision,
    requestView,
    requestFocus,
    projectName,
    decals,
    statusMessage,
    bodyImport,
    bodyReset,
    toast,
  } from './lib/stores';
  import { saveLocal, loadLocal, exportFile, importFile, autosave } from './lib/persistence';

  let tab: 'decals' | 'materials' = 'decals';
  let projectFile: HTMLInputElement;
  let bodyFile: HTMLInputElement;
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    if (loadLocal()) toast('已从浏览器恢复上次工程');
    return autosave();
  });

  $: if ($statusMessage) {
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => statusMessage.set(''), 2600);
  }

  async function onProjectFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (f) toast((await importFile(f)) ? '工程已导入' : '工程文件无效');
    input.value = '';
  }

  function onBodyFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (f) bodyImport.set(f);
    input.value = '';
  }
</script>

<header>
  <strong class="logo">🏁 赛车涂装工作室</strong>
  <input class="pname" bind:value={$projectName} title="工程名称" />

  <span class="group-label">细分</span>
  {#each ['低', '中', '高'] as lb, i}
    <button class:active={$subdivision === i} on:click={() => subdivision.set(i)}>{lb}</button>
  {/each}

  <span class="group-label">视图</span>
  <button on:click={() => requestView('side')}>侧视</button>
  <button on:click={() => requestView('top')}>俯视</button>
  <button on:click={() => requestView('threequarter')}>四分之三</button>

  <span class="group-label">聚焦</span>
  <button on:click={() => requestFocus('wheelArch')}>前轮拱</button>
  <button on:click={() => requestFocus('wingEndplate')}>尾翼端板</button>

  <span class="spacer"></span>

  <button
    on:click={() => {
      saveLocal();
      toast('已保存到浏览器');
    }}>保存</button
  >
  <button on:click={exportFile}>导出</button>
  <button on:click={() => projectFile.click()}>导入工程</button>
  <button on:click={() => bodyFile.click()}>导入车身</button>
  <button on:click={() => bodyReset.update((n) => n + 1)}>内置车身</button>

  <input type="file" accept=".json" bind:this={projectFile} on:change={onProjectFile} hidden />
  <input type="file" accept=".obj,.glb,.gltf" bind:this={bodyFile} on:change={onBodyFile} hidden />
</header>

<main>
  <div class="left">
    <Viewport />
    <UnwrapEditor />
  </div>
  <aside>
    <div class="tabs">
      <button class:active={tab === 'decals'} on:click={() => (tab = 'decals')}>贴花 ({$decals.length})</button>
      <button class:active={tab === 'materials'} on:click={() => (tab = 'materials')}>材质</button>
    </div>
    {#if tab === 'decals'}
      <DecalPanel />
    {:else}
      <MaterialPanel />
    {/if}
  </aside>
</main>

{#if $statusMessage}
  <div class="toast">{$statusMessage}</div>
{/if}

<style>
  header {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 6px 10px;
    background: #141922;
    border-bottom: 1px solid #232b38;
    flex-wrap: wrap;
  }
  .logo {
    margin-right: 4px;
    white-space: nowrap;
  }
  .pname {
    width: 130px;
    background: #0d1219;
    border: 1px solid #2e3a4c;
    color: #dde3ea;
    border-radius: 4px;
    padding: 4px 6px;
  }
  .group-label {
    color: #66738a;
    font-size: 12px;
    margin-left: 8px;
  }
  .spacer {
    flex: 1;
  }
  main {
    flex: 1;
    display: flex;
    min-height: 0;
  }
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  aside {
    width: 320px;
    flex: none;
    border-left: 1px solid #232b38;
    background: #11151d;
    overflow-y: auto;
  }
  .tabs {
    display: flex;
    gap: 6px;
    padding: 8px 10px 0;
  }
  .toast {
    position: fixed;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    background: #1f6f43;
    color: #eafff2;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    box-shadow: 0 4px 16px #000a;
    z-index: 10;
  }
</style>
