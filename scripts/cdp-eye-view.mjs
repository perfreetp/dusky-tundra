// CDP 观众视角验证:点座席 -> 进视角 -> 检查遮挡标记 -> 模拟拖动环视 -> 调眼高 -> 退出
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

const errors = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === 'Runtime.exceptionThrown') {
    errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
  }
});

await send('Page.navigate', { url: 'http://localhost:5199/' });
await new Promise((r) => setTimeout(r, 4000));

const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};

// 1) 先用框选定位一片座席的屏幕区域,再点击其中座席进入观众视角
const enter = await evalJs(`(async () => {
  const app = document.querySelector('venue-app');
  const canvas = app.shadowRoot.querySelector('canvas');
  const r = canvas.getBoundingClientRect();
  // 屏幕下半部偏左通常是南看台座席,扫描若干点直到进入视角
  let entered = false;
  const candidates = [];
  for (const fx of [0.3, 0.4, 0.5, 0.6, 0.7]) {
    for (const fy of [0.55, 0.65, 0.75]) candidates.push([fx, fy]);
  }
  for (const [fx, fy] of candidates) {
    const x = r.left + r.width * fx;
    const y = r.top + r.height * fy;
    canvas.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'mouse',
    }));
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: x, clientY: y, pointerId: 1 }));
    await new Promise((res) => setTimeout(res, 80));
    if (!app.shadowRoot.querySelector('venue-toolbar').shadowRoot.querySelector('#exitEyeBtn').hidden) {
      entered = true;
      break;
    }
  }
  await new Promise((res) => setTimeout(res, 500));
  const tb = app.shadowRoot.querySelector('venue-toolbar').shadowRoot;
  const info = app.shadowRoot.querySelector('info-panel').shadowRoot;
  return {
    entered,
    exitBtnVisible: !tb.querySelector('#exitEyeBtn').hidden,
    infoHasOcclusion: info.textContent.includes('关键点'),
    infoText: info.querySelector('.panel').innerText.replace(/\\s+/g, ' ').slice(0, 300),
  };
})()`);
console.log('1) 进入观众视角:', JSON.stringify(enter, null, 1));

// 2) 检查场景中的遮挡标记(红球/红环/视线)
const markers = await evalJs(`(() => {
  // VenueScene 内部对象不直接暴露,通过渲染帧后 WebGL 状态间接验证:
  // 检查 info 面板表格中"被挡/可见"标签数量
  const info = document.querySelector('venue-app').shadowRoot.querySelector('info-panel').shadowRoot;
  const tags = [...info.querySelectorAll('.tag')].map((t) => t.textContent.trim());
  return { total: tags.length, blocked: tags.filter((t) => t === '被挡').length, visible: tags.filter((t) => t === '可见').length };
})()`);
console.log('2) 遮挡标记统计:', JSON.stringify(markers));

// 3) 模拟拖动环视,确认遮挡报告实时更新(对比拖动前后内容变化)
const drag = await evalJs(`(async () => {
  const app = document.querySelector('venue-app');
  const canvas = app.shadowRoot.querySelector('canvas');
  const r = canvas.getBoundingClientRect();
  const before = app.shadowRoot.querySelector('info-panel').shadowRoot.querySelector('.panel').innerText;
  canvas.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: 2,
  }));
  for (let i = 1; i <= 6; i++) {
    window.dispatchEvent(new PointerEvent('pointermove', {
      clientX: r.left + r.width / 2 + i * 25, clientY: r.top + r.height / 2 - i * 8, pointerId: 2,
    }));
    await new Promise((res) => setTimeout(res, 30));
  }
  window.dispatchEvent(new PointerEvent('pointerup', {
    clientX: r.left + r.width / 2 + 150, clientY: r.top + r.height / 2 - 48, pointerId: 2,
  }));
  await new Promise((res) => setTimeout(res, 400));
  const after = app.shadowRoot.querySelector('info-panel').shadowRoot.querySelector('.panel').innerText;
  return { changed: before !== after, stillInEyeView: !app.shadowRoot.querySelector('venue-toolbar').shadowRoot.querySelector('#exitEyeBtn').hidden };
})()`);
console.log('3) 拖动环视后:', JSON.stringify(drag));

// 4) 调节眼高滑杆 1.0 -> 1.3,验证实时生效无异常
const eye = await evalJs(`(async () => {
  const tb = document.querySelector('venue-app').shadowRoot.querySelector('venue-toolbar').shadowRoot;
  const slider = tb.querySelector('#eyeHeight');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(slider, '1.3');
  slider.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  const label13 = tb.querySelector('#eyeHeightValue').textContent;
  setter.call(slider, '1.0');
  slider.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  const label10 = tb.querySelector('#eyeHeightValue').textContent;
  return { label13, label10 };
})()`);
console.log('4) 眼高调节:', JSON.stringify(eye));

// 5) 退出观众视角
const exit = await evalJs(`(async () => {
  const app = document.querySelector('venue-app');
  app.shadowRoot.querySelector('venue-toolbar').shadowRoot.querySelector('#exitEyeBtn').click();
  await new Promise((r) => setTimeout(r, 400));
  const tb = app.shadowRoot.querySelector('venue-toolbar').shadowRoot;
  return { exitBtnHidden: tb.querySelector('#exitEyeBtn').hidden };
})()`);
console.log('5) 退出视角:', JSON.stringify(exit));

console.log('\n运行时异常:', errors.length ? errors : '无');
ws.close();
process.exit(errors.length ? 1 : 0);
