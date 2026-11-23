/**
 * CDP 冒烟测试（纯 JS）：真实 rAF 环境下验证
 *  - 无 JS 异常 / WebGPU 管线错误
 *  - 渲染循环推进（FPS badge、canvas 非空像素）
 *  - 交互（剖切面、贴地视角、区域高亮）不报错
 */
const BASE = 'http://127.0.0.1:9222';

async function main() {
  const wsUrl = (await (await fetch(`${BASE}/json/new?about:blank`, { method: 'PUT' })).json()).webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  const logs = [];
  const exceptions = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      logs.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      exceptions.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      logs.push(`[browser] ${msg.params.entry.text}`);
    }
  };
  const send = (method, params) =>
    new Promise((res) => {
      const mid = ++id;
      pending.set(mid, res);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:5180/' });
  await new Promise((r) => setTimeout(r, 8000));

  const probe = await send('Runtime.evaluate', {
    expression: `(() => {
      const badges = [...document.querySelectorAll('.hud .badge')].map(b => b.textContent.trim());
      const canvas = document.querySelector('canvas');
      const c2 = document.createElement('canvas');
      c2.width = 200; c2.height = 200;
      const ctx = c2.getContext('2d');
      ctx.drawImage(canvas, 0, 0, 200, 200);
      const data = ctx.getImageData(0, 0, 200, 200).data;
      let nonBg = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.abs(data[i]-10) > 8 || Math.abs(data[i+1]-14) > 8 || Math.abs(data[i+2]-20) > 8) nonBg++;
      }
      return { badges, engine: canvas.dataset.engine, nonBgPixels: nonBg, w: canvas.width, h: canvas.height };
    })()`,
    returnByValue: true,
  });

  const interact = await send('Runtime.evaluate', {
    expression: `(() => {
      const boxes = document.querySelectorAll('.clip-block input[type=checkbox]');
      boxes[0].click(); // YZ 剖切面
      const groundBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('贴地'));
      groundBtn.click();
      const wingBtn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '尾翼' && b.closest('.toolbar'));
      wingBtn.click();
      return { clips: boxes.length, ground: groundBtn.textContent.trim() };
    })()`,
    returnByValue: true,
  });

  await new Promise((r) => setTimeout(r, 3000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('node:fs');
  fs.writeFileSync('cdp-screenshot.png', Buffer.from(shot.result.data, 'base64'));

  const after = await send('Runtime.evaluate', {
    expression: `[...document.querySelectorAll('.hud .badge')].map(b=>b.textContent.trim())`,
    returnByValue: true,
  });

  console.log('PROBE', JSON.stringify(probe.result.result.value));
  console.log('INTERACT', JSON.stringify(interact.result.result.value));
  console.log('BADGES_AFTER', JSON.stringify(after.result.result.value));
  console.log('CONSOLE_ERRORS', JSON.stringify(logs.slice(0, 8), null, 1));
  console.log('EXCEPTIONS', JSON.stringify(exceptions.slice(0, 8), null, 1));
  ws.close();
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
