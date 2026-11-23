// 评分进度与结果面板
import { sharedCss } from './styles';
import type { ScoreProgress } from '../types';
import { scoreColor } from '../utils/math3d';

export interface ScoreSummary {
  count: number;
  avg: number;
  min: number;
  max: number;
  blockedSeats: number;
  elapsedMs: number;
}

export class ScorePanel extends HTMLElement {
  private root!: HTMLElement;

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [new CSSStyleSheet()];
    shadow.adoptedStyleSheets[0].replaceSync(sharedCss);
    shadow.innerHTML = `
      <div class="panel" hidden>
        <h3>批量视野评分</h3>
        <div id="root"></div>
      </div>
      <style>
        :host { display: block; margin: 10px 12px 0 0; width: 300px; }
        .stat {
          flex: 1;
          background: #1a2233;
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          padding: 8px 6px;
          text-align: center;
        }
        .stat b { display: block; font-size: 18px; color: var(--accent-2); }
        .stat span { font-size: 11px; color: var(--text-dim); }
      </style>
    `;
    this.root = shadow.getElementById('root')!;
    (shadow.querySelector('.panel') as HTMLElement).hidden = false;
    this.renderIdle();
  }

  private hex(n: number): string {
    return '#' + n.toString(16).padStart(6, '0');
  }

  renderIdle(): void {
    this.root.innerHTML = `<div class="hint">Shift+拖拽框选座席后,点击顶部「批量评分」。<br>
      每个座席对舞台/场地关键点生成视线通道,用 manifold 几何布尔运算判断通道是否被结构实体或前排观众截断。</div>
      <div style="margin-top:8px">
        <span class="legend-dot" style="background:${this.hex(scoreColor(100))}"></span>视野好
        <span class="legend-dot" style="background:${this.hex(scoreColor(50))};margin-left:10px"></span>部分遮挡
        <span class="legend-dot" style="background:${this.hex(scoreColor(0))};margin-left:10px"></span>严重遮挡
      </div>`;
  }

  renderProgress(p: ScoreProgress): void {
    const pct = Math.round((p.done / p.total) * 100);
    this.root.innerHTML = `
      <label class="field">正在评分… <b>${p.done}/${p.total}</b> (${pct}%)</label>
      <progress value="${p.done}" max="${p.total}"></progress>
      <div class="hint" style="margin-top:6px">manifold 布尔运算在 Web Worker 中执行,界面保持可交互</div>`;
  }

  renderSummary(s: ScoreSummary): void {
    const dist = this.distributionPlaceholder();
    this.root.innerHTML = `
      <div class="row" style="align-items:stretch">
        <div class="stat"><b>${s.count}</b><span>参评座席</span></div>
        <div class="stat"><b>${s.avg}</b><span>平均分</span></div>
        <div class="stat"><b style="color:var(--warn)">${s.blockedSeats}</b><span>欠佳(&lt;60)</span></div>
      </div>
      <div class="hint" style="margin-top:8px">
        最低 <b>${s.min}</b> / 最高 <b>${s.max}</b> · 耗时 ${(s.elapsedMs / 1000).toFixed(1)} 秒
      </div>
      ${dist}
      <div class="hint" style="margin-top:8px">座席已按分数重新着色;再次框选评分会覆盖旧结果。</div>`;
  }

  private distributionPlaceholder(): string {
    return `<div class="hint" style="margin-top:8px">
      评分规则:每个关键点通视得 1 票,被前排观众遮挡得 0.5 票,被栏杆/结构柱截断得 0 票,归一到 0–100。
    </div>`;
  }

  renderError(message: string): void {
    this.root.innerHTML = `<span class="tag bad">评分失败</span><div class="hint" style="margin-top:6px">${message}</div>`;
  }

  reset(): void {
    this.renderIdle();
  }
}

customElements.define('score-panel', ScorePanel);
