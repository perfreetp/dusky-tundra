<template>
  <section class="panel" :class="{ disabled: !state.loaded }">
    <h2><span class="step">④</span> 变形网格与应力数据导出</h2>

    <div class="row">
      <span class="label">文件名前缀</span>
      <input v-model="prefix" class="prefix-input" />
    </div>

    <div class="btn-col">
      <button class="btn" @click="doExportSTL">导出变形网格 STL</button>
      <button class="btn" @click="doExportOBJ">导出变形网格 OBJ</button>
      <button class="btn" @click="doExportCSV">导出应力数据 CSV</button>
      <button class="btn" @click="doExportJSON">导出碰撞报告 JSON</button>
    </div>
    <p class="hint">STL/OBJ 导出当前变形后的几何;CSV 含每顶点坐标、应力与所属材料分区。</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { meshData, state } from '../lib/store';
import { exportOBJ, exportSTL, exportStressCSV, exportReport } from '../lib/meshIO';

const prefix = ref('frame_crash');

function parts() {
  return meshData.parts;
}

function doExportSTL(): void {
  const [first, ...rest] = parts();
  if (!first) return;
  exportSTL(first, rest, `${prefix.value}.stl`);
}

function doExportOBJ(): void {
  if (!parts().length) return;
  exportOBJ(parts(), `${prefix.value}.obj`);
}

function doExportCSV(): void {
  if (!parts().length) return;
  exportStressCSV(parts(), state.zones.map((z) => z.name), `${prefix.value}_stress.csv`);
}

function doExportJSON(): void {
  if (!parts().length) return;
  const s = state.stats;
  exportReport(
    {
      source: meshData.fileName,
      exportedAt: new Date().toISOString(),
      materialZones: state.zones,
      collisions: state.collisions,
      stats: {
        vertexCount: s.vertexCount,
        triangleCount: s.triangleCount,
        initialVolume: s.initialVolume,
        currentVolume: s.currentVolume,
        volumeChange: s.currentVolume - s.initialVolume,
        volumeChangePct: s.initialVolume
          ? ((s.currentVolume - s.initialVolume) / s.initialVolume) * 100
          : 0,
        maxStress: s.maxStress,
        maxStressPoint: s.maxStressPoint,
        maxStressZone: s.maxStressZone,
        exceededVertices: s.exceededVertices,
      },
    },
    `${prefix.value}_report.json`,
  );
}
</script>

<style scoped>
.btn-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.label {
  font-size: 12px;
  color: #9aa5b8;
}
.prefix-input {
  flex: 1;
}
.disabled {
  opacity: 0.55;
  pointer-events: none;
}
</style>
