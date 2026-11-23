import { setAirAbsorption, setDensity, setThreshold, store } from '../state/store';
import { ABSOLUTE_COLORS, DIFF_BANDS } from '../acoustics/colors';

const DENSITIES: Array<{ key: 'low' | 'medium' | 'high'; label: string }> = [
  { key: 'low', label: '低 (~1k)' },
  { key: 'medium', label: '中 (~3k)' },
  { key: 'high', label: '高 (~8k)' },
];

const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;

export default function GridPanel() {
  const thresholds = () => store.grid.thresholds;
  return (
    <div class="panel">
      <div class="panel-title">网格与色带</div>

      <div class="field-label">采样密度</div>
      <div class="segmented">
        {DENSITIES.map((d) => (
          <button
            class={`seg ${store.grid.density === d.key ? 'active' : ''}`}
            onClick={() => setDensity(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <label class="check">
        <input
          type="checkbox"
          checked={store.grid.airAbsorption}
          onChange={(e) => setAirAbsorption((e.target as HTMLInputElement).checked)}
        />
        空气吸收（简化 ISO 9613）
      </label>

      <div class="field-label">声压分级阈值 (dB)</div>
      <div class="thresholds">
        {thresholds().map((t, i) => (
          <label class="threshold-row">
            <span class="swatch" style={{ background: hex(ABSOLUTE_COLORS[i]) }} />
            <span class="threshold-text">{i === 0 ? `< ${t}` : `${thresholds()[i - 1]} ~ ${t}`}</span>
            <input
              class="num small"
              type="number"
              value={t}
              min={40}
              max={140}
              step={1}
              onInput={(e) => setThreshold(i, Number((e.target as HTMLInputElement).value))}
            />
          </label>
        ))}
        <label class="threshold-row">
          <span class="swatch" style={{ background: hex(ABSOLUTE_COLORS[5]) }} />
          <span class="threshold-text">≥ {thresholds()[4]}</span>
        </label>
      </div>

      <div class="field-label">差值色带（B − A, dB）</div>
      <div class="diff-legend">
        {DIFF_BANDS.map((b) => (
          <div class="threshold-row">
            <span class="swatch" style={{ background: hex(b.color) }} />
            <span class="threshold-text">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
