<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../store';

const store = useStore();
const W = 320;
const H = 240;
const PAD = 30;
const svgRef = ref<SVGSVGElement | null>(null);
const dragIndex = ref<number | null>(null);

const variety = computed(() => store.activeVariety.value);
const maxGdd = computed(() => Math.max(...variety.value.curve.map((p) => p.gdd), 100));

const xOf = (gdd: number): number => PAD + (gdd / maxGdd.value) * (W - PAD * 2);
const yOf = (open: number): number => H - PAD - open * (H - PAD * 2);
const gddOfX = (x: number): number =>
  Math.max(0, ((x - PAD) / (W - PAD * 2)) * maxGdd.value);
const openOfY = (y: number): number =>
  Math.min(1, Math.max(0, (H - PAD - y) / (H - PAD * 2)));

const pathD = computed(() =>
  variety.value.curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.gdd).toFixed(1)} ${yOf(p.open).toFixed(1)}`)
    .join(' ')
);

const harvest = computed(() => store.harvestWindowGdd.value);
const bandX = computed(() => ({
  left: harvest.value.gddMin === null ? 0 : xOf(harvest.value.gddMin),
  right: harvest.value.gddMax === null ? W - PAD : xOf(harvest.value.gddMax)
}));

const currentX = computed(() =>
  xOf(Math.min(store.state.timelineGdd, maxGdd.value))
);

function eventToSvg(evt: PointerEvent): { x: number; y: number } {
  const svg = svgRef.value;
  if (!svg) return { x: 0, y: 0 };
  const rect = svg.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / rect.width) * W,
    y: ((evt.clientY - rect.top) / rect.height) * H
  };
}

function onPointerDown(evt: PointerEvent, index: number): void {
  dragIndex.value = index;
  (evt.target as Element).setPointerCapture(evt.pointerId);
}

function onPointerMove(evt: PointerEvent): void {
  if (dragIndex.value === null) return;
  const { x, y } = eventToSvg(evt);
  store.updateCurvePoint(dragIndex.value, {
    gdd: Math.round(gddOfX(x)),
    open: Math.round(openOfY(y) * 100) / 100
  });
}

function onPointerUp(): void {
  dragIndex.value = null;
}

function onSvgDblClick(evt: MouseEvent): void {
  const { x, y } = eventToSvg(evt as PointerEvent);
  if (x < PAD || x > W - PAD || y < PAD || y > H - PAD) return;
  const gdd = Math.round(gddOfX(x));
  const open = Math.round(openOfY(y) * 100) / 100;
  store.insertCurvePoint(gdd, open);
}
</script>

<template>
  <div class="curve-wrap">
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${W} ${H}`"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @dblclick="onSvgDblClick"
    >
      <!-- 网格 -->
      <g stroke="#2c352c" stroke-width="0.5">
        <line v-for="i in 4" :key="`gx${i}`" :x1="PAD" :x2="W - PAD"
          :y1="PAD + ((H - PAD * 2) / 4) * (i - 1)" :y2="PAD + ((H - PAD * 2) / 4) * (i - 1)" />
        <line v-for="i in 4" :key="`gy${i}`" :y1="PAD" :y2="H - PAD"
          :x1="PAD + ((W - PAD * 2) / 4) * (i - 1)" :x2="PAD + ((W - PAD * 2) / 4) * (i - 1)" />
      </g>
      <!-- 采收窗口带 -->
      <rect
        :x="bandX.left" :y="PAD"
        :width="Math.max(2, bandX.right - bandX.left)" :height="H - PAD * 2"
        fill="rgba(224,179,65,0.18)" stroke="rgba(224,179,65,0.6)" stroke-width="1"
      />
      <!-- 当前积温游标 -->
      <line :x1="currentX" :x2="currentX" :y1="PAD" :y2="H - PAD"
        stroke="#7fc36b" stroke-width="1.2" stroke-dasharray="4 3" />
      <!-- 生长曲线 -->
      <path :d="pathD" fill="none" stroke="#d96a86" stroke-width="2" />
      <!-- 控制点 -->
      <g v-for="(p, i) in variety.curve" :key="i">
        <circle
          :cx="xOf(p.gdd)" :cy="yOf(p.open)" r="6"
          fill="#d96a86" stroke="#101410" stroke-width="1.5"
          style="cursor: grab"
          @pointerdown="(e) => onPointerDown(e, i)"
        />
      </g>
      <!-- 轴标签 -->
      <text v-for="i in 5" :key="`lx${i}`" :x="PAD + ((W - PAD * 2) / 4) * (i - 1)"
        :y="H - 10" fill="#9aa898" font-size="9" text-anchor="middle">
        {{ Math.round((maxGdd / 4) * (i - 1)) }}
      </text>
      <text v-for="i in 5" :key="`ly${i}`" :x="8"
        :y="H - PAD - ((H - PAD * 2) / 4) * (i - 1) + 3" fill="#9aa898" font-size="9">
        {{ ((5 - i) / 4).toFixed(1) }}
      </text>
      <text :x="W / 2" :y="H - 0" fill="#9aa898" font-size="9" text-anchor="middle">积温 GDD（℃·d）</text>
    </svg>
    <p class="note">拖动控制点调整曲线；双击空白处加点；曲线改动后全部花枝按新曲线重算形变。</p>
    <table class="table-mini">
      <thead><tr><th>#</th><th>积温 GDD</th><th>开放度</th><th></th></tr></thead>
      <tbody>
        <tr v-for="(p, i) in variety.curve" :key="i">
          <td>{{ i + 1 }}</td>
          <td><input type="number" :value="p.gdd" min="0"
            @input="store.updateCurvePoint(i, { gdd: Number(($event.target as HTMLInputElement).value) })" /></td>
          <td><input type="number" :value="p.open" min="0" max="1" step="0.01"
            @input="store.updateCurvePoint(i, { open: Number(($event.target as HTMLInputElement).value) })" /></td>
          <td>
            <button class="btn danger" style="padding:2px 8px"
              @click="store.removeCurvePoint(i)">×</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
