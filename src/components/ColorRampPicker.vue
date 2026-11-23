<script setup lang="ts">
import { RAMPS } from '../core/ramps'
import { useStore } from '../stores/suitability'

const store = useStore()
</script>

<template>
  <div class="section">
    <h3>色带(5 档)</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px">
      <button
        v-for="r in RAMPS"
        :key="r.id"
        class="ramp-btn"
        :class="{ active: store.rampId === r.id }"
        @click="store.setRamp(r.id)"
      >
        <span class="ramp-strip">
          <i v-for="c in r.colors" :key="c" :style="{ background: c }"></i>
        </span>
        <span class="ramp-name">{{ r.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.ramp-btn {
  border: 2px solid transparent;
  background: #fff;
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
}

.ramp-btn.active {
  border-color: #1d6b45;
}

.ramp-strip {
  display: flex;
  height: 10px;
  border-radius: 3px;
  overflow: hidden;
}

.ramp-strip i {
  flex: 1;
}

.ramp-name {
  font-size: 12px;
  color: #4a5a50;
  text-align: center;
}
</style>
