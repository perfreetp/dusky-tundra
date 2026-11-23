// CDP 运行时冒烟:加载应用 -> 检查 Shadow DOM 渲染 -> 模拟框选 -> 触发 Worker 评分 -> 导出/导入
const base = 'http://localhost:9222';

async function cdpSend(ws, id, method, params) {
  return new Promise((resolve) => {
    const onMsg = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id === id) {
        ws.removeEventListener('message', onMsg);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const list = await (await fetch(`${base}/json/list`)).json();
const page = list.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const send = (method, params) => cdpSend(ws, ++id, method, params);
await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');

const errors = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === 'Runtime.exceptionThrown') {
    errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
  }
  if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
    errors.push('LOG: ' + msg.params.entry.text);
  }
});

await send('Page.navigate', { url: 'http://localhost:5199/' });
await new Promise((r) => setTimeout(r, 5000));

const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};

// 1) 渲染探测
const render = await evalJs(`(() => {
  const app = document.querySelector('venue-app');
  const sr = app.shadowRoot;
  const canvas = sr.querySelector('canvas');
  const toolbar = sr.querySelector('venue-toolbar').shadowRoot;
  const info = sr.querySelector('info-panel').shadowRoot;
  const score = sr.querySelector('score-panel').shadowRoot;
  return {
    hasCanvas: !!canvas,
    canvasSize: canvas ? [canvas.width, canvas.height] : null,
    venueName: toolbar.querySelector('#venueName').textContent,
    seatCount: toolbar.querySelector('#seatCount').textContent,
    sections: info.textContent.includes('南看台'),
    scoreHint: score.textContent.includes('manifold'),
  };
})()`);
console.log('1) 渲染探测:', JSON.stringify(render));

// 2) 模拟 Shift+拖拽框选(大框覆盖大部分屏幕,保证选中座席)
const btnText = await evalJs(`(async () => {
  const app = document.querySelector('venue-app');
  const canvas = app.shadowRoot.querySelector('canvas');
  const r = canvas.getBoundingClientRect();
  canvas.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true, clientX: r.left + r.width * 0.08, clientY: r.top + r.height * 0.15,
    button: 0, shiftKey: true, pointerId: 1, pointerType: 'mouse',
  }));
  window.dispatchEvent(new PointerEvent('pointermove', {
    clientX: r.left + r.width * 0.92, clientY: r.top + r.height * 0.92, pointerId: 1,
  }));
  window.dispatchEvent(new PointerEvent('pointerup', {
    clientX: r.left + r.width * 0.92, clientY: r.top + r.height * 0.92, pointerId: 1, shiftKey: true,
  }));
  await new Promise((res) => setTimeout(res, 300));
  return app.shadowRoot.querySelector('venue-toolbar').shadowRoot.querySelector('#scoreBtn').textContent;
})()`);
console.log('2) 框选后按钮:', btnText);

// 3) 触发 Worker 批量评分,等待结果面板
const scoreResult = await evalJs(`(async () => {
  const app = document.querySelector('venue-app');
  app.shadowRoot.querySelector('venue-toolbar').shadowRoot.querySelector('#scoreBtn').click();
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 500));
    const txt = app.shadowRoot.querySelector('score-panel').shadowRoot.textContent;
    if (txt.includes('参评座席')) {
      return app.shadowRoot.querySelector('score-panel').shadowRoot.querySelector('.panel').innerText
        .replace(/\\s+/g, ' ').trim().slice(0, 220);
    }
  }
  return 'TIMEOUT';
})()`);
console.log('3) 评分面板:', scoreResult);

// 4) 导出清单(拦截 Blob)
const exportResult = await evalJs(`(async () => {
  let captured = null;
  const orig = URL.createObjectURL;
  URL.createObjectURL = (blob) => { captured = blob; return 'blob:mock'; };
  document.querySelector('venue-app').shadowRoot
    .querySelector('venue-toolbar').shadowRoot.querySelector('#exportBtn').click();
  await new Promise((r) => setTimeout(r, 300));
  URL.createObjectURL = orig;
  if (!captured) return 'NO BLOB';
  const data = JSON.parse(await captured.text());
  window.__exportedText = JSON.stringify(data);
  return {
    format: data.format,
    seatCount: data.seats.length,
    hasScore: typeof data.seats[0].score === 'number',
    eyeHeight: data.eyeHeight,
  };
})()`);
console.log('4) 导出清单:', JSON.stringify(exportResult));

// 5) 清空选区后导入还原
const importResult = await evalJs(`(async () => {
  const app = document.querySelector('venue-app');
  const sr = app.shadowRoot;
  const canvas = sr.querySelector('canvas');
  const r = canvas.getBoundingClientRect();
  // 空白框选清空
  canvas.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true, clientX: r.left + 4, clientY: r.top + 4, button: 0, shiftKey: true, pointerId: 2,
  }));
  window.dispatchEvent(new PointerEvent('pointerup', {
    clientX: r.left + 5, clientY: r.top + 5, pointerId: 2, shiftKey: true,
  }));
  await new Promise((res) => setTimeout(res, 200));
  const emptyState = sr.querySelector('venue-toolbar').shadowRoot.querySelector('#exportBtn').disabled;
  // 导入刚导出的文件
  const file = new File([window.__exportedText], 'restore.json', { type: 'application/json' });
  const input = sr.querySelector('venue-toolbar').shadowRoot.querySelector('#listFile');
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise((res) => setTimeout(res, 500));
  return {
    exportDisabledWhenEmpty: emptyState,
    restoredButton: sr.querySelector('venue-toolbar').shadowRoot.querySelector('#scoreBtn').textContent,
    status: sr.querySelector('#statusbar').textContent,
  };
})()`);
console.log('5) 导入还原:', JSON.stringify(importResult));

console.log('\n运行时异常:', errors.length ? errors : '无');
ws.close();
process.exit(errors.length ? 1 : 0);
