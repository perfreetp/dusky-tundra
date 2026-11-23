<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '../stores/suitability'
import { mapService } from '../map/mapService'
import { getRamp } from '../core/ramps'
import { exportConfigFile, parseImportFile, type ExportPayload } from '../core/persistence'

const store = useStore()
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const stats = computed(() => store.regionStats)
const avgColor = computed(() => {
  if (!stats.value) return '#1d4d33'
  const ramp = getRamp(store.rampId)
  return ramp.colors[Math.min(4, Math.floor(stats.value.avg * 5))]
})

function startDraw(mode: 'rect' | 'polygon') {
  if (!mapService.drawer) {
    message.value = '地图尚未加载完成,请稍候'
    return
  }
  message.value = mode === 'rect' ? '在地图上按住拖拽绘制矩形' : '单击添加顶点,双击结束多边形,Esc 取消'
  mapService.drawer.start(mode)
}

function clearRegion() {
  mapService.drawer?.clear()
  store.setRegion(null)
  message.value = ''
}

function doExport() {
  const payload: ExportPayload = {
    type: 'wetland-habitat-suitability',
    version: 1,
    exportedAt: new Date().toISOString(),
    config: {
      weights: { ...store.weights },
      rampId: store.rampId,
      layers: { ...store.layers },
      heatmapOpacity: store.heatmapOpacity,
      waterOpacity: store.waterOpacity,
      vegetationOpacity: store.vegetationOpacity,
      mode3D: store.mode3D,
      heightExaggeration: store.heightExaggeration,
      pointCount: store.pointCount,
    },
    region: store.region,
    regionStats: store.regionStats,
  }
  exportConfigFile(payload)
  message.value = '已导出配置文件'
}

function triggerImport() {
  fileInput.value?.click()
}

async function onImportFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  const result = parseImportFile(await file.text())
  if (!result.ok) {
    message.value = `导入失败:${result.message}`
    return
  }
  const { config, region } = result.payload
  store.applyConfig(config as Parameters<typeof store.applyConfig>[0])
  if (region) store.setRegion(region)
  store.recompute()
  store.saveLocal()
  message.value = '导入成功,配置与圈选范围已恢复'
}

function doReset() {
  clearRegion()
  store.resetConfig()
  message.value = '已恢复默认配置'
}
</script>

<template>
  <div>
    <div class="section">
      <h3>圈选评估区域</h3>
      <div class="btn-row">
        <button class="btn" :disabled="!mapService.ready" @click="startDraw('rect')">矩形圈选</button>
        <button class="btn" :disabled="!mapService.ready" @click="startDraw('polygon')">多边形圈选</button>
        <button class="btn danger" :disabled="!store.region" @click="clearRegion">清除</button>
      </div>
      <p class="hint" v-if="message">{{ message }}</p>
      <p class="hint" v-else>圈选后自动统计区域平均适宜度;权重调整时区域统计同步重算。</p>
    </div>

    <div class="section" v-if="stats">
      <h3>区域统计</h3>
      <div class="stat-grid">
        <div class="stat-card" style="grid-column: 1 / -1">
          <div class="k">区域平均适宜度</div>
          <div class="v" :style="{ color: avgColor, fontSize: '26px' }">{{ stats.avg.toFixed(3) }}</div>
        </div>
        <div class="stat-card">
          <div class="k">最低 / 最高</div>
          <div class="v" style="font-size: 15px">{{ stats.min.toFixed(2) }} / {{ stats.max.toFixed(2) }}</div>
        </div>
        <div class="stat-card">
          <div class="k">区域面积</div>
          <div class="v" style="font-size: 15px">{{ stats.areaKm2.toFixed(2) }} km²</div>
        </div>
        <div class="stat-card">
          <div class="k">覆盖格网数</div>
          <div class="v" style="font-size: 15px">{{ stats.cellCount }}</div>
        </div>
        <div class="stat-card">
          <div class="k">区内点位 / 平均适宜度</div>
          <div class="v" style="font-size: 15px">{{ stats.pointCount }} / {{ stats.pointAvgSuit.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>配置与分享</h3>
      <p class="hint">权重、色带、图层开关与圈选范围已自动保存到浏览器本地。</p>
      <div class="btn-row">
        <button class="btn" @click="doExport">导出配置文件</button>
        <button class="btn secondary" @click="triggerImport">导入配置</button>
        <button class="btn danger" @click="doReset">恢复默认</button>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        style="display: none"
        @change="onImportFile"
      />
    </div>
  </div>
</template>
