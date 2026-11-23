<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../store';

const store = useStore();
const s = store.state;

const total = store.totalGdd;
const dailyGain = computed(() => Math.max(0, s.gdd.dailyAvgTemp - s.gdd.baseTemp));
const windowInfo = store.harvestWindowGdd;

const currentOpenness = computed(() =>
  store.activeCurve.value.evaluate(s.timelineGdd)
);

function fmtDay(d: number | null): string {
  return d === null ? '超出曲线范围' : `第 ${d.toFixed(1)} 天`;
}

function fmtDate(day: number | null): string {
  if (day === null) return '—';
  const d = new Date();
  d.setDate(d.getDate() + Math.round(day));
  return d.toLocaleDateString('zh-CN');
}
</script>

<template>
  <div>
    <div class="section">
      <h3>积温模型（GDD）</h3>
      <div class="field">
        <label>日平均温</label>
        <input type="range" min="5" max="35" step="0.5" :value="s.gdd.dailyAvgTemp"
          @input="store.updateGdd({ dailyAvgTemp: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ s.gdd.dailyAvgTemp.toFixed(1) }}℃</output>
      </div>
      <div class="field">
        <label>生物学零度</label>
        <input type="range" min="0" max="15" step="0.5" :value="s.gdd.baseTemp"
          @input="store.updateGdd({ baseTemp: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ s.gdd.baseTemp.toFixed(1) }}℃</output>
      </div>
      <div class="field">
        <label>累积天数</label>
        <input type="range" min="1" max="90" step="1" :value="s.gdd.days"
          @input="store.updateGdd({ days: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ s.gdd.days }} d</output>
      </div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="num">{{ dailyGain.toFixed(1) }}</div>
          <div class="lbl">日积温（℃·d/天）</div>
        </div>
        <div class="stat-card">
          <div class="num">{{ total.toFixed(0) }}</div>
          <div class="lbl">累计积温（℃·d）</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>当前生长状态</h3>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="num">{{ s.timelineGdd.toFixed(0) }}</div>
          <div class="lbl">当前积温 GDD</div>
        </div>
        <div class="stat-card">
          <div class="num">{{ (currentOpenness * 100).toFixed(0) }}%</div>
          <div class="lbl">开放度（曲线求值）</div>
        </div>
      </div>
      <p class="note">展开角由开放度在 15°（花苞）→ 120°（盛开）间驱动，花径同步放大，花青素由深红插值到浅粉，萼片随之外翻。</p>
    </div>

    <div class="section">
      <h3>采收窗口推算</h3>
      <div class="field">
        <label>开放度下限</label>
        <input type="range" min="0.05" max="0.95" step="0.01" :value="s.harvest.openMin"
          @input="store.updateHarvest({ openMin: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ (s.harvest.openMin * 100).toFixed(0) }}%</output>
      </div>
      <div class="field">
        <label>开放度上限</label>
        <input type="range" min="0.05" max="1" step="0.01" :value="s.harvest.openMax"
          @input="store.updateHarvest({ openMax: Number(($event.target as HTMLInputElement).value) })" />
        <output>{{ (s.harvest.openMax * 100).toFixed(0) }}%</output>
      </div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="num">{{ fmtDay(windowInfo.dayMin) }}</div>
          <div class="lbl">起采（约 {{ fmtDate(windowInfo.dayMin) }}）· {{ windowInfo.gddMin?.toFixed(0) ?? '—' }} GDD</div>
        </div>
        <div class="stat-card">
          <div class="num">{{ fmtDay(windowInfo.dayMax) }}</div>
          <div class="lbl">止采（约 {{ fmtDate(windowInfo.dayMax) }}）· {{ windowInfo.gddMax?.toFixed(0) ?? '—' }} GDD</div>
        </div>
      </div>
      <p class="note">窗口由生长曲线反查积温得到，再按日积温换算为发育天数；琥珀色带同步绘制在时间轴与曲线图上。</p>
    </div>
  </div>
</template>
