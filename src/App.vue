<template>
  <div class="app">
    <header class="topbar">
      <h1>车架碰撞变形与应力可视化</h1>
      <span class="sub">Vue3 · TypeScript · three.js · manifold-3d</span>
    </header>
    <div class="body">
      <div class="sidebar">
        <ImportPanel />
        <CollisionPanel />
        <ComparePanel />
        <ExportPanel />
      </div>
      <main class="main">
        <Viewport />
      </main>
      <StatsBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import ImportPanel from './components/ImportPanel.vue';
import CollisionPanel from './components/CollisionPanel.vue';
import ComparePanel from './components/ComparePanel.vue';
import ExportPanel from './components/ExportPanel.vue';
import StatsBar from './components/StatsBar.vue';
import Viewport from './components/Viewport.vue';
</script>

<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
  margin: 0;
}
body {
  font-family: 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif;
  background: #14181f;
  color: #dde4ef;
  font-size: 13px;
}
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.topbar {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
  background: #181d26;
  border-bottom: 1px solid #262e3d;
}
.topbar h1 {
  font-size: 16px;
  margin: 0;
}
.topbar .sub {
  font-size: 11px;
  color: #7c8698;
}
.body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.sidebar {
  width: 320px;
  flex-shrink: 0;
  overflow-y: auto;
  background: #181d26;
  border-right: 1px solid #262e3d;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.main {
  flex: 1;
  min-width: 0;
  position: relative;
}

/* 面板通用样式 */
.panel {
  background: #1c222d;
  border: 1px solid #262e3d;
  border-radius: 8px;
  padding: 12px;
}
.panel h2 {
  font-size: 13px;
  margin: 0 0 8px;
  color: #dde4ef;
  font-weight: 600;
}
.panel h2 .step {
  color: #ff8c1a;
}
.panel h3 {
  font-size: 12px;
  color: #9aa5b8;
  margin: 12px 0 6px;
  font-weight: 500;
}
.panel .row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 6px 0;
  flex-wrap: wrap;
}
.panel .hint {
  font-size: 11px;
  color: #6b7484;
  margin: 6px 0 0;
}
.btn {
  background: #2a3342;
  border: 1px solid #3a4356;
  color: #dde4ef;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 12px;
  cursor: pointer;
}
.btn:hover {
  background: #333e52;
}
.btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.btn.primary {
  background: #b35c12;
  border-color: #d97a1f;
}
.btn.primary:hover {
  background: #d97a1f;
}
.btn.secondary {
  background: #232a37;
}
.btn.mini {
  padding: 2px 6px;
  font-size: 11px;
}
.file-btn {
  display: inline-block;
  background: #2a3342;
  border: 1px solid #3a4356;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 12px;
  cursor: pointer;
}
.file-btn:hover {
  background: #333e52;
}
input[type='number'],
input[type='text'],
.name-input,
.prefix-input {
  background: #14181f;
  border: 1px solid #333c4d;
  color: #dde4ef;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 12px;
}
input[type='range'] {
  accent-color: #ff8c1a;
}
</style>
