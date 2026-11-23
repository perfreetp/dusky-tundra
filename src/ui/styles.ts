/* Web Components 组件样式(各组件共享,通过 adoptedStyleSheets 注入) */
export const sharedCss = `
:host {
  --panel-bg: rgba(18, 23, 34, 0.92);
  --panel-border: #2a3346;
  --text: #e6ebf4;
  --text-dim: #93a0b5;
  --accent: #4f8cff;
  --accent-2: #42e8f5;
  --warn: #ff9f0a;
  --danger: #ff4433;
  --ok: #34c759;
  font-family: "Segoe UI", "Microsoft YaHei", system-ui, sans-serif;
  color: var(--text);
  font-size: 13px;
  box-sizing: border-box;
}
* { box-sizing: border-box; }
.panel {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  padding: 12px 14px;
  backdrop-filter: blur(8px);
}
.panel h3 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--accent-2);
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel h3::before {
  content: "";
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background: var(--accent);
}
button {
  font: inherit;
  color: var(--text);
  background: #232c3e;
  border: 1px solid #34405a;
  border-radius: 7px;
  padding: 7px 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
button:hover:not(:disabled) { background: #2d3850; border-color: var(--accent); }
button:disabled { opacity: 0.45; cursor: not-allowed; }
button.primary {
  background: linear-gradient(135deg, #3d74e8, #4f8cff);
  border-color: #4f8cff;
  font-weight: 600;
}
button.primary:hover:not(:disabled) { background: linear-gradient(135deg, #4a82f5, #5f98ff); }
button.danger { border-color: #6b2f2f; color: #ff9b92; }
input[type="range"] { width: 100%; accent-color: var(--accent); }
input[type="file"] { display: none; }
label.field { display: block; margin: 8px 0; color: var(--text-dim); }
label.field b { color: var(--text); font-weight: 600; }
.row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.spacer { flex: 1; }
.hint { color: var(--text-dim); font-size: 11.5px; line-height: 1.6; }
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: #232c3e;
  border: 1px solid #34405a;
}
.tag.ok { color: var(--ok); border-color: #1f5c33; }
.tag.bad { color: #ff8075; border-color: #6b2f2f; }
.tag.warn { color: var(--warn); border-color: #6b521f; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
td, th { padding: 5px 6px; text-align: left; border-bottom: 1px solid var(--panel-border); }
th { color: var(--text-dim); font-weight: 500; }
.scroll { max-height: 260px; overflow-y: auto; }
.scroll::-webkit-scrollbar { width: 6px; }
.scroll::-webkit-scrollbar-thumb { background: #34405a; border-radius: 3px; }
progress { width: 100%; height: 8px; accent-color: var(--accent); }
.marquee {
  position: absolute;
  border: 1.5px dashed var(--accent-2);
  background: rgba(66, 232, 245, 0.12);
  pointer-events: none;
  z-index: 20;
  border-radius: 2px;
}
.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 5px;
  vertical-align: -1px;
}
`;
