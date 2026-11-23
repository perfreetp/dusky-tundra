<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../stores/suitability'
import { getRamp, BAND_LABELS } from '../core/ramps'
import { depthScore, vegScore } from '../core/suitability'

const store = useStore()
const ramp = computed(() => getRamp(store.rampId))

const heightLayers = computed(() =>
  BAND_LABELS.map((label, i) => ({
    label,
    color: ramp.value.colors[i],
    height: Math.round(i * 10 * store.heightExaggeration),
  })),
)

const sel = computed(() => store.selectedPoint)
const selScores = computed(() =>
  sel.value
    ? { depth: depthScore(sel.value.depth), veg: vegScore(sel.value.veg) }
    : null,
)
</script>

<template>
  <div>
    <div class="section">
      <h3>点位图层</h3>
      <div class="switch-row">
        <span>三维点位图标</span>
        <input type="checkbox" class="toggle" v-model="store.layers.points3d" @change="store.saveLocal()" />
      </div>
      <div class="switch-row">
        <span>点位密度热力</span>
        <input type="checkbox" class="toggle" v-model="store.layers.density" @change="store.saveLocal()" />
      </div>
      <div class="row">
        <label>点位数量</label>
        <select
          class="select"
          :value="store.pointCount"
          @change="store.setPointCount(Number(($event.target as HTMLSelectElement).value))"
        >
          <option :value="5000">5,000</option>
          <option :value="10000">10,000</option>
          <option :value="20000">20,000</option>
          <option :value="30000">30,000</option>
        </select>
      </div>
      <p class="hint">点位按适宜度拒绝采样生成,密度热力以单点适宜度为权重,随因子权重联动重算。</p>
    </div>

    <div class="section">
      <h3>三维斜视</h3>
      <div class="switch-row">
        <span>3D 斜视模式</span>
        <input type="checkbox" class="toggle" v-model="store.mode3D" @change="store.saveLocal()" />
      </div>
      <div class="row" v-if="store.mode3D">
        <label>高度夸张</label>
        <input
          type="range"
          min="5"
          max="40"
          :value="Math.round(store.heightExaggeration * 10)"
          @input="store.heightExaggeration = Number(($event.target as HTMLInputElement).value) / 10; store.saveLocal()"
        />
        <span style="width: 34px; text-align: right">×{{ store.heightExaggeration.toFixed(1) }}</span>
      </div>
      <p class="hint" v-if="store.mode3D">
        点位按适宜度档位抬升,水下地形下凹,可观察点位与地形的相对高度。
      </p>
    </div>

    <div class="section" v-if="store.mode3D">
      <h3>高度分层(基准高度)</h3>
      <div v-for="l in heightLayers" :key="l.label" class="legend-band">
        <span class="swatch" :style="{ background: l.color }"></span>
        <span>{{ l.label }} · 抬升 {{ l.height }} m</span>
      </div>
    </div>

    <div class="section">
      <h3>选中点位</h3>
      <template v-if="sel">
        <div class="stat-grid">
          <div class="stat-card">
            <div class="k">物种 / 数量</div>
            <div class="v" style="font-size: 15px">{{ sel.species }} · {{ sel.flock }} 只</div>
          </div>
          <div class="stat-card">
            <div class="k">综合适宜度</div>
            <div class="v" :style="{ color: ramp.colors[Math.min(4, Math.floor(sel.suitability * 5))] }">
              {{ sel.suitability.toFixed(3) }}
            </div>
          </div>
          <div class="stat-card">
            <div class="k">水深 / 得分</div>
            <div class="v" style="font-size: 15px">{{ sel.depth.toFixed(2) }} m / {{ selScores!.depth.toFixed(2) }}</div>
          </div>
          <div class="stat-card">
            <div class="k">植被 / 得分</div>
            <div class="v" style="font-size: 15px">{{ (sel.veg * 100).toFixed(0) }}% / {{ selScores!.veg.toFixed(2) }}</div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn secondary" @click="store.selectedPoint = null">取消选中</button>
        </div>
      </template>
      <p class="hint" v-else>在地图上点击任意鸟群点位,查看该点的单点适宜度与因子得分。</p>
    </div>
  </div>
</template>
