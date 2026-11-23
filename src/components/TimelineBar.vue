<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from '../store';

const store = useStore();
const s = store.state;
const maxGdd = store.totalGdd;
const windowInfo = store.harvestWindowGdd;

const bandStyle = computed(() => {
  const lo = windowInfo.value.gddMin;
  const hi = windowInfo.value.gddMax;
  if (lo === null || hi === null || maxGdd.value <= 0) return { display: 'none' };
  const left = (Math.min(lo, maxGdd.value) / maxGdd.value) * 100;
  const right = (Math.min(hi, maxGdd.value) / maxGdd.value) * 100;
  return { left: `${left}%`, width: `${Math.max(0.5, right - left)}%` };
});

const markerLo = computed(() =>
  windowInfo.value.gddMin === null ? null : (windowInfo.value.gddMin / maxGdd.value) * 100
);
const markerHi = computed(() =>
  windowInfo.value.gddMax === null ? null : (windowInfo.value.gddMax / maxGdd.value) * 100
);

const currentDay = computed(() => {
  const gain = Math.max(0.1, s.gdd.dailyAvgTemp - s.gdd.baseTemp);
  return s.timelineGdd / gain;
});

const currentOpen = computed(() => store.activeCurve.value.evaluate(s.timelineGdd));

/** 回放：requestAnimationFrame 推进积温，到末尾自动停止并回到起点 */
let raf = 0;
let lastT = 0;
const playLabel = ref('▶ 回放全程');

watch(
  () => s.playing,
  (playing) => {
    if (playing) {
      playLabel.value = '⏸ 暂停';
      lastT = performance.now();
      const tick = (t: number): void => {
        const dt = (t - lastT) / 1000;
        lastT = t;
        // 全程按约 12 秒播完，再乘速度系数
        const rate = (maxGdd.value / 12) * s.playbackSpeed;
        const next = s.timelineGdd + dt * rate;
        if (next >= maxGdd.value) {
          store.setTimelineGdd(maxGdd.value);
          store.setPlaying(false);
          return;
        }
        store.setTimelineGdd(next);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      playLabel.value = '▶ 回放全程';
      cancelAnimationFrame(raf);
    }
  }
);

function togglePlay(): void {
  if (!s.playing && s.timelineGdd >= maxGdd.value - 1e-6) {
    store.setTimelineGdd(0);
  }
  store.setPlaying(!s.playing);
}

function resetTimeline(): void {
  store.setPlaying(false);
  store.setTimelineGdd(0);
}

onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <div class="timeline-bar">
    <div class="harvest-track">
      <div class="harvest-window-band" :style="bandStyle"></div>
      <div v-if="markerLo !== null" class="harvest-marker" :style="{ left: markerLo + '%' }"></div>
      <div v-if="markerHi !== null" class="harvest-marker" :style="{ left: markerHi + '%' }"></div>
    </div>
    <div class="timeline-top">
      <button class="btn primary" @click="togglePlay">{{ playLabel }}</button>
      <button class="btn" @click="resetTimeline">⏮ 回起点</button>
      <input
        type="range"
        min="0"
        :max="maxGdd"
        step="1"
        :value="s.timelineGdd"
        @input="store.setTimelineGdd(Number(($event.target as HTMLInputElement).value))"
      />
      <select style="width:84px" :value="s.playbackSpeed"
        @change="store.setPlaybackSpeed(Number(($event.target as HTMLSelectElement).value))">
        <option :value="0.5">0.5×</option>
        <option :value="1">1×</option>
        <option :value="2">2×</option>
        <option :value="4">4×</option>
      </select>
      <div class="timeline-readout">
        GDD <b>{{ s.timelineGdd.toFixed(0) }}</b> / {{ maxGdd.toFixed(0) }}（℃·d）·
        第 <b>{{ currentDay.toFixed(1) }}</b> 天 ·
        开放度 <b>{{ (currentOpen * 100).toFixed(0) }}%</b>
      </div>
    </div>
  </div>
</template>
