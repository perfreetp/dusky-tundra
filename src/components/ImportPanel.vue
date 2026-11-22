<template>
  <section class="panel">
    <h2><span class="step">①</span> 车架导入与材料分区</h2>

    <div class="row">
      <label class="file-btn">
        导入网格文件
        <input type="file" accept=".stl,.obj,.gltf,.glb" @change="onFile" hidden />
      </label>
      <button class="btn secondary" :disabled="state.loading" @click="loadDemo">
        {{ state.loading ? '生成中…' : '加载示例车架' }}
      </button>
    </div>
    <p class="hint">支持 STL / OBJ / GLTF / GLB;示例车架由 manifold-3d 布尔运算生成(半透明外壳 + 内部梁)。</p>
    <p v-if="meshData.fileName" class="file-name">当前:{{ meshData.fileName }}</p>
    <p v-if="state.error" class="error">{{ state.error }}</p>

    <template v-if="state.loaded">
      <h3>材料分区(按车架 X 向区间)</h3>
      <div class="zone-bar">
        <div
          v-for="z in state.zones"
          :key="z.id"
          class="zone-seg"
          :style="{ left: z.xMin * 100 + '%', width: (z.xMax - z.xMin) * 100 + '%', background: z.color }"
          :title="z.name"
        ></div>
      </div>
      <table class="zone-table">
        <thead>
          <tr><th>分区</th><th>起点%</th><th>终点%</th><th>屈服 MPa</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="z in state.zones" :key="z.id">
            <td><input v-model="z.name" class="name-input" /></td>
            <td><input type="number" min="0" max="100" :value="z.xMin * 100" @change="z.xMin = pct($event)" /></td>
            <td><input type="number" min="0" max="100" :value="z.xMax * 100" @change="z.xMax = pct($event)" /></td>
            <td><input type="number" min="1" v-model.number="z.yieldStrength" /></td>
            <td><button class="mini" @click="removeZone(z.id)">✕</button></td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <button class="btn secondary" @click="addZone">+ 添加分区</button>
        <button class="btn" @click="applyZones">应用分区</button>
        <label class="check">
          <input type="checkbox" v-model="state.showZoneColors" /> 分区着色预览
        </label>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { meshData, state, loadParts, applyZones } from '../lib/store';
import { parseMeshFile } from '../lib/meshIO';
import { generateDemoFrame } from '../lib/frameGen';

function pct(ev: Event): number {
  const v = Number((ev.target as HTMLInputElement).value);
  return Math.min(1, Math.max(0, v / 100));
}

async function onFile(ev: Event): Promise<void> {
  const file = (ev.target as HTMLInputElement).files?.[0];
  if (!file) return;
  state.loading = true;
  state.error = '';
  try {
    const part = await parseMeshFile(file);
    await loadParts([part], file.name);
  } catch (e) {
    state.error = e instanceof Error ? e.message : String(e);
  } finally {
    state.loading = false;
  }
  (ev.target as HTMLInputElement).value = '';
}

async function loadDemo(): Promise<void> {
  state.loading = true;
  state.error = '';
  try {
    const { parts } = await generateDemoFrame();
    await loadParts(parts, '示例车架 (manifold-3d)');
  } catch (e) {
    state.error = e instanceof Error ? e.message : String(e);
  } finally {
    state.loading = false;
  }
}

let nextId = 100;
function addZone(): void {
  state.zones.push({
    id: nextId++,
    name: `分区 ${state.zones.length + 1}`,
    xMin: 0,
    xMax: 1,
    yieldStrength: 400,
    color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`,
  });
}

function removeZone(id: number): void {
  if (state.zones.length <= 1) return;
  const i = state.zones.findIndex((z) => z.id === id);
  if (i >= 0) state.zones.splice(i, 1);
}
</script>

<style scoped>
.zone-bar {
  position: relative;
  height: 14px;
  border-radius: 4px;
  background: #1c222d;
  margin: 6px 0 10px;
  overflow: hidden;
}
.zone-seg {
  position: absolute;
  top: 0;
  bottom: 0;
  opacity: 0.75;
  border-right: 1px solid #14181f;
}
.zone-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.zone-table th,
.zone-table td {
  padding: 3px 4px;
  text-align: left;
}
.zone-table input[type='number'] {
  width: 58px;
}
.name-input {
  width: 88px;
}
.file-name {
  font-size: 12px;
  color: #8fd18f;
  word-break: break-all;
}
.error {
  color: #ff6b6b;
  font-size: 12px;
}
.check {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
