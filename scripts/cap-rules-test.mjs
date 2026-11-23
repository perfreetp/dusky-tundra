/**
 * 剖切封口三规则的数据级验证：
 * 通过 window 暴露的调试钩子读取截面环/封口网格在不同剖切高度的 visible 数。
 * 自由段高度应出现封口；轮缘包角高度因弧段抑制封口应隐藏。
 */
import { chromium } from 'playwright';

const URL = process.env.SMOKE_URL ?? 'http://localhost:5199/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.getByText('启用高度剖切').click();
  await page.waitForTimeout(300);

  const clipRange = page.locator('.panel', { hasText: '剖切平面' }).locator('input[type="range"]');

  // 自由段高度 20m
  await clipRange.fill('20');
  await page.waitForTimeout(500);
  const atFreeSpan = await page.evaluate(() => (window).__ropeDebug?.() ?? null);

  // 轮缘包角高度 37.2m（曳引轮中心）
  await clipRange.fill('37.2');
  await page.waitForTimeout(500);
  const atSheave = await page.evaluate(() => (window).__ropeDebug?.() ?? null);

  await browser.close();

  console.log('自由段 20m:', JSON.stringify(atFreeSpan));
  console.log('轮缘 37.2m:', JSON.stringify(atSheave));

  if (!atFreeSpan || !atSheave) {
    console.error('调试钩子未就绪');
    process.exit(1);
  }
  // 自由段：应至少有一个封口可见
  if (atFreeSpan.visibleCaps < 1) {
    console.error('自由段切口缺少封口');
    process.exit(1);
  }
  // 轮缘高度：弧段抑制，封口应全部隐藏
  if (atSheave.visibleCaps !== 0) {
    console.error('轮缘包角区封口未被弧段抑制');
    process.exit(1);
  }
  if (errors.length) {
    console.error('页面错误:', errors);
    process.exit(1);
  }
  console.log('CAP RULES PASSED');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
