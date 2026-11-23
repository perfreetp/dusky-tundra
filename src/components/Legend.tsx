import { store } from '../state/store';
import { ABSOLUTE_COLORS, DIFF_BANDS } from '../acoustics/colors';

const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;

export default function Legend() {
  const isDiff = () => store.displayMode === 'diff' || store.schemeView === 'diff';
  return (
    <div class="legend">
      {isDiff() ? (
        <>
          <div class="legend-title">差值 B − A (dB)</div>
          {DIFF_BANDS.map((b) => (
            <div class="legend-row">
              <span class="swatch" style={{ background: hex(b.color) }} />
              <span>{b.label}</span>
            </div>
          ))}
        </>
      ) : (
        <>
          <div class="legend-title">{store.displayMode === 'isolate' ? '单箱声压 (dB)' : '总声压 (dB)'}</div>
          {store.grid.thresholds.map((t, i) => (
            <div class="legend-row">
              <span class="swatch" style={{ background: hex(ABSOLUTE_COLORS[i]) }} />
              <span>{i === 0 ? `< ${t}` : `${store.grid.thresholds[i - 1]} ~ ${t}`}</span>
            </div>
          ))}
          <div class="legend-row">
            <span class="swatch" style={{ background: hex(ABSOLUTE_COLORS[5]) }} />
            <span>≥ {store.grid.thresholds[4]}</span>
          </div>
        </>
      )}
    </div>
  );
}
