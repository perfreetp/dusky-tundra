import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { Engine } from '../three/Engine';
import type { Store, StoreState } from '../state/store';

interface Props {
  engineRef: MutableRefObject<Engine | null>;
  store: Store<StoreState>;
  floorCount: number;
}

export function FloorTimeline({ engineRef, store, floorCount }: Props) {
  const state = store.getState();
  const playTimer = useRef<number | null>(null);
  const dirRef = useRef<1 | -1>(1);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(floorCount - 1, index));
    const floorId = `F${clamped + 1}`;
    store.setState({ floorIndex: clamped, selectedFloorId: floorId });
    engineRef.current?.setFloor(clamped);
  };

  const togglePlay = () => {
    const playing = !state.playing;
    store.setState({ playing });
    if (playing) {
      playTimer.current = window.setInterval(() => {
        const cur = store.getState().floorIndex;
        let next = cur + dirRef.current;
        if (next >= floorCount - 1) {
          next = floorCount - 1;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        goTo(next);
      }, 600);
    } else if (playTimer.current) {
      clearInterval(playTimer.current);
      playTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (playTimer.current) clearInterval(playTimer.current);
    };
  }, []);

  return (
    <section className="panel">
      <h2>楼层档位</h2>
      <div className="floor-row">
        <button className="btn" onClick={togglePlay}>
          {state.playing ? '⏸ 暂停' : '▶ 自动播放'}
        </button>
        <span className="floor-label">
          {state.selectedFloorId}（{state.floorIndex + 1}/{floorCount}）
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={floorCount - 1}
        step={1}
        value={state.floorIndex}
        onChange={(e) => goTo(Number(e.target.value))}
      />
      <div className="floor-ticks">
        {Array.from({ length: floorCount }, (_, i) => (
          <button
            key={i}
            className={`tick ${i === state.floorIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
