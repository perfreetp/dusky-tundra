// 左侧信息面板:选中座席、分区图例、操作提示;观众视角下显示实时遮挡报告
import { sharedCss } from './styles';
import type { EyeOcclusionReport } from '../three/venue-scene';
import type { Seat, SeatSectionConfig, SeatScore } from '../types';

export class InfoPanel extends HTMLElement {
  private content!: HTMLElement;

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [new CSSStyleSheet()];
    shadow.adoptedStyleSheets[0].replaceSync(sharedCss);
    shadow.innerHTML = `
      <div class="panel">
        <h3>座席与视野信息</h3>
        <div id="content"></div>
      </div>
      <style>
        :host { display: block; margin: 10px 0 0 12px; width: 300px; }
        .panel { max-height: calc(100vh - 140px); overflow-y: auto; }
      </style>
    `;
    this.content = shadow.getElementById('content')!;
    this.renderOverviewHint();
  }

  private hex(n: number): string {
    return '#' + n.toString(16).padStart(6, '0');
  }

  renderOverviewHint(): void {
    this.content.innerHTML = `
      <div class="hint">
        <p>🖱️ <b>左键拖拽</b>旋转场馆,滚轮缩放</p>
        <p>👆 <b>单击座席</b>进入该座观众视角环视</p>
        <p>🔲 按住 <b>Shift + 拖拽</b>(或右键拖拽)框选座席</p>
        <p>🧩 框选后可批量视野评分,按分数红→绿重着色</p>
        <p>💾 勾选座席可导出 JSON 清单,再导入还原选区</p>
      </div>
    `;
  }

  renderSections(sections: SeatSectionConfig[], seatCount: number): void {
    const legend = sections
      .map(
        (s) =>
          `<div style="margin:4px 0"><span class="legend-dot" style="background:${this.hex(
            s.color,
          )}"></span>${s.name}</div>`,
      )
      .join('');
    const current = this.content.innerHTML;
    this.content.innerHTML = `
      ${current}
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--panel-border)">
        <div class="hint">分区着色(${seatCount.toLocaleString()} 席)</div>
        ${legend}
      </div>`;
  }

  renderSelection(seats: Seat[], selectedIds: number[], scores: Map<number, SeatScore>): void {
    if (selectedIds.length === 0) {
      this.renderOverviewHint();
      return;
    }
    const rows = selectedIds
      .slice(0, 60)
      .map((id) => {
        const s = seats[id];
        const score = scores.get(id)?.score;
        return `<tr>
          <td>${s.sectionId}</td>
          <td>R${s.row + 1}C${s.col + 1}</td>
          <td>${score !== undefined ? score + ' 分' : '—'}</td>
        </tr>`;
      })
      .join('');
    this.content.innerHTML = `
      <div class="hint">已选 <b style="color:var(--accent-2)">${selectedIds.length}</b> 个座席
      ${selectedIds.length > 60 ? '<br>(列表仅显示前 60 项)' : ''}</div>
      <div class="scroll" style="margin-top:8px">
        <table>
          <thead><tr><th>分区</th><th>排/列</th><th>评分</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="hint" style="margin-top:8px">
        Ctrl/Cmd + 框选可叠加选区;单击单个座席进入观众视角
      </div>`;
  }

  renderEyeView(seat: Seat, report: EyeOcclusionReport): void {
    const rows = report.targets
      .map((t) => {
        const status = t.blocked
          ? `<span class="tag bad">被挡</span>`
          : `<span class="tag ok">可见</span>`;
        const view = t.inView
          ? '<span class="tag ok">视野内</span>'
          : '<span class="tag warn">视野外</span>';
        return `<tr style="${t.inView ? '' : 'opacity:0.55'}">
          <td>${t.label}<br><span class="hint">偏角 ${t.angleFromCenter.toFixed(0)}°</span></td>
          <td>${view}<br>${status}</td>
          <td class="hint">${t.blocked ? t.blockerLabel ?? '遮挡物' : '—'}</td>
        </tr>`;
      })
      .join('');
    const blockedCount = report.targets.filter((t) => t.blocked).length;
    const inViewCount = report.targets.filter((t) => t.inView).length;
    const blockedInView = report.targets.filter((t) => t.inView && t.blocked).length;
    this.content.innerHTML = `
      <label class="field">当前座席 <b>${seat.sectionId} · R${seat.row + 1}C${seat.col + 1}</b></label>
      <div class="hint">拖动画面环视场馆,视野内外与遮挡标记实时更新;红色标记=被挡区域</div>
      <div style="margin:8px 0">
        <span class="tag">视野内 ${inViewCount}/${report.targets.length}</span>
        ${blockedCount === 0
          ? '<span class="tag ok">无遮挡</span>'
          : `<span class="tag bad">被挡 ${blockedCount} 个(视野内 ${blockedInView})</span>`}
      </div>
      <table>
        <thead><tr><th>关键点</th><th>视野/遮挡</th><th>遮挡来源</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="hint" style="margin-top:10px">
        红线=被阻挡视线,绿线=通视;红球/红环标出栏杆或前排观众的遮挡位置;环视时视野外关键点自动淡化
      </div>`;
  }
}

customElements.define('info-panel', InfoPanel);
