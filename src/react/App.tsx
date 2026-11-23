import { useRef } from 'react';
import { useSyncExternalStore } from 'react';
import type { Engine, EngineStats } from '../three/Engine';
import { Store, type StoreState } from '../state/store';
import { ViewerCanvas } from './ViewerCanvas';
import { ControlPanel } from './ControlPanel';
import { FloorTimeline } from './FloorTimeline';
import { ClipSlider } from './ClipSlider';
import { TensionLegend } from './TensionLegend';
import { StatsHud } from './StatsHud';
import { Toolbar } from './Toolbar';

const initialState: StoreState = {
  selectedFloorId: 'F1',
  floorIndex: 0,
  loadCoeff: 0.5,
  speed: 2.0,
  clipHeight: null,
  ropeOpacity: 0.55,
  lodLevel: 'mid',
  showSectionMarkers: true,
  showTensionColor: true,
  playing: false,
  ropeVisible: true,
  bvhVisible: false,
};

export function App() {
  const engineRef = useRef<Engine | null>(null);
  const storeRef = useRef<Store<StoreState> | null>(null);
  const statsRef = useRef<(s: EngineStats) => void>(() => {});

  if (!storeRef.current) storeRef.current = new Store(initialState);
  const store = storeRef.current;
  useSyncExternalStore(store.subscribe, store.getState);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="title">曳引绳姿态监测</h1>
        <Toolbar engineRef={engineRef} store={store} />
        <ControlPanel engineRef={engineRef} store={store} />
        <FloorTimeline engineRef={engineRef} store={store} floorCount={12} />
        <ClipSlider engineRef={engineRef} store={store} maxHeight={38.6} />
        <TensionLegend />
      </aside>
      <main className="viewport">
        <ViewerCanvas
          engineRef={engineRef}
          store={store}
          onEngine={(engine) => engine.onStats((s) => statsRef.current(s))}
        />
        <StatsHud statsRef={statsRef} />
        <div className="hint">左键旋转 · 右键平移 · 滚轮缩放</div>
      </main>
    </div>
  );
}
