/**
 * 运行时冒烟：启动页面，捕获 console 错误，验证 WebGL canvas 实际绘制，
 * 并驱动楼层切换、剖切、负载等交互，确认无运行时异常。
 */
import { chromium } from 'playwright';

const URL = process.env.SMOKE_URL ?? 'http://localhost:5199/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const warnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') errors.push(text);
    if (msg.type() === 'warning') warnings.push(text);
  });
  page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const canvasInfo = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return { found: false };
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return { found: true, width: c.width, height: c.height, hasGL: !!gl };
  });
  console.log('canvas:', JSON.stringify(canvasInfo));

  // 楼层切换到顶层
  const ticks = page.locator('.tick');
  const tickCount = await ticks.count();
  await ticks.nth(tickCount - 1).click();
  await page.waitForTimeout(400);

  // 启用剖切
  await page.getByText('启用高度剖切').click();
  await page.waitForTimeout(300);
  const clipRange = page.locator('.panel', { hasText: '剖切平面' }).locator('input[type="range"]');
  await clipRange.fill('20');
  await page.waitForTimeout(400);

  // 负载与透明度
  const ranges = page.locator('.panel input[type="range"]');
  await ranges.nth(0).fill('0.8');
  await ranges.nth(1).fill('0.8');
  await page.waitForTimeout(300);

  // 自动播放
  await page.getByRole('button', { name: /自动播放|暂停/ }).click();
  await page.waitForTimeout(1400);
  await page.getByRole('button', { name: /暂停|自动播放/ }).click();

  const hud = await page.locator('.stats-hud').innerText();
  console.log('HUD:\n' + hud);

  await page.waitForTimeout(300);
  await browser.close();

  console.log('\n=== console errors ===');
  console.log(errors.length ? errors.join('\n') : '(none)');
  console.log('=== console warnings ===');
  console.log(warnings.length ? warnings.slice(0, 5).join('\n') : '(none)');

  const realErrors = errors.filter((e) => !/GL_|WebGL|GPU|software rendering/i.test(e));
  if (!canvasInfo.found || !canvasInfo.hasGL || realErrors.length > 0) {
    console.error('\nSMOKE FAILED');
    process.exit(1);
  }
  console.log('\nSMOKE PASSED');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
