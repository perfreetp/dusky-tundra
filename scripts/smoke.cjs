// CDP 冒烟测试：启动无头 Chrome，打开 demo 页，收集 console 并断言 HUD 实例数
const { spawn } = require('child_process');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SINGLE = process.env.SMOKE_SINGLE === '1';
const STAGE = process.env.SMOKE_STAGE ?? ''; // bud | mid | full
const URL = `http://127.0.0.1:5180/?demo=1${SINGLE ? '&single=1&center=1' : ''}`;
const PORT = 9300 + Math.floor(Math.random() * 200);
const PROFILE = `C:\\Users\\Administrator\\AppData\\Local\\Temp\\cdp-profile-${PORT}`;

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--enable-unsafe-swiftshader',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--window-size=1400,800',
    URL
  ], { stdio: 'ignore' });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let target = null;
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      const list = await getJSON('/json/list');
      target = list.find((t) => t.type === 'page');
      if (target) break;
    } catch { /* retry */ }
  }
  if (!target) {
    console.error('FAIL: Chrome DevTools target not found');
    chrome.kill();
    process.exit(1);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const errors = [];
  const logs = [];
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      pending.set(mid, resolve);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  ws.onopen = async () => {
    await send('Runtime.enable');
    await send('Log.enable');
    // 轮询等待 Babylon 初始化 + demo 200 支摆放完成（软件渲染下较慢）
    const ready = await send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const t0 = Date.now();
        const timer = setInterval(() => {
          const hud = document.querySelector('.viewport-hud')?.innerText || '';
          const slider = document.querySelector('.timeline-top input[type=range]');
          const readyText = '${SINGLE ? '花枝数 1' : '花枝数 200'}';
          if ((hud.includes(readyText) && slider) || Date.now() - t0 > 25000) {
            clearInterval(timer);
            resolve(hud.includes(readyText) ? 'ready' : 'timeout:' + hud);
          }
        }, 500);
      })`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('READY:', ready.result?.value);
    // 阶段控制：通过调试 store 把时间轴推到指定开放度
    if (STAGE) {
      const fraction = STAGE === 'bud' ? 0.05 : STAGE === 'mid' ? 0.5 : 1;
      await send('Runtime.evaluate', {
        expression: `(() => { try {
          const store = window.__store;
          const curve = store.activeCurve;
          const target = ${fraction};
          // 二分找达到目标开放度的 GDD
          let lo = 0, hi = store.totalGdd;
          for (let k = 0; k < 30; k++) {
            const mid = (lo + hi) / 2;
            if (curve.evaluate(mid) < target) lo = mid; else hi = mid;
          }
          store.setTimelineGdd((lo + hi) / 2);
          window.__smokeStage = target;
          return store.state.timelineGdd;
        } catch (e) { return 'ERR: ' + e.message; } })()`,
        returnByValue: true
      }).then((r) => console.log('STAGE_GDD:', r.result?.value));
      await sleep(600);
    }
    if (process.env.SMOKE_SINGLE === '1') {
      await send('Runtime.evaluate', {
        expression: `(() => { try {
          const mgr = window.__sceneManager;
          if (!mgr) return 'no-mgr';
          const scene = mgr.getScene();
          const cam = scene.cameras[0];
          cam.radius = 2.6;
          cam.beta = Math.PI / 2.4;
          cam.alpha = -Math.PI / 2.2;
          cam.target.set(0, 2.2, 0);
          const petalMesh = scene.meshes.find((m) => m.name.startsWith('petal:'));
          const vb = petalMesh.getVertexBuffer('instanceColor');
          const colorData = vb ? vb.getData() : null;
          const normals = petalMesh.getVerticesData('normal');
          return {
            petalName: petalMesh.name,
            thinCount: petalMesh.thinInstanceCount,
            colorSample: colorData ? Array.from(colorData.slice(0, 8)) : null,
            normalSample: normals ? normals.slice(0, 9) : null,
            twoSided: petalMesh.material.twoSidedLighting
          };
        } catch (e) { return 'ERR: ' + e.message + ' / ' + e.stack; } })()`,
        returnByValue: true
      }).then((r) => console.log('MESH_DIAG:', JSON.stringify(r.result?.value)));
      await sleep(500);
    }
    const probe = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        url: location.href,
        appHtml: document.getElementById('app')?.innerHTML?.slice(0, 120),
        header: !!document.querySelector('.app-header'),
        canvas: !!document.querySelector('canvas'),
        hud: document.querySelector('.viewport-hud')?.innerText ?? null
      })`,
      returnByValue: true
    });
    console.log('PROBE:', probe.result?.value);
    await sleep(800);
    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        const hud0 = document.querySelector('.viewport-hud')?.innerText || '';
        // 1) 时间轴拖到末端：开放度应变化、LOD 高档应出现实例（阶段模式下跳过以保留指定开放度）
        const slider = document.querySelector('.timeline-top input[type=range]');
        if (window.__smokeStage === undefined) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(slider, slider.max);
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise((r) => setTimeout(r, 600));
        } else {
          await new Promise((r) => setTimeout(r, 200));
        }
        const hudFull = document.querySelector('.viewport-hud')?.innerText || '';
        const readoutFull = document.querySelector('.timeline-readout')?.innerText || '';
        // 1b) 回放按钮：回起点后点击播放，时间轴应自动推进
        let playbackCheck = 'skipped';
        if (window.__smokeStage === undefined) {
          const resetBtn = [...document.querySelectorAll('.timeline-top button')].find((b) => b.innerText.includes('回起点'));
          resetBtn?.click();
          await new Promise((r) => setTimeout(r, 150));
          const playBtn = [...document.querySelectorAll('.timeline-top button')].find((b) => b.innerText.includes('回放'));
          playBtn?.click();
          await new Promise((r) => setTimeout(r, 900));
          const movingGdd = window.__store.state.timelineGdd;
          window.__store.setPlaying(false);
          playbackCheck = movingGdd > 5 ? 'advancing@' + movingGdd.toFixed(0) : 'stuck@0';
        }
        // 2) 切到积温页检查采收窗口卡片
        document.querySelectorAll('.tab-row button')[0].click();
        await new Promise((r) => setTimeout(r, 200));
        const cards = [...document.querySelectorAll('.stat-card .num')].map((e) => e.innerText);
        // 3) 导出 JSON 并立即还原，校验结构与花枝数
        let schemeCheck = 'not-run';
        try {
          const store = window.__store;
          const scheme = store.exportScheme();
          const beforeBranches = scheme.branches.length;
          store.clearBranches();
          await new Promise((r) => setTimeout(r, 300));
          const afterClear = store.state.branches.length;
          const result = store.importScheme(scheme);
          await new Promise((r) => setTimeout(r, 300));
          const afterImport = store.state.branches.length;
          schemeCheck = JSON.stringify({
            format: scheme.format,
            ok: result.ok,
            beforeBranches,
            afterClear,
            afterImport,
            varieties: scheme.varieties.length,
            layers: scheme.varieties[0].petal.layers,
            curvePoints: scheme.varieties[0].curve.length,
            restoredGdd: Math.round(store.state.timelineGdd)
          });
        } catch (e) { schemeCheck = 'error: ' + e.message; }
        return JSON.stringify({
          url: location.href,
          demoFlag: window.__demoMode === true,
          hud0,
          hudFull,
          readoutFull,
          gddCards: cards,
          playbackCheck,
          schemeCheck,
          drawCalls: window.__sceneManager ? window.__sceneManager.getRenderStats() : null
        });
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('EVAL:', evalRes.result?.value);
    if (evalRes.exceptionDetails) {
      console.log('EVAL_EXCEPTION:', JSON.stringify(evalRes.exceptionDetails.exception?.description || evalRes.exceptionDetails.text));
    }
    console.log('CONSOLE_ERRORS:', JSON.stringify(errors, null, 2));
    console.log('BJS_LOGS:', logs.filter((l) => l.includes('BJS')).join('\n'));
    // 截图必须在关闭浏览器前完成
    await send('Page.enable');
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    if (screenshot?.data) {
      require('fs').writeFileSync('scripts/smoke-shot.png', Buffer.from(screenshot.data, 'base64'));
      console.log('SCREENSHOT: scripts/smoke-shot.png');
    }
    ws.close();
    chrome.kill();
    const realErrors = errors.filter((e) => !/favicon/i.test(e));
    const value = evalRes.result?.value ?? '';
    let parsed = null;
    try { parsed = JSON.parse(value); } catch { /* keep null */ }
    const hudFull = parsed?.hudFull ?? '';
    // 任意 LOD 档位出现实例即通过；非阶段模式（拖到末端）额外要求高档位有实例
    const hudFlat = hudFull.replace(/\s+/g, ' ');
    const lodNums = (hudFlat.match(/LOD[^：:]*[：:]\s*([\d\s/]+)/)?.[1] ?? '')
      .split('/').map((s) => parseInt(s.trim(), 10) || 0);
    const anyLodInstances = lodNums.some((n) => n > 0);
    const highLodHasInstances = lodNums.slice(4).some((n) => n > 0);
    const lodOk = anyLodInstances && (STAGE !== '' || highLodHasInstances);
    const schemeOk = !!parsed?.schemeCheck
      && parsed.schemeCheck.includes('"ok":true')
      && parsed.schemeCheck.includes('"afterClear":0')
      && parsed.schemeCheck.includes(`"afterImport":${SINGLE ? 1 : 200}`);
    const fail = realErrors.length > 0 || !lodOk || !schemeOk
      || (STAGE === '' && parsed?.playbackCheck !== undefined && !String(parsed.playbackCheck).startsWith('advancing'));
    if (fail) console.log('LOD_CHECK:', { anyLodInstances, highLodHasInstances }, 'SCHEME_OK:', schemeOk, 'PLAYBACK:', parsed?.playbackCheck);
    console.log(fail ? 'RESULT: FAIL' : 'RESULT: PASS');
    process.exit(fail ? 1 : 0);
  };
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = (msg.params.args || []).map((a) => a.value ?? a.description ?? '').join(' ');
      logs.push(text);
      if (msg.params.type === 'error') errors.push(text);
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      errors.push(msg.params.entry.text);
    }
  };
  ws.onerror = (e) => {
    console.error('WS ERROR', e?.message ?? e);
    chrome.kill();
    process.exit(1);
  };
})();
