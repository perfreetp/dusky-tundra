<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { SceneManager } from '../scene/SceneManager';
import { useStore } from '../store';
import { LOD_TIERS, type Branch, type Variety } from '../types';
import type { MonotoneCurve } from '../core/mathUtils';

const emit = defineEmits<{ (e: 'engine-ready', name: string): void }>();

const store = useStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const engineName = ref('初始化中…');
const lodCounts = ref<number[]>(new Array(LOD_TIERS).fill(0));
const petalInstances = ref(0);
let mgr: SceneManager | null = null;

onMounted(async () => {
  if (!canvasRef.value) return;
  mgr = new SceneManager(canvasRef.value);
  engineName.value = await mgr.init();
  emit('engine-ready', engineName.value);
  if (import.meta.env.DEV) {
    (window as unknown as { __sceneManager: SceneManager }).__sceneManager = mgr;
  }

  const ro = new ResizeObserver(() => mgr?.resize());
  ro.observe(canvasRef.value);
  onBeforeUnmount(() => ro.disconnect());

  if (store.state.branches.length) {
    mgr.updateScaffold(store.state.branches as Branch[]);
    mgr.updateBloom(
      store.state.branches as Branch[],
      store.activeVariety.value as Variety,
      store.activeCurve.value as MonotoneCurve,
      store.state.timelineGdd
    );
    refreshStats();
  } else if (new URLSearchParams(window.location.search).has('demo')) {
    // 演示模式：自动摆放花枝并推进到半开，便于快速预览
    (window as unknown as { __demoMode: boolean }).__demoMode = true;
    const single = new URLSearchParams(window.location.search).has('single');
    store.scatterBranches(single ? 1 : 200);
    store.setTimelineGdd(store.totalGdd.value * 0.55);
  }
});

function refreshStats(): void {
  if (!mgr) return;
  lodCounts.value = mgr.getLodCounts();
  petalInstances.value = mgr.getTotalPetalInstances();
}

// 花枝布局变化 → 重建茎/叶 + 花朵（数组 push/splice 为深层变更，需 deep）
watch(
  () => store.state.branches,
  (branches) => {
    if (!mgr) return;
    mgr.updateScaffold(branches as Branch[]);
    mgr.updateBloom(
      branches as Branch[],
      store.activeVariety.value as Variety,
      store.activeCurve.value as MonotoneCurve,
      store.state.timelineGdd
    );
    refreshStats();
  },
  { deep: true }
);

// 时间轴拖动 → 只重算花朵形变/着色
watch(
  () => store.state.timelineGdd,
  (gdd) => {
    if (!mgr || !store.state.branches.length) return;
    mgr.updateBloom(
      store.state.branches as Branch[],
      store.activeVariety.value as Variety,
      store.activeCurve.value as MonotoneCurve,
      gdd
    );
    refreshStats();
  }
);

// 品种切换
watch(
  () => store.state.activeVarietyId,
  () => {
    if (!mgr || !store.state.branches.length) return;
    mgr.rebuildVariety(store.activeVariety.value as Variety);
    mgr.updateBloom(
      store.state.branches as Branch[],
      store.activeVariety.value as Variety,
      store.activeCurve.value as MonotoneCurve,
      store.state.timelineGdd
    );
    refreshStats();
  }
);

// 当前品种的花瓣参数变化 → 重建曲面后重算
watch(
  () => JSON.stringify(store.activeVariety.value.petal),
  () => {
    if (!mgr) return;
    mgr.rebuildVariety(store.activeVariety.value as Variety);
    if (store.state.branches.length) {
      mgr.updateBloom(
        store.state.branches as Branch[],
        store.activeVariety.value as Variety,
        store.activeCurve.value as MonotoneCurve,
        store.state.timelineGdd
      );
      refreshStats();
    }
  }
);

// 曲线控制点 / 着色变化 → 全部花枝按新曲线重算形变并刷新着色
watch(
  () => JSON.stringify({ c: store.activeVariety.value.curve, col: store.activeVariety.value.color }),
  () => {
    if (!mgr || !store.state.branches.length) return;
    mgr.updateBloom(
      store.state.branches as Branch[],
      store.activeVariety.value as Variety,
      store.activeCurve.value as MonotoneCurve,
      store.state.timelineGdd
    );
    refreshStats();
  }
);

onBeforeUnmount(() => {
  mgr?.dispose();
  mgr = null;
});
</script>

<template>
  <div class="viewport-wrap">
    <canvas ref="canvasRef"></canvas>
    <div class="viewport-hud">
      花枝数 <b>{{ store.state.branches.length }}</b> 支 ·
      花瓣薄实例 <b>{{ petalInstances }}</b><br />
      LOD 分档实例数（按开放度 0→1）：
      <b>{{ lodCounts.join(' / ') }}</b>
    </div>
  </div>
</template>
