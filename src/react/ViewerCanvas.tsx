import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Engine } from '../three/Engine';
import type { Store, StoreState } from '../state/store';
import {
  createDefaultSceneConfig,
  createDefaultRopes,
  createDefaultFloors,
  GOVERNOR_LOOP_LENGTH,
} from '../config/defaultSceneConfig';

interface Props {
  engineRef: MutableRefObject<Engine | null>;
  store: Store<StoreState>;
  onEngine: (engine: Engine) => void;
}

/**
 * 唯一挂载 Engine 的组件。
 * useEffect 在 StrictMode 下会 mount→cleanup→mount，
 * 通过 dispose 保证幂等，React 不持有 three 对象。
 */
export function ViewerCanvas({ engineRef, store, onEngine }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sceneConfig = createDefaultSceneConfig();
    const ropes = createDefaultRopes(sceneConfig);
    const floors = createDefaultFloors(sceneConfig);
    const engine = new Engine(
      container,
      sceneConfig,
      ropes,
      floors,
      { 'governor-loop': GOVERNOR_LOOP_LENGTH },
      store.getState(),
    );
    engineRef.current = engine;
    engine.start();
    engine.installDebugHook();
    onEngine(engine);

    return () => {
      engine.dispose();
      if (engineRef.current === engine) engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="canvas-container" />;
}
