<script setup lang="ts">
import { useStore } from '../stores/suitability'
import { fitToWetland } from '../map/mapService'

const store = useStore()
</script>

<template>
  <div>
    <div class="section">
      <h3>底图与湿地图层</h3>
      <div class="switch-row">
        <span>基础底图(OSM)</span>
        <input type="checkbox" class="toggle" v-model="store.layers.base" @change="store.saveLocal()" />
      </div>
      <div class="switch-row">
        <span>湿地水域图层</span>
        <input type="checkbox" class="toggle" v-model="store.layers.water" @change="store.saveLocal()" />
      </div>
      <div class="row" v-if="store.layers.water">
        <label>水域不透明度</label>
        <input
          type="range"
          min="10"
          max="100"
          :value="Math.round(store.waterOpacity * 100)"
          @input="store.waterOpacity = Number(($event.target as HTMLInputElement).value) / 100; store.saveLocal()"
        />
      </div>
      <div class="switch-row">
        <span>湿地植被图层</span>
        <input type="checkbox" class="toggle" v-model="store.layers.vegetation" @change="store.saveLocal()" />
      </div>
      <div class="row" v-if="store.layers.vegetation">
        <label>植被不透明度</label>
        <input
          type="range"
          min="10"
          max="100"
          :value="Math.round(store.vegetationOpacity * 100)"
          @input="store.vegetationOpacity = Number(($event.target as HTMLInputElement).value) / 100; store.saveLocal()"
        />
      </div>
    </div>

    <div class="section">
      <h3>视图</h3>
      <div class="btn-row">
        <button class="btn secondary" @click="fitToWetland">缩放至湿地范围</button>
      </div>
    </div>

    <div class="section">
      <h3>图层说明</h3>
      <p class="hint">
        水域图层由水深栅格渲染(蓝色越深水越深,0~1.6m);植被图层由覆盖度栅格渲染(绿色越浓覆盖越高,0~100%)。
        两个因子栅格是后续适宜度计算的数据基础。当前为合成演示数据,替换
        <code>src/core/data.ts</code> 中的栅格生成逻辑即可接入真实数据。
      </p>
    </div>
  </div>
</template>
