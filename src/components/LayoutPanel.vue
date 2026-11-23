<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '../store';
import type { SchemeFile } from '../types';

const store = useStore();
const s = store.state;
const scatterCount = ref(200);
const importError = ref('');

async function onImportFile(evt: Event): Promise<void> {
  importError.value = '';
  const input = evt.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text) as SchemeFile;
    const result = store.importScheme(data);
    if (!result.ok) importError.value = result.error ?? '导入失败';
  } catch (e) {
    importError.value = `文件解析失败：${(e as Error).message}`;
  } finally {
    input.value = '';
  }
}

function onExport(): void {
  const scheme = store.exportScheme();
  const blob = new Blob([JSON.stringify(scheme, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rose-bloom-scheme-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <div class="section">
      <h3>花枝布局（实例化合批渲染）</h3>
      <div class="field">
        <label>摆放数量</label>
        <input type="range" min="1" max="200" step="1" v-model.number="scatterCount" />
        <output>{{ scatterCount }}</output>
      </div>
      <div class="btn-row">
        <button class="btn primary" @click="store.scatterBranches(scatterCount)">摆放花枝</button>
        <button class="btn" @click="store.scatterBranches(1)">单支试摆</button>
        <button class="btn danger" @click="store.clearBranches()">清空地块</button>
      </div>
      <p class="note">
        全部花瓣按 LOD 分档合并为薄实例网格，茎段与叶片同样合批；200 支花约 1.5 万花瓣实例，仅个位数 Draw Call。
      </p>
    </div>

    <div class="section">
      <h3>整枝模型</h3>
      <p class="note">
        每支花枝含 Catmull-Rom 轻微弯曲茎秆（12 段）、3 片错落分布的参数化曲面叶片与 5 片随开放度外翻的萼片；
        位置、朝向、缩放与积温偏移均由确定性随机种子生成，可随方案完整还原。
      </p>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="num">{{ s.branches.length }}</div>
          <div class="lbl">当前花枝数</div>
        </div>
        <div class="stat-card">
          <div class="num">{{ s.branches.reduce((m, b) => Math.max(m, b.gddOffset), 0).toFixed(0) }}</div>
          <div class="lbl">最大积温偏移 GDD</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>方案分享（JSON）</h3>
      <div class="btn-row">
        <button class="btn primary" @click="onExport">导出方案 JSON</button>
        <label class="btn" style="cursor:pointer">
          导入方案 JSON
          <input type="file" accept="application/json,.json" style="display:none" @change="onImportFile" />
        </label>
      </div>
      <p class="note">导出内容：积温设置、采收阈值、全部品种的曲线控制点与花瓣参数、花枝布局与时间轴位置；导入后曲线与布局完整还原。</p>
      <p v-if="importError" class="note" style="color:#e89a9a">{{ importError }}</p>
    </div>
  </div>
</template>
