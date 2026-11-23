import { useEffect, useRef, useState } from 'react';
import { createScene, type SceneHandle } from '../render/sceneManager';
import { useAppStore } from '../state/store';
import type { LoadedSurface, LoadedVolume } from '../data/loader';

interface Props {
  surface: LoadedSurface | null;
  volume: LoadedVolume | null;
}

export function ViewCanvas({ surface, volume }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [backend, setBackend] = useState<'webgpu' | 'webgl' | 'init'>('init');
  const [fps, setFps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let statsTimer: ReturnType<typeof setInterval> | null = null;
    createScene(canvasRef.current!, { surface, volume })
      .then((handle) => {
        if (disposed) {
          handle.dispose();
          return;
        }
        handleRef.current = handle;
        setBackend(handle.backend);
        statsTimer = setInterval(() => {
          setFps(handle.getStats().fps);
        }, 1000);
      })
      .catch((e) => {
        console.error(e);
        setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      disposed = true;
      if (statsTimer) clearInterval(statsTimer);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
    // 数据集在应用生命周期内通过 key 重挂载替换，这里只初始化一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const particles = useAppStore((s) => s.particles.count);
  const voxels = volume?.grid.size.reduce((a, b) => a * b, 1) ?? 0;

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} className="view-canvas" />
      <div className="hud">
        <span className={`badge badge-${backend}`}>
          {backend === 'webgpu' ? 'WebGPU' : backend === 'webgl' ? 'WebGL 回退' : '初始化中…'}
        </span>
        <span className="badge">{fps} FPS</span>
        <span className="badge">{particles.toLocaleString()} 粒子</span>
        <span className="badge">{voxels.toLocaleString()} 体素</span>
      </div>
      {error && (
        <div className="canvas-error">
          渲染初始化失败：{error}
          <br />
          请使用支持 WebGPU 的 Chrome/Edge 113+ 或检查显卡驱动。
        </div>
      )}
    </div>
  );
}
