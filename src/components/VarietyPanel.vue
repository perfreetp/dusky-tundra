<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../store';
import CurveEditor from './CurveEditor.vue';
import type { Vec3 } from '../types';

const store = useStore();
const s = store.state;
const variety = computed(() => store.activeVariety.value);
const petal = computed(() => variety.value.petal);

const bendLabels = ['基部弯曲', '下段弯曲', '上段弯曲', '顶端弯曲'];
const curlLabels = ['基部卷边', '下段卷边', '上段卷边', '顶端卷边'];

function toHex(c: Vec3): string {
  const h = (v: number): string =>
    Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
  return `#${h(c.x)}${h(c.y)}${h(c.z)}`;
}

function fromHex(hex: string): Vec3 {
  return {
    x: parseInt(hex.slice(1, 3), 16) / 255,
    y: parseInt(hex.slice(3, 5), 16) / 255,
    z: parseInt(hex.slice(5, 7), 16) / 255
  };
}

function setColor(which: 'deep' | 'pale', hex: string): void {
  store.updateColor(which, fromHex(hex));
}
</script>

<template>
  <div>
    <div class="section">
      <h3>花型品种</h3>
      <div class="field" style="grid-template-columns: 92px 1fr">
        <label>选择品种</label>
        <select :value="s.activeVarietyId" @change="store.setActiveVariety(($event.target as HTMLSelectElement).value)">
          <option v-for="v in s.varieties" :key="v.id" :value="v.id">{{ v.name }}</option>
        </select>
      </div>
      <div class="field" style="grid-template-columns: 92px 1fr">
        <label>品种名称</label>
        <input type="text" :value="variety.name"
          @input="store.updateActiveVariety({ name: ($event.target as HTMLInputElement).value })" />
      </div>
      <div class="btn-row">
        <button class="btn" @click="store.addVariety()">复制为新品种</button>
        <button class="btn danger" @click="store.removeVariety(variety.id)">删除当前品种</button>
      </div>
    </div>

    <div class="section">
      <h3>花瓣参数化曲面</h3>
      <div class="field">
        <label>层数 (5~9)</label>
        <input type="range" min="5" max="9" step="1" :value="petal.layers"
          @input="store.updatePetal({ layers: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ petal.layers }}</output>
      </div>
      <div class="field">
        <label>每层瓣数</label>
        <input type="range" min="5" max="14" step="1" :value="petal.petalsPerLayer"
          @input="store.updatePetal({ petalsPerLayer: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ petal.petalsPerLayer }}</output>
      </div>
      <div class="field">
        <label>花瓣长度</label>
        <input type="range" min="0.3" max="0.9" step="0.01" :value="petal.length"
          @input="store.updatePetal({ length: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ petal.length.toFixed(2) }}</output>
      </div>
      <div class="field">
        <label>花瓣宽度</label>
        <input type="range" min="0.2" max="0.7" step="0.01" :value="petal.width"
          @input="store.updatePetal({ width: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ petal.width.toFixed(2) }}</output>
      </div>
      <div class="field">
        <label>宽度细分</label>
        <input type="range" min="4" max="16" step="1" :value="petal.segU"
          @input="store.updatePetal({ segU: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ petal.segU }}</output>
      </div>
      <div class="field">
        <label>长度细分</label>
        <input type="range" min="6" max="22" step="1" :value="petal.segV"
          @input="store.updatePetal({ segV: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ petal.segV }}</output>
      </div>
    </div>

    <div class="section">
      <h3>弯曲控制点</h3>
      <div class="field" v-for="(b, i) in petal.bend" :key="`bend${i}`">
        <label>{{ bendLabels[i] }}</label>
        <input type="range" min="-0.5" max="0.5" step="0.01" :value="b"
          @input="store.updatePetalControl('bend', i, Number(($event.target as HTMLInputElement).value))" />
        <output>{{ b.toFixed(2) }}</output>
      </div>
      <h3 style="margin-top:14px">卷边控制点</h3>
      <div class="field" v-for="(c, i) in petal.curl" :key="`curl${i}`">
        <label>{{ curlLabels[i] }}</label>
        <input type="range" min="0" max="0.5" step="0.01" :value="c"
          @input="store.updatePetalControl('curl', i, Number(($event.target as HTMLInputElement).value))" />
        <output>{{ c.toFixed(2) }}</output>
      </div>
      <p class="note">控制点为花瓣纵向 v∈[0,1] 上的 Catmull-Rom 样条；弯曲负值向内抱合，卷边正值使边缘外翻。</p>
    </div>

    <div class="section">
      <h3>花青素着色（按开放度插值）</h3>
      <div class="color-fields">
        <div>
          <label>花苞色（深红）</label>
          <input type="color" :value="toHex(variety.color.deep)"
            @input="setColor('deep', ($event.target as HTMLInputElement).value)" />
        </div>
        <div>
          <label>盛开色（浅粉）</label>
          <input type="color" :value="toHex(variety.color.pale)"
            @input="setColor('pale', ($event.target as HTMLInputElement).value)" />
        </div>
      </div>
    </div>

    <div class="section">
      <h3>生长曲线控制点</h3>
      <CurveEditor />
    </div>
  </div>
</template>
