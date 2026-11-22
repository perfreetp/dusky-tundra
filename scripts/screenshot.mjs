// 截图:碰撞变形 + 应力着色 + 剖切对比的视觉效果
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 900 });
await page.goto('http://localhost:4519/', { waitUntil: 'networkidle0' });

// 加载示例车架
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find((b) => b.textContent.includes('示例车架'))?.click();
});
await page.waitForFunction(() => document.body.textContent.includes('manifold-3d)'), { timeout: 30000 });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: 'scripts/shot-1-loaded.png' });

// 施加两次碰撞
for (let i = 0; i < 2; i++) {
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((b) => b.textContent.includes('施加碰撞'))?.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
}
await page.screenshot({ path: 'scripts/shot-2-collided.png' });

// 对比 + 剖切
await page.evaluate(() => {
  [...document.querySelectorAll('input[type=checkbox]')].forEach((b) => {
    const t = b.parentElement.textContent;
    if (t.includes('叠加原始车架') || t.includes('启用剖切')) b.click();
  });
});
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: 'scripts/shot-3-clip-compare.png' });

await browser.close();
console.log('screenshots saved');
