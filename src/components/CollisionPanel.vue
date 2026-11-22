<template>
  <section class="panel" :class="{ disabled: !state.loaded }">
    <h2><span class="step">②</span> 碰撞施加与变形计算</h2>

    <h3>碰撞方向(6 预设)</h3>
    <div class="preset-grid">
      <button
        v-for="(p, i) in presets"
        :key="p.name"
        class="preset"
        :class="{ active: state.presetIndex === i }"
        @click="state.presetIndex = i"
      >
        {{ p.name }}
      </button>
    </div>

    <h3>碰撞冲量:{{ state.impulse.toLocaleString() }} kN·s</h3>
    <input
      type="range"
      min="1000"
      max="30000"
      step="500"
      v-model.number="state.impulse"
      class="slider"
    />

    <button class="btn primary big" :disabled="!state.loaded || state.computing" @click="applyCollision">
      {{ state.computing ? '计算中…' : '施加碰撞' }}
    </button>
    <button class="btn secondary" :disabled="!state.loaded || state.computing" @click="resetFrame">
      重置车架
    </button>

    <template v-if="state.collisions.length">
      <h3>碰撞历史(对同一车架累积)</h3>
      <ul class="history">
        <li v-for="c in state.collisions" :key="c.id">
          #{{ c.id }} {{ c.presetName }} · {{ c.impulse.toLocaleString() }} kN·s ·
          峰值 {{ c.maxStress.toFixed(0) }} MPa · {{ c.timeMs.toFixed(0) }} ms
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup lang="ts">
import { state, applyCollision, resetFrame } from '../lib/store';
import { COLLISION_PRESETS } from '../lib/types';

const presets = COLLISION_PRESETS;
</script>

<style scoped>
.preset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.preset {
  background: #1c222d;
  border: 1px solid #333c4d;
  color: #c6cedd;
  border-radius: 6px;
  padding: 7px 4px;
  font-size: 12px;
  cursor: pointer;
}
.preset.active {
  border-color: #ff8c1a;
  color: #ffb454;
  background: #2a2320;
}
.slider {
  width: 100%;
  margin: 4px 0 10px;
}
.big {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 6px;
}
.history {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  max-height: 130px;
  overflow-y: auto;
  font-size: 12px;
  color: #9aa5b8;
}
.history li {
  padding: 3px 0;
  border-bottom: 1px solid #232a37;
}
.disabled {
  opacity: 0.55;
  pointer-events: none;
}
</style>
