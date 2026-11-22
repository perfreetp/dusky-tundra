<template>
  <aside class="stats">
    <h2>计算结果</h2>
    <dl>
      <dt>顶点数 / 三角面</dt>
      <dd>{{ s.vertexCount.toLocaleString() }} / {{ s.triangleCount.toLocaleString() }}</dd>

      <dt>碰撞次数</dt>
      <dd>{{ s.collisionCount }}</dd>

      <dt>初始体积</dt>
      <dd>{{ s.initialVolume.toFixed(4) }} m³</dd>

      <dt>当前体积</dt>
      <dd>{{ s.currentVolume.toFixed(4) }} m³</dd>

      <dt>体积变化</dt>
      <dd :class="volumeClass">
        {{ volumeChange >= 0 ? '+' : '' }}{{ volumeChange.toFixed(4) }} m³
        ({{ volumeChange >= 0 ? '+' : '' }}{{ volumePct.toFixed(2) }}%)
      </dd>

      <dt>最大应力</dt>
      <dd class="stress">{{ s.maxStress.toFixed(1) }} MPa</dd>

      <dt>最大应力点位置</dt>
      <dd class="mono">
        ({{ s.maxStressPoint[0].toFixed(3) }}, {{ s.maxStressPoint[1].toFixed(3) }},
        {{ s.maxStressPoint[2].toFixed(3) }})
      </dd>

      <dt>所在分区</dt>
      <dd>{{ s.maxStressZone || '—' }}</dd>

      <dt>超屈服顶点数</dt>
      <dd :class="{ warn: s.exceededVertices > 0 }">{{ s.exceededVertices.toLocaleString() }}</dd>

      <dt>单次重算耗时</dt>
      <dd>{{ s.lastComputeMs.toFixed(0) }} ms</dd>
    </dl>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { state } from '../lib/store';

const s = state.stats;

const volumeChange = computed(() => s.currentVolume - s.initialVolume);
const volumePct = computed(() =>
  s.initialVolume ? (volumeChange.value / s.initialVolume) * 100 : 0,
);
const volumeClass = computed(() => (volumeChange.value < -1e-6 ? 'warn' : ''));
</script>

<style scoped>
.stats {
  width: 230px;
  flex-shrink: 0;
  background: #181d26;
  border-left: 1px solid #262e3d;
  padding: 14px;
  overflow-y: auto;
}
h2 {
  font-size: 13px;
  color: #ffb454;
  margin: 0 0 10px;
  font-weight: 600;
}
dl {
  margin: 0;
}
dt {
  font-size: 11px;
  color: #7c8698;
  margin-top: 10px;
}
dd {
  margin: 2px 0 0;
  font-size: 14px;
  color: #dde4ef;
}
.mono {
  font-family: 'Consolas', monospace;
  font-size: 12px;
}
.stress {
  color: #ff5f4a;
  font-weight: 600;
}
.warn {
  color: #ffb454;
}
</style>
