import { createEffect, createMemo, onCleanup, onMount } from 'solid-js';
import { store } from '../state/store';
import { topContributions } from '../acoustics/engine';
import { diffBandLabel } from '../acoustics/colors';
import { SceneHost } from '../three/SceneHost';
import Tooltip from './Tooltip';

export default function Viewport() {
  let containerRef: HTMLDivElement | undefined;
  let host: SceneHost | undefined;

  onMount(() => {
    if (!containerRef) return;
    host = new SceneHost(containerRef);
    host.rebuildGrid(); // 生成初始网格 -> pointsVersion 变化触发首次计算

    const onImport = (e: Event) => {
      const file = (e as CustomEvent<File>).detail;
      host?.importGltf(file).catch((err) => console.error('GLTF 导入失败', err));
    };
    window.addEventListener('venue:import-gltf', onImport);

    onCleanup(() => {
      window.removeEventListener('venue:import-gltf', onImport);
      host?.dispose();
      host = undefined;
    });
  });

  // 音箱列表/选中/隔离状态 -> 场景对象
  createEffect(() => {
    const sig = JSON.stringify(
      store.speakers.map((s) => [s.id, s.x, s.y, s.z, s.yaw, s.tilt, s.halfAngle, s.spl, s.range, s.name]),
    );
    void sig;
    void store.selectedId;
    void store.displayMode;
    host?.syncSpeakers();
  });

  // 网格密度 -> 重建网格
  createEffect(() => {
    void store.grid.density;
    if (host && store.pointsVersion > 0) host.rebuildGrid();
  });

  // 音箱参数 / 采样点 / 空气吸收 -> 防抖重算
  createEffect(() => {
    void JSON.stringify(store.speakers);
    void store.pointsVersion;
    void store.grid.airAbsorption;
    host?.scheduleRecalc(180);
  });

  // 着色依赖：计算结果、显示/方案视图、选中、阈值、快照 -> 重绘色带（不重算声学）
  createEffect(() => {
    void store.result;
    void store.displayMode;
    void store.schemeView;
    void store.selectedId;
    void store.grid.thresholds;
    void store.snapshotA;
    void store.pointsVersion;
    host?.refreshColors();
  });

  const hoverData = createMemo(() => {
    const hover = store.hover;
    const result = store.result;
    if (!hover || !result || hover.index >= result.pointCount) return null;
    const i = hover.index;
    const view = store.schemeView;
    const snap = store.snapshotA;

    if ((store.displayMode === 'diff' || view === 'diff') && snap) {
      const delta = result.total[i] - snap.total[i];
      return {
        hover,
        lines: [
          `B 方案: ${result.total[i].toFixed(1)} dB`,
          `A 方案: ${snap.total[i].toFixed(1)} dB`,
          `差值: ${delta >= 0 ? '+' : ''}${delta.toFixed(1)} dB（${diffBandLabel(delta)}）`,
        ],
      };
    }

    const shownTotal = view === 'A' && snap ? snap.total[i] : result.total[i];
    const tops = topContributions(result, i, 3).map((t) => {
      const sp = store.speakers[t.speakerIndex];
      return {
        name: sp?.name ?? `#${t.speakerIndex}`,
        spl: t.spl,
        dominant: t.speakerIndex === result.dominant[i],
      };
    });
    return {
      hover,
      lines: [`总声压: ${shownTotal.toFixed(1)} dB`],
      tops,
    };
  });

  return (
    <div class="viewport" ref={containerRef}>
      {hoverData() && (
        <Tooltip
          x={hoverData()!.hover.clientX}
          y={hoverData()!.hover.clientY}
          lines={hoverData()!.lines}
          tops={hoverData()!.tops}
        />
      )}
    </div>
  );
}
