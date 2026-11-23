<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../stores/suitability'

const store = useStore()

const depthPct = computed(() => {
  const sum = store.weights.depth + store.weights.veg
  return sum > 0 ? Math.round((store.weights.depth / sum) * 100) : 0
})
const vegPct = computed(() => 100 - depthPct.value)
</script>

<template>
  <div class="section">
    <h3>因子权重 <span class="value">{{ depthPct }}% / {{ vegPct }}%</span></h3>
    <div class="row">
      <label>水深适宜度</label>
      <input
        type="range"
        min="0"
        max="100"
        :value="Math.round(store.weights.depth * 100)"
        @input="store.setWeight('depth', Number(($event.target as HTMLInputElement).value) / 100)"
      />
      <span style="width: 38px; text-align: right">{{ depthPct }}%</span>
    </div>
    <div class="row">
      <label>植被覆盖</label>
      <input
        type="range"
        min="0"
        max="100"
        :value="Math.round(store.weights.veg * 100)"
        @input="store.setWeight('veg', Number(($event.target as HTMLInputElement).value) / 100)"
      />
      <span style="width: 38px; text-align: right">{{ vegPct }}%</span>
    </div>
    <div
      style="
        display: flex;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 6px;
      "
    >
      <div :style="{ width: depthPct + '%', background: '#225ea8' }"></div>
      <div :style="{ width: vegPct + '%', background: '#41ab5d' }"></div>
    </div>
    <p class="hint">拖动滑杆后,适宜度热力图与鸟群点位密度会同步重算。</p>
  </div>
</template>
