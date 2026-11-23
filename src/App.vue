<script setup lang="ts">
import { onMounted } from 'vue'
import MapContainer from './map/MapContainer.vue'
import { useStore } from './stores/suitability'

const store = useStore()
onMounted(() => store.init())

const steps = [
  { path: '/base', num: 1, label: '底图图层', desc: '水域与植被' },
  { path: '/heatmap', num: 2, label: '适宜度热力', desc: '权重与色带' },
  { path: '/points', num: 3, label: '鸟群点位', desc: '三维与密度' },
  { path: '/region', num: 4, label: '区域评估', desc: '圈选与导出' },
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <header class="app-header">
        <h1>湿地鸟类栖息地<br />适宜度分析</h1>
        <p>水深 × 植被覆盖 双因子评估</p>
      </header>
      <nav class="step-nav">
        <router-link
          v-for="s in steps"
          :key="s.path"
          :to="s.path"
          class="step-link"
          active-class="active"
        >
          <span class="step-num">{{ s.num }}</span>
          <span class="step-text">
            <strong>{{ s.label }}</strong>
            <small>{{ s.desc }}</small>
          </span>
        </router-link>
      </nav>
      <div class="panel-body">
        <router-view />
      </div>
      <footer class="app-footer">流程:看底图 → 调权重看热力 → 查点位 → 圈选评估并导出</footer>
    </aside>
    <main class="map-area">
      <MapContainer />
    </main>
  </div>
</template>
