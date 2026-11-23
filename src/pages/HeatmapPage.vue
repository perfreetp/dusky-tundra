<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../stores/suitability'
import { getRamp, BAND_LABELS } from '../core/ramps'
import WeightSliders from '../components/WeightSliders.vue'
import ColorRampPicker from '../components/ColorRampPicker.vue'

const store = useStore()

const ramp = computed(() => getRamp(store.rampId))

/** 高适宜区(≥0.7)面积占比,随重算联动 */
const highRatio = computed(() => {
  store.dataVersion // 依赖重算
  const g = store.grid
  if (!g) return 0
  let n = 0
  for (let i = 0; i < g.suit.length; i++) if (g.suit[i] >= 0.7) n++
  return n / g.suit.length
})

const meanSuit = computed(() => {
  store.dataVersion
  const g = store.grid
  if (!g) return 0
  let s = 0
  for (let i = 0; i < g.suit.length; i++) s += g.suit[i]
  return s / g.suit.length
})
</script>

<template>
  <div>
    <WeightSliders />

    <ColorRampPicker />

    <div class="section">
      <h3>热力图显示</h3>
      <div class="switch-row">
        <span>适宜度热力图</span>
        <input type="checkbox" class="toggle" v-model="store.layers.heatmap" @change="store.saveLocal()" />
      </div>
      <div class="row" v-if="store.layers.heatmap">
        <label>不透明度</label>
        <input
          type="range"
          min="10"
          max="100"
          :value="Math.round(store.heatmapOpacity * 100)"
          @input="store.heatmapOpacity = Number(($event.target as HTMLInputElement).value) / 100; store.saveLocal()"
        />
      </div>
    </div>

    <div class="section">
      <h3>图例({{ ramp.name }})</h3>
      <div v-for="(label, i) in BAND_LABELS" :key="label" class="legend-band">
        <span class="swatch" :style="{ background: ramp.colors[i] }"></span>
        <span>{{ (i * 0.2).toFixed(1) }} – {{ ((i + 1) * 0.2).toFixed(1) }} {{ label }}</span>
      </div>
    </div>

    <div class="section">
      <h3>全域统计</h3>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="k">平均适宜度</div>
          <div class="v">{{ meanSuit.toFixed(3) }}</div>
        </div>
        <div class="stat-card">
          <div class="k">高适宜区占比(≥0.7)</div>
          <div class="v">{{ (highRatio * 100).toFixed(1) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>
