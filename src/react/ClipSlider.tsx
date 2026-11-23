import type { MutableRefObject } from 'react';
import type { Engine } from '../three/Engine';
import type { Store, StoreState } from '../state/store';

interface Props {
  engineRef: MutableRefObject<Engine | null>;
  store: Store<StoreState>;
  maxHeight: number;
}

export function ClipSlider({ engineRef, store, maxHeight }: Props) {
  const state = store.getState();
  const enabled = state.clipHeight !== null;

  const setClip = (h: number | null) => {
    store.setState({ clipHeight: h });
    engineRef.current?.setClipHeight(h);
  };

  return (
    <section className="panel">
      <h2>剖切平面</h2>
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setClip(e.target.checked ? maxHeight / 2 : null)}
        />
        <span>启用高度剖切</span>
      </label>
      {enabled && (
        <label className="field">
          <span>剖切高度 {state.clipHeight!.toFixed(2)} m</span>
          <input
            type="range"
            min={0}
            max={maxHeight}
            step={0.1}
            value={state.clipHeight!}
            onChange={(e) => setClip(Number(e.target.value))}
          />
        </label>
      )}
    </section>
  );
}
