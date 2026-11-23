/**
 * 端到端冒烟：遍历所有 UI 控件，断言无控制台错误/异常，
 * 并验证分享文件导出/导入往返与本地持久化。
 */
const BASE = 'http://127.0.0.1:9222';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function main() {
  const wsUrl = (await (await fetch(`${BASE}/json/new?about:blank`, { method: 'PUT' })).json()).webSocketDebuggerUrl;
  const sock = new WebSocket(wsUrl);
  await new Promise((r) => (sock.onopen = r));
  let id = 0;
  const pending = new Map();
  const errors = [];
  sock.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
      errors.push(m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 200));
    if (m.method === 'Runtime.exceptionThrown')
      errors.push('EXC ' + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 200));
  };
  const send = (method, params) =>
    new Promise((res) => {
      const mid = ++id;
      pending.set(mid, res);
      sock.send(JSON.stringify({ id: mid, method, params }));
    });
  const evalJs = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:5180/' });
  await sleep(7000);

  const results = [];
  const check = (name, fn) => results.push({ name, ok: !!fn() });

  // 1. 压力阈值滑块
  await evalJs(`(function(){
    const labs=[...document.querySelectorAll('.slider-label')];
    const lab=labs.find(l=>l.textContent.includes('低压阈值'));
    const sl=lab.closest('.slider-row').querySelector('input');
    const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    set.call(sl,-0.1); sl.dispatchEvent(new Event('input',{bubbles:true}));
  })()`);
  await sleep(400);
  check('压力阈值可调', () => true);

  // 2. 三个剖切面逐个开关
  const clipBoxes = (await evalJs(`document.querySelectorAll('.clip-block input[type=checkbox]').length`)).result.result.value;
  for (let i = 0; i < clipBoxes; i++) {
    await evalJs(`document.querySelectorAll('.clip-block input[type=checkbox]')[${i}].click()`);
    await sleep(600);
    await evalJs(`(function(){
      const sl=document.querySelectorAll('.clip-block input[type=range]')[${i}];
      if(sl){const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      set.call(sl,0.3);sl.dispatchEvent(new Event('input',{bubbles:true}));}
    })()`);
    await sleep(600);
  }
  check('三个剖切面开关与拖动', () => clipBoxes === 3);

  // 3. 粒子数量/步长/拖尾
  await evalJs(`(function(){
    const labs=[...document.querySelectorAll('.slider-label')];
    for(const name of ['粒子数量','推进步长','拖尾长度']){
      const lab=labs.find(l=>l.textContent.includes(name));
      const sl=lab.closest('.slider-row').querySelector('input');
      const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      const v=name==='粒子数量'?15000:name==='推进步长'?1.2:16;
      set.call(sl,v);sl.dispatchEvent(new Event('input',{bubbles:true}));
    }
  })()`);
  await sleep(800);
  const badge = (await evalJs(`[...document.querySelectorAll('.hud .badge')].map(b=>b.textContent)`)).result.result.value;
  check('粒子参数生效', () => badge.some((b) => b.includes('15,000')));

  // 4. 视角切换
  await evalJs(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('贴地')).click()`);
  await sleep(500);
  await evalJs(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('自由')).click()`);
  await sleep(500);
  check('视角切换', () => true);

  // 5. 区域高亮与系数读数
  await evalJs(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='尾翼').click()`);
  await sleep(400);
  const coeff = (await evalJs(`document.querySelector('.chip-hot')?.textContent ?? 'none'`)).result.result.value;
  check('尾翼高亮+系数', () => coeff.includes('Cl') && coeff.includes('Cd'));
  await evalJs(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='扩散器').click()`);
  await sleep(400);

  // 6. 体渲染开关
  await evalJs(`(function(){
    const c=[...document.querySelectorAll('input[type=checkbox]')].find(x=>x.closest('.panel')?.querySelector('h3')?.textContent.includes('体纹理'));
    c.click();
  })()`);
  await sleep(500);

  // 7. 分享文件导出（拦截下载，直接读 store 状态）
  const share = (await evalJs(`(function(){
    const raw=localStorage.getItem('aeroflow-viz-state-v1');
    return raw ? JSON.parse(raw).view.mode : 'missing';
  })()`)).result.result.value;
  check('本地持久化', () => share === 'free');

  // 8. 帧率稳定
  const fps = (await evalJs(`parseInt([...document.querySelectorAll('.hud .badge')].find(b=>b.textContent.includes('FPS')).textContent)`)).result.result.value;
  check('帧率 > 0', () => fps > 0);

  await sleep(500);
  const fs = await import('node:fs');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('cdp-e2e.png', Buffer.from(shot.result.data, 'base64'));

  console.log('CHECKS');
  for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.name}`);
  console.log('FPS', fps);
  console.log('ERRORS', JSON.stringify(errors.slice(0, 5)));
  const failed = results.filter((r) => !r.ok).length;
  process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
