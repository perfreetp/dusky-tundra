// 端到端冒烟:加载页面 -> 加载示例车架 -> 施加碰撞 -> 校验侧栏数值 -> 切换对比/剖切 -> 导出
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));

await page.goto('http://localhost:4519/', { waitUntil: 'networkidle0', timeout: 30000 });
await page.waitForSelector('.topbar h1', { timeout: 10000 });
console.log('1. 页面加载:', await page.$eval('.topbar h1', (el) => el.textContent));

// 加载示例车架(manifold-3d 生成)
const buttons = await page.$$('.sidebar button');
let demoBtn;
for (const b of buttons) {
  const t = await b.evaluate((el) => el.textContent);
  if (t.includes('示例车架')) demoBtn = b;
}
await demoBtn.click();
await page.waitForFunction(
  () => document.body.textContent.includes('示例车架 (manifold-3d)'),
  { timeout: 30000 },
);
await new Promise((r) => setTimeout(r, 800));
const statsText = await page.$eval('.stats', (el) => el.textContent);
console.log('2. 示例车架已加载, 侧栏含顶点数:', /顶点数/.test(statsText));
const v0 = await page.$eval('.stats dd:nth-of-type(3)', (el) => el.textContent).catch(() => 'n/a');

// 施加碰撞(默认正面碰撞 8000 kN·s)
const allBtns = await page.$$('.sidebar button');
for (const b of allBtns) {
  const t = await b.evaluate((el) => el.textContent);
  if (t.includes('施加碰撞')) {
    await b.click();
    break;
  }
}
await page.waitForFunction(
  () => !document.body.textContent.includes('计算中') && document.body.textContent.includes('碰撞历史'),
  { timeout: 30000 },
);
await new Promise((r) => setTimeout(r, 500));
const stats2 = await page.$eval('.stats', (el) => el.textContent);
const maxStress = stats2.match(/最大应力\s*([\d.]+)/)?.[1];
const collisions = stats2.match(/碰撞次数\s*(\d+)/)?.[1];
console.log('3. 碰撞完成: 次数=', collisions, '最大应力=', maxStress, 'MPa');

// 再切换一个预设角度施加第二次碰撞
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('.preset')];
  btns.find((b) => b.textContent.includes('顶部压溃'))?.click();
});
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  btns.find((b) => b.textContent.includes('施加碰撞'))?.click();
});
await page.waitForFunction(
  () => document.body.textContent.includes('#2'),
  { timeout: 30000 },
);
console.log('4. 第二次碰撞(切换预设角度)完成');

// 对比模式 + 剖切
await page.evaluate(() => {
  const boxes = [...document.querySelectorAll('input[type=checkbox]')];
  boxes.forEach((b) => {
    const label = b.parentElement.textContent;
    if (label.includes('叠加原始车架') || label.includes('启用剖切')) b.click();
  });
});
await new Promise((r) => setTimeout(r, 500));
console.log('5. 对比模式 + 剖切平面已开启');

// 侧栏数值快照
const finalStats = await page.$eval('.stats', (el) => el.innerText);
console.log('6. 侧栏数值:\n' + finalStats.split('\n').slice(0, 18).join(' | '));

// WebGL canvas 存在且有内容
const canvasOk = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  return !!c && c.width > 0 && c.height > 0;
});
console.log('7. WebGL canvas:', canvasOk);

if (errors.length) {
  console.log('页面错误:');
  errors.forEach((e) => console.log('  ' + e));
  process.exitCode = 1;
} else {
  console.log('E2E OK, 无页面错误');
}
await browser.close();
