// 顶部工具条组件:场馆信息、网格载入、眼高、视角切换、导入导出
import { sharedCss } from './styles';

export class VenueToolbar extends HTMLElement {
  private eyeHeightValue!: HTMLElement;
  private eyeHeightInput!: HTMLInputElement;
  private venueNameEl!: HTMLElement;
  private seatCountEl!: HTMLElement;
  private exitEyeBtn!: HTMLButtonElement;
  private exportBtn!: HTMLButtonElement;
  private scoreBtn!: HTMLButtonElement;

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [new CSSStyleSheet()];
    shadow.adoptedStyleSheets[0].replaceSync(sharedCss);
    shadow.innerHTML = `
      <div class="panel toolbar">
        <div class="row">
          <div>
            <div class="venue-name" id="venueName">—</div>
            <div class="hint">座席总数 <b id="seatCount">0</b></div>
          </div>
          <div class="spacer"></div>
          <button id="loadMeshBtn" title="载入 GLB/GLTF/OBJ 场馆或看台网格">📦 载入场馆网格</button>
          <input type="file" id="meshFile" accept=".glb,.gltf,.obj" />
          <button id="exportBtn" class="primary" disabled>💾 导出座席清单</button>
          <button id="importBtn">📂 导入清单还原</button>
          <input type="file" id="listFile" accept=".json,application/json" />
        </div>
        <div class="row" style="margin-top:10px">
          <label class="field" style="min-width:260px;margin:0">
            观众眼位高度:<b id="eyeHeightValue">1.15 m</b>
            <input type="range" id="eyeHeight" min="1.0" max="1.3" step="0.01" value="1.15" />
            <span class="hint">范围 1.00–1.30 米,观众视角下实时生效</span>
          </label>
          <div class="spacer"></div>
          <button id="scoreBtn" class="primary" disabled>🎯 框选座席批量评分</button>
          <button id="clearScoreBtn" disabled>清除评分着色</button>
          <button id="exitEyeBtn" class="danger" hidden>↩ 退出观众视角</button>
        </div>
      </div>
      <style>
        .toolbar { margin: 10px 12px 0; }
        .venue-name { font-weight: 700; font-size: 15px; color: var(--text); }
      </style>
    `;

    const $ = <T extends HTMLElement>(id: string) => shadow.getElementById(id) as T;
    this.venueNameEl = $('venueName');
    this.seatCountEl = $('seatCount');
    this.eyeHeightValue = $('eyeHeightValue');
    this.eyeHeightInput = $('eyeHeight') as HTMLInputElement;
    this.exitEyeBtn = $('exitEyeBtn') as HTMLButtonElement;
    this.exportBtn = $('exportBtn') as HTMLButtonElement;
    this.scoreBtn = $('scoreBtn') as HTMLButtonElement;

    this.eyeHeightInput.addEventListener('input', () => {
      const h = parseFloat(this.eyeHeightInput.value);
      this.eyeHeightValue.textContent = `${h.toFixed(2)} m`;
      this.dispatchEvent(new CustomEvent('eye-height-change', { detail: h }));
    });
    ($('loadMeshBtn') as HTMLButtonElement).addEventListener('click', () =>
      ($('meshFile') as HTMLInputElement).click(),
    );
    ($('meshFile') as HTMLInputElement).addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files?.[0]) {
        this.dispatchEvent(new CustomEvent('load-mesh', { detail: input.files[0] }));
        input.value = '';
      }
    });
    this.exportBtn.addEventListener('click', () =>
      this.dispatchEvent(new CustomEvent('export-list', {})),
    );
    ($('importBtn') as HTMLButtonElement).addEventListener('click', () =>
      ($('listFile') as HTMLInputElement).click(),
    );
    ($('listFile') as HTMLInputElement).addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files?.[0]) {
        this.dispatchEvent(new CustomEvent('import-list', { detail: input.files[0] }));
        input.value = '';
      }
    });
    this.scoreBtn.addEventListener('click', () =>
      this.dispatchEvent(new CustomEvent('run-score', {})),
    );
    ($('clearScoreBtn') as HTMLButtonElement).addEventListener('click', () =>
      this.dispatchEvent(new CustomEvent('clear-score', {})),
    );
    this.exitEyeBtn.addEventListener('click', () =>
      this.dispatchEvent(new CustomEvent('exit-eye-view', {})),
    );
  }

  setVenueInfo(name: string, seatCount: number): void {
    this.venueNameEl.textContent = name;
    this.seatCountEl.textContent = seatCount.toLocaleString();
  }

  setEyeHeight(h: number): void {
    this.eyeHeightInput.value = String(h);
    this.eyeHeightValue.textContent = `${h.toFixed(2)} m`;
  }

  setEyeViewMode(on: boolean): void {
    this.exitEyeBtn.hidden = !on;
  }

  setSelectionCount(n: number): void {
    this.exportBtn.disabled = n === 0;
    this.scoreBtn.disabled = n === 0;
    this.scoreBtn.textContent = n > 0 ? `🎯 对 ${n} 个座席批量评分` : '🎯 框选座席批量评分';
  }

  setScoring(running: boolean, hasScores: boolean): void {
    const clearBtn = this.shadowRoot?.getElementById('clearScoreBtn') as HTMLButtonElement | null;
    if (clearBtn) clearBtn.disabled = !hasScores || running;
    this.scoreBtn.disabled = running || (this.scoreBtn.textContent.includes('0 个') && !running);
  }
}

customElements.define('venue-toolbar', VenueToolbar);
