import { useAppStore, MAX_PARTICLES } from '../state/store';

function Slider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const { label, value, min, max, step, unit, onChange, format } = props;
  return (
    <label className="slider-row">
      <span className="slider-label">
        {label}
        <em>{format ? format(value) : value.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0)}{unit ?? ''}</em>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

export function PressurePanel({ cpMin, cpMax }: { cpMin: number; cpMax: number }) {
  const pressure = useAppStore((s) => s.pressure);
  const set = useAppStore((s) => s.setPressureThreshold);
  return (
    <section className="panel">
      <h3>压力色带阈值</h3>
      <Slider
        label="低压阈值 Cp"
        value={pressure.low}
        min={cpMin}
        max={cpMax}
        step={0.01}
        onChange={(v) => set({ low: Math.min(v, pressure.high - 0.01) })}
      />
      <Slider
        label="高压阈值 Cp"
        value={pressure.high}
        min={cpMin}
        max={cpMax}
        step={0.01}
        onChange={(v) => set({ high: Math.max(v, pressure.low + 0.01) })}
      />
      <div className="seg">
        <button
          className={pressure.bandMode === 'hide' ? 'active' : ''}
          onClick={() => set({ bandMode: 'hide' })}
        >
          区间外隐藏
        </button>
        <button
          className={pressure.bandMode === 'clamp' ? 'active' : ''}
          onClick={() => set({ bandMode: 'clamp' })}
        >
          钳制到边界
        </button>
      </div>
      <Slider
        label="表面不透明度"
        value={pressure.opacity}
        min={0.15}
        max={1}
        step={0.01}
        onChange={(v) => set({ opacity: v })}
      />
      <div className="cp-range">
        数据范围 Cp [{cpMin.toFixed(2)}, {cpMax.toFixed(2)}]
      </div>
    </section>
  );
}

export function ClipPanel() {
  const clip = useAppStore((s) => s.clipPlanes);
  const set = useAppStore((s) => s.setClipPlane);
  const axes = [
    { id: 'yz' as const, name: 'YZ 面（法向 X）' },
    { id: 'zx' as const, name: 'ZX 面（法向 Y · 水平）' },
    { id: 'xy' as const, name: 'XY 面（法向 Z）' },
  ];
  return (
    <section className="panel">
      <h3>正交剖切面 · 速度云图</h3>
      {axes.map((a) => (
        <div key={a.id} className="clip-block">
          <label className="check-row">
            <input
              type="checkbox"
              checked={clip[a.id].enabled}
              onChange={(e) => set(a.id, { enabled: e.target.checked })}
            />
            {a.name}
          </label>
          {clip[a.id].enabled && (
            <Slider
              label="平面位置"
              value={clip[a.id].position}
              min={0}
              max={1}
              step={0.002}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => set(a.id, { position: v })}
            />
          )}
        </div>
      ))}
    </section>
  );
}

export function ParticlePanel() {
  const p = useAppStore((s) => s.particles);
  const set = useAppStore((s) => s.setParticles);
  const toggleRegion = (r: 'rearWing' | 'diffuser') => {
    const has = p.seedRegions.includes(r);
    const next = has ? p.seedRegions.filter((x) => x !== r) : [...p.seedRegions, r];
    set({ seedRegions: next.length ? next : ['rearWing'] });
  };
  return (
    <section className="panel">
      <h3>流线粒子</h3>
      <label className="check-row">
        <input type="checkbox" checked={p.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
        启用粒子（上限 {MAX_PARTICLES.toLocaleString()}）
      </label>
      <Slider
        label="粒子数量"
        value={p.count}
        min={0}
        max={MAX_PARTICLES}
        step={100}
        onChange={(v) => set({ count: v })}
      />
      <Slider
        label="推进步长系数"
        value={p.stepSize}
        min={0.05}
        max={2}
        step={0.01}
        onChange={(v) => set({ stepSize: v })}
      />
      <Slider
        label="拖尾长度（段）"
        value={p.trailLength}
        min={2}
        max={32}
        step={1}
        onChange={(v) => set({ trailLength: v })}
      />
      <div className="check-row">撒播区域：</div>
      <div className="seg">
        <button className={p.seedRegions.includes('rearWing') ? 'active' : ''} onClick={() => toggleRegion('rearWing')}>
          尾翼
        </button>
        <button className={p.seedRegions.includes('diffuser') ? 'active' : ''} onClick={() => toggleRegion('diffuser')}>
          扩散器
        </button>
      </div>
    </section>
  );
}

export function VolumePanel() {
  const v = useAppStore((s) => s.volume);
  const set = useAppStore((s) => s.setVolume);
  return (
    <section className="panel">
      <h3>体纹理 · 光线步进</h3>
      <label className="check-row">
        <input type="checkbox" checked={v.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
        半透明流场体渲染
      </label>
      <Slider label="最大步进数" value={v.maxSteps} min={16} max={160} step={4} onChange={(x) => set({ maxSteps: x })} />
      <Slider label="密度系数" value={v.density} min={0.1} max={3} step={0.05} onChange={(x) => set({ density: x })} />
      <Slider label="不透明度上限" value={v.alphaScale} min={0.05} max={1} step={0.01} onChange={(x) => set({ alphaScale: x })} />
    </section>
  );
}
