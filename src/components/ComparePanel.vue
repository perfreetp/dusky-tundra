<template>
  <section class="panel" :class="{ disabled: !state.loaded }">
    <h2><span class="step">③</span> 应力着色与剖切对比</h2>

    <h3>应力着色(蓝 → 红)</h3>
    <div class="legend" :style="{ background: legendGradient }"></div>
    <div class="legend-labels">
      <span>0</span>
      <span>{{ capLabel }} MPa</span>
    </div>
    <label class="check">
      <input type="checkbox" v-model="autoCap" /> 自动色标上限(当前最大应力)
    </label>
    <div v-if="!autoCap" class="row">
      <input type="number" min="1" v-model.number="manualCap" class="cap-input" />
      <span class="unit">MPa</span>
    </div>

    <h3>外壳显示</h3>
    <label class="check">
      外壳不透明度
      <input
        type="range"
        min="0.05"
        max="1"
        step="0.01"
        v-model.number="state.shellOpacity"
        class="slider inline"
      />
      {{ state.shellOpacity.toFixed(2) }}
    </label>

    <h3>变形前后对比</h3>
    <label class="check">
      <input type="checkbox" v-model="state.showGhost" /> 叠加原始车架(线框)
    </label>

    <h3>剖切平面</h3>
    <label class="check">
      <input type="checkbox" v-model="state.clipEnabled" /> 启用剖切(查看内部梁弯曲)
    </label>
    <div class="row axis-row">
      <button
        v-for="a in axes"
        :key="a"
        class="axis-btn"
        :class="{ active: state.clipAxis === a }"
        @click="state.clipAxis = a"
      >
        {{ a.toUpperCase() }} 轴
      </button>
    </div>
    <input
      type="range"
      :min="state.clipRange[0]"
      :max="state.clipRange[1]"
      :step="(state.clipRange[1] - state.clipRange[0]) / 200 || 0.01"
      v-model.number="state.clipPos"
      class="slider"
      :disabled="!state.clipEnabled"
    />
    <p class="hint">也可在视口中直接拖拽橙色剖切面沿轴向移动。</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { state } from '../lib/store';
import { STRESS_LEGEND_GRADIENT } from '../lib/colors';

const axes = ['x', 'y', 'z'] as const;
const legendGradient = STRESS_LEGEND_GRADIENT;

const autoCap = ref(true);
const manualCap = ref(1000);

watch([autoCap, manualCap], () => {
  state.stressCap = autoCap.value ? 0 : Math.max(1, manualCap.value);
});

const capLabel = computed(() =>
  autoCap.value
    ? Math.max(state.stats.maxStress, 1).toFixed(0)
    : manualCap.value.toFixed(0),
);
</script>

<style scoped>
.legend {
  height: 12px;
  border-radius: 4px;
}
.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9aa5b8;
  margin: 2px 0 8px;
}
.check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  margin: 4px 0;
  flex-wrap: wrap;
}
.slider.inline {
  flex: 1;
  min-width: 60px;
}
.axis-row {
  gap: 6px;
}
.axis-btn {
  flex: 1;
  background: #1c222d;
  border: 1px solid #333c4d;
  color: #c6cedd;
  border-radius: 6px;
  padding: 5px 0;
  cursor: pointer;
  font-size: 12px;
}
.axis-btn.active {
  border-color: #ff8c1a;
  color: #ffb454;
}
.cap-input {
  width: 80px;
}
.unit {
  font-size: 12px;
  color: #9aa5b8;
}
.disabled {
  opacity: 0.55;
  pointer-events: none;
}
</style>
