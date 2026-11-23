import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { EngineStats } from '../three/Engine';

interface Props {
  statsRef: MutableRefObject<(s: EngineStats) => void>;
}

/**
 * 10Hz 性能 HUD。Engine 通过 statsRef 回调推送快照，
 * 这里仅维护本地 React state，避免每帧重渲染。
 */
export function StatsHud({ statsRef }: Props) {
  const [stats, setStats] = useState<EngineStats | null>(null);

  useEffect(() => {
    statsRef.current = (s: EngineStats) => setStats(s);
    return () => {
      statsRef.current = () => {};
    };
  }, [statsRef]);

  if (!stats) {
    return (
      <div className="stats-hud">
        <div>等待引擎启动…</div>
      </div>
    );
  }

  const overBudget = (stats.solveP95 ?? 0) > 14;
  return (
    <div className="stats-hud">
      <div className="stat-row">
        <span>FPS</span>
        <strong>{stats.fps}</strong>
      </div>
      <div className="stat-row">
        <span>绳数</span>
        <strong>{stats.ropeCount}</strong>
      </div>
      <div className="stat-row">
        <span>重算耗时</span>
        <strong>{stats.rebuildMs.toFixed(2)} ms</strong>
      </div>
      <div className="stat-row">
        <span>逐帧几何</span>
        <strong>{stats.uploadMs.toFixed(2)} ms</strong>
      </div>
      <div className="stat-row">
        <span>solve p95</span>
        <strong className={overBudget ? 'warn' : 'ok'}>
          {stats.solveP95 !== null ? `${stats.solveP95.toFixed(2)} ms` : '—'}
        </strong>
      </div>
      <div className="stat-row">
        <span>缓存 命中/未命中</span>
        <strong>
          {stats.cacheHits}/{stats.cacheMisses}
        </strong>
      </div>
      <div className="stat-row">
        <span>BVH 查询</span>
        <strong>{stats.bvhQueries}</strong>
      </div>
      <div className="stat-row">
        <span>LOD</span>
        <strong>{stats.lod}</strong>
      </div>
    </div>
  );
}
