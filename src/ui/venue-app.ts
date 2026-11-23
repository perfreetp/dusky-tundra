// 应用根组件:装配场景、面板与全部交互逻辑
import { sharedCss } from './styles';
import { VenueToolbar } from './venue-toolbar';
import { InfoPanel } from './info-panel';
import { ScorePanel, type ScoreSummary } from './score-panel';
import { VenueScene, type EyeOcclusionReport } from '../three/venue-scene';
import { loadVenueMesh } from '../three/mesh-loader';
import {
  applyEyeHeight,
  buildAllSpectatorProxies,
  buildSpectatorProxies,
  generateDemoVenue,
  SEATED_EYE_OFFSET,
  type VenueModel,
} from '../venue/demo-venue';
import { SeatScoreService, summarizeScores } from '../services/score-service';
import {
  buildSeatListFile,
  downloadSeatList,
  importSeatList,
} from '../services/seat-list';
import type { OccluderBox, ScoreRequest, SeatScore } from '../types';

export class VenueApp extends HTMLElement {
  private toolbar!: VenueToolbar;
  private infoPanel!: InfoPanel;
  private scorePanel!: ScorePanel;
  private viewport!: HTMLDivElement;
  private scene!: VenueScene;
  private venue!: VenueModel;
  private scoreService = new SeatScoreService();
  private scores = new Map<number, SeatScore>();
  private eyeHeight = SEATED_EYE_OFFSET;
  private spectatorProxyMap = new Map<number, OccluderBox[]>();

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [new CSSStyleSheet()];
    shadow.adoptedStyleSheets[0].replaceSync(sharedCss);
    shadow.innerHTML = `
      <div class="app">
        <venue-toolbar></venue-toolbar>
        <div class="middle">
          <info-panel></info-panel>
          <div class="viewport" id="viewport"></div>
          <score-panel></score-panel>
        </div>
        <div class="statusbar" id="statusbar">就绪</div>
      </div>
      <style>
        .app { display: flex; flex-direction: column; height: 100vh; }
        .middle { flex: 1; display: flex; min-height: 0; position: relative; }
        .viewport { flex: 1; position: relative; min-width: 0; }
        .viewport canvas { display: block; }
        .statusbar {
          padding: 6px 14px;
          font-size: 11.5px;
          color: var(--text-dim);
          background: var(--panel-bg);
          border-top: 1px solid var(--panel-border);
        }
      </style>
    `;

    this.toolbar = shadow.querySelector('venue-toolbar')!;
    this.infoPanel = shadow.querySelector('info-panel')!;
    this.scorePanel = shadow.querySelector('score-panel')!;
    this.viewport = shadow.getElementById('viewport') as HTMLDivElement;

    this.scene = new VenueScene(this.viewport, {
      onSeatClick: (id) => this.handleSeatClick(id),
      onSelectionChange: (ids) => this.handleSelectionChange(ids),
      onEyeViewOcclusion: (report) => this.handleEyeOcclusion(report),
    });

    this.bindToolbar();
    this.bootVenue();
  }

  private setStatus(text: string): void {
    const bar = this.shadowRoot!.getElementById('statusbar')!;
    bar.textContent = text;
  }

  private bootVenue(): void {
    this.venue = generateDemoVenue();
    this.spectatorProxyMap = buildAllSpectatorProxies(this.venue.seats);
    this.scene.loadVenue({
      seats: this.venue.seats,
      occluders: this.venue.occluders,
      targets: this.venue.targets,
      stageBox: this.venue.stageBox,
      field: this.venue.field,
    });
    this.toolbar.setVenueInfo(this.venue.name, this.venue.seats.length);
    this.toolbar.setEyeHeight(this.eyeHeight);
    this.infoPanel.renderSections(this.venue.sections, this.venue.seats.length);
    this.setStatus(
      `已生成 ${this.venue.seats.length} 个座席、${this.venue.occluders.length} 个结构遮挡物、${this.venue.targets.length} 个观测关键点`,
    );
  }

  private bindToolbar(): void {
    this.toolbar.addEventListener('eye-height-change', (e) => {
      this.eyeHeight = (e as CustomEvent<number>).detail;
      applyEyeHeight(this.venue.seats, this.eyeHeight);
      this.scene.setEyeHeight(this.eyeHeight);
    });

    this.toolbar.addEventListener('exit-eye-view', () => {
      this.scene.exitEyeView();
      this.toolbar.setEyeViewMode(false);
      this.infoPanel.renderSelection(this.venue.seats, this.scene.getSelectedIds(), this.scores);
      this.setStatus('已返回总览视角');
    });

    this.toolbar.addEventListener('load-mesh', async (e) => {
      const file = (e as CustomEvent<File>).detail;
      try {
        this.setStatus(`正在载入网格 ${file.name}…`);
        const mesh = await loadVenueMesh(file);
        this.scene.addExternalMesh(mesh);
        this.setStatus(
          `已载入网格 ${file.name}(${mesh.collidables.length} 个网格体),已加入观众视角射线遮挡`,
        );
      } catch (err) {
        this.setStatus(`网格载入失败:${(err as Error).message}`);
      }
    });

    this.toolbar.addEventListener('run-score', () => this.runBatchScore());
    this.toolbar.addEventListener('clear-score', () => {
      this.scores.clear();
      this.scene.clearScores();
      this.scorePanel.reset();
      this.setStatus('已清除评分着色');
    });

    this.toolbar.addEventListener('export-list', () => this.exportList());
    this.toolbar.addEventListener('import-list', (e) =>
      this.importList((e as CustomEvent<File>).detail),
    );
  }

  // ---------- 座席交互 ----------

  private handleSeatClick(id: number): void {
    const seat = this.venue.seats[id];
    const proxies =
      this.spectatorProxyMap.get(id) ??
      buildSpectatorProxies(seat, this.venue.seats, (sid) =>
        this.venue.sections.find((x) => x.id === sid),
      );
    this.scene.setSpectatorBoxes(proxies);
    this.scene.enterEyeView(id);
    this.toolbar.setEyeViewMode(true);
    this.setStatus(
      `进入座席 ${seat.sectionId} R${seat.row + 1}C${seat.col + 1} 观众视角,拖动环视,眼高 ${this.eyeHeight.toFixed(2)}m`,
    );
  }

  private handleSelectionChange(ids: number[]): void {
    this.toolbar.setSelectionCount(ids.length);
    if (!this.scene.inEyeView) {
      this.infoPanel.renderSelection(this.venue.seats, ids, this.scores);
    }
    this.setStatus(
      ids.length ? `已选中 ${ids.length} 个座席(邻座以黄色高亮显示相对位置)` : '未选择座席',
    );
  }

  private handleEyeOcclusion(report: EyeOcclusionReport): void {
    if (!this.scene.inEyeView) return;
    const id = this.scene.getActiveSeatId();
    if (id !== null) this.infoPanel.renderEyeView(this.venue.seats[id], report);
  }

  // ---------- 批量评分 ----------

  private runBatchScore(): void {
    const ids = this.scene.getSelectedIds();
    if (ids.length === 0) return;
    if (this.scoreService.running) return;

    const req: ScoreRequest = {
      seats: ids.map((id) => ({ id, eye: this.venue.seats[id].eye })),
      targets: this.venue.targets,
      occluders: this.venue.occluders,
      spectatorProxies: ids
        .map((id) => ({ seatId: id, boxes: this.spectatorProxyMap.get(id) ?? [] }))
        .filter((x) => x.boxes.length > 0),
      eyeHeight: this.eyeHeight,
      channelRadius: 0.08,
    };

    this.setStatus(`开始对 ${ids.length} 个座席进行 manifold 几何布尔评分…`);
    this.toolbar.setScoring(true, this.scores.size > 0);

    this.scoreService.run(req, {
      onProgress: (p) => this.scorePanel.renderProgress(p),
      onDone: (response) => {
        this.scores.clear();
        for (const r of response.results) this.scores.set(r.seatId, r);
        this.scene.applyScores(response.results);
        const summary = summarizeScores(response.results);
        const view: ScoreSummary = { ...summary, elapsedMs: response.elapsedMs };
        this.scorePanel.renderSummary(view);
        this.toolbar.setScoring(false, true);
        this.infoPanel.renderSelection(this.venue.seats, ids, this.scores);
        this.setStatus(
          `评分完成:${summary.count} 席,平均 ${summary.avg} 分,${summary.blockedSeats} 席视野欠佳,耗时 ${(response.elapsedMs / 1000).toFixed(1)}s`,
        );
      },
      onError: (err) => {
        this.scorePanel.renderError(err.message);
        this.toolbar.setScoring(false, this.scores.size > 0);
        this.setStatus(`评分失败:${err.message}`);
      },
    });
  }

  // ---------- 导入导出 ----------

  private exportList(): void {
    const ids = new Set(this.scene.getSelectedIds());
    if (ids.size === 0) return;
    const file = buildSeatListFile(
      this.venue.name,
      this.venue.seats,
      ids,
      this.eyeHeight,
      this.scores,
    );
    downloadSeatList(file);
    this.setStatus(`已导出 ${file.seats.length} 个座席的清单文件`);
  }

  private async importList(file: File): Promise<void> {
    try {
      const known = new Set(this.venue.seats.map((s) => s.id));
      const result = await importSeatList(file, known);
      this.scene.restoreSelection(result.selectedIds, result.scores);
      for (const { seatId, score } of result.scores) {
        this.scores.set(seatId, {
          seatId,
          score,
          perTarget: [],
          spectatorBlocked: 0,
        });
      }
      this.toolbar.setSelectionCount(result.selectedIds.length);
      this.infoPanel.renderSelection(
        this.venue.seats,
        result.selectedIds,
        this.scores,
      );
      const missingNote = result.missing.length
        ? `,${result.missing.length} 个座席在当前场馆不存在已跳过`
        : '';
      this.setStatus(
        `清单已还原:恢复 ${result.selectedIds.length} 个座席选区${
          result.scores.length ? `与 ${result.scores.length} 条评分` : ''
        }${missingNote}`,
      );
    } catch (err) {
      this.setStatus(`导入失败:${(err as Error).message}`);
    }
  }

  disconnectedCallback(): void {
    this.scoreService.cancel();
    this.scene.dispose();
  }
}

customElements.define('venue-app', VenueApp);
