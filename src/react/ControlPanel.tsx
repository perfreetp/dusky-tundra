import type { MutableRefObject } from 'react';
import type { Engine } from '../three/Engine';
import type { Store, StoreState } from '../state/store';

interface Props {
  engineRef: MutableRefObject<Engine | null>;
  store: Store<StoreState>;
}

export function ControlPanel({ engineRef, store }: Props) {
  const state = store.getState();

  const update = (patch: Partial<StoreState>) => {
    store.setState(patch);
    const engine = engineRef.current;
    if (!engine) return;
    if (patch.loadCoeff !== undefined) engine.setLoad(patch.loadCoeff);
    if (patch.lodLevel !== undefined) engine.setLod(patch.lodLevel);
    if (patch.ropeOpacity !== undefined) engine.setOpacity(patch.ropeOpacity);
    if (patch.ropeVisible !== undefined) engine.setRopeVisible(patch.ropeVisible);
  };

  return (
    <section className="panel">
      <h2>运行参数</h2>
      <label className="field">
        <span>负载系数 {state.loadCoeff.toFixed(2)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={state.loadCoeff}
          onChange={(e) => update({ loadCoeff: Number(e.target.value) })}
        />
      </label>
      <label className="field">
        <span>绳体不透明度 {state.ropeOpacity.toFixed(2)}</span>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={state.ropeOpacity}
          onChange={(e) => update({ ropeOpacity: Number(e.target.value) })}
        />
      </label>
      <label className="field">
        <span>细节层级 LOD</span>
        <select
          value={state.lodLevel}
          onChange={(e) => update({ lodLevel: e.target.value as StoreState['lodLevel'] })}
        >
          <option value="high">高（128 节点）</option>
          <option value="mid">中（64 节点）</option>
          <option value="low">低（32 节点）</option>
        </select>
      </label>
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={state.ropeVisible}
          onChange={(e) => update({ ropeVisible: e.target.checked })}
        />
        <span>显示绳体</span>
      </label>
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={state.showSectionMarkers}
          onChange={(e) => update({ showSectionMarkers: e.target.checked })}
        />
        <span>剖切截面标记</span>
      </label>
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={state.showTensionColor}
          onChange={(e) => update({ showTensionColor: e.target.checked })}
        />
        <span>张力着色</span>
      </label>
    </section>
  );
}
