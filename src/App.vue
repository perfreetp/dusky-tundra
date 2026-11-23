<script setup lang="ts">
import { ref } from 'vue';
import Viewport3D from './components/Viewport3D.vue';
import GddPanel from './components/GddPanel.vue';
import VarietyPanel from './components/VarietyPanel.vue';
import LayoutPanel from './components/LayoutPanel.vue';
import TimelineBar from './components/TimelineBar.vue';

const tab = ref<'gdd' | 'variety' | 'layout'>('gdd');
const engineName = ref('引擎初始化中…');

function onEngineReady(name: string): void {
  engineName.value = name;
}
</script>

<template>
  <header class="app-header">
    <h1>月季花期生长可视化</h1>
    <span class="sub">鲜切花基地 · 采收窗口推演（积温驱动 · 参数化花瓣 · 实例化渲染）</span>
    <span class="engine-badge">Babylon.js · {{ engineName }}</span>
  </header>
  <main class="app-main">
    <aside class="sidebar">
      <nav class="tab-row">
        <button :class="{ active: tab === 'gdd' }" @click="tab = 'gdd'">积温页</button>
        <button :class="{ active: tab === 'variety' }" @click="tab = 'variety'">品种页</button>
        <button :class="{ active: tab === 'layout' }" @click="tab = 'layout'">布局 / 方案</button>
      </nav>
      <div class="tab-body">
        <GddPanel v-show="tab === 'gdd'" />
        <VarietyPanel v-show="tab === 'variety'" />
        <LayoutPanel v-show="tab === 'layout'" />
      </div>
    </aside>
    <section class="viewport-col">
      <Viewport3D @engine-ready="onEngineReady" />
      <TimelineBar />
    </section>
  </main>
</template>
