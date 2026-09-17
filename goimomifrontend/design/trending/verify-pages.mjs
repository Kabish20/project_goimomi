import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, channel: process.env.VERIFY_BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const base = process.env.VERIFY_BASE_URL || 'http://localhost:5174';
const output = fileURLToPath(new URL('../../../output/design/trending/', import.meta.url));
await fs.mkdir(output, { recursive: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => sessionStorage.setItem('generalEnquiryShown', 'true'));
await page.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  if (url.origin === new URL(base).origin || (url.hostname === 'cdn-icons-png.flaticon.com' && route.request().resourceType() === 'image')) return route.continue();
  return route.abort();
});
const render = async (path) => {
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.locator('.trending-page').waitFor();
  await page.locator('.trending-page img').evaluateAll(async images => {
    await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
  });
};
try {
  await render('/trendingdomesticdestination');
  assert.equal(await page.locator('.td-card').count(), 2);
  assert.match(await page.title(), /Trending Domestic Destination/);
  assert.equal(await page.getByRole('link', { name: 'Explore Kashmir packages', exact: true }).getAttribute('href'), '/kashmir');
  await page.screenshot({ path: `${output}/domestic-desktop.png`, fullPage: true });
  await page.locator('#td-search').fill('kashmir');
  assert.equal(await page.locator('.td-card').count(), 1);
  await page.locator('#td-region').selectOption('North India');
  await page.locator('#td-search').fill('no matching holiday');
  await page.getByRole('button', { name: 'Show all destinations' }).click();
  assert.equal(await page.locator('.td-card').count(), 2);
  await page.getByRole('link', { name: 'Explore Kashmir packages', exact: true }).click();
  await page.locator('#km-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/kashmir');
  await render('/trendinginternationaldestination');
  assert.equal(await page.locator('.td-card').count(), 6);
  assert.match(await page.title(), /Trending International Destination/);
  assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'), /\/images\/seo\/holiday-inspiration.jpg$/);
  await page.screenshot({ path: `${output}/international-desktop.png`, fullPage: true });
  await page.locator('#td-region').selectOption('Southeast Asia');
  assert.equal(await page.locator('.td-card').count(), 3);
  await page.locator('#td-search').fill('Bali');
  assert.equal(await page.locator('.td-card').count(), 1);
  await page.getByRole('link', { name: 'Explore Bali packages', exact: true }).click();
  assert.equal(new URL(page.url()).search, '?category=International');
  assert.equal(await page.evaluate(() => window.history.state.usr.filter), 'Bali');
  await render('/trendingdomesticdestination');
  await page.locator('header button').filter({ hasText: 'Holidays' }).first().click();
  const desktopInternational = page.locator('header').getByRole('link', { name: 'Trending International Destination', exact: true });
  assert.equal(await desktopInternational.getAttribute('href'), '/trendinginternationaldestination');
  await desktopInternational.click();
  await page.locator('.trending-international').waitFor();
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const kind of ['domestic', 'international']) {
      await render(`/trending${kind}destination`);
      const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(size.scroll <= size.viewport, `${kind} overflows at ${width}px`);
      if (width === 390) await page.screenshot({ path: `${output}/${kind}-mobile.png`, fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  const report = { passed: true, checks: ['Domestic and international pages render with all images', 'Kashmir card opens the complete package page', 'Search and region filters combine correctly', 'Empty state resets both filters', 'International card carries its destination into holiday results', 'Desktop menu opens the new landing page', 'SEO titles and share image', 'No horizontal overflow at 320px, 390px or 768px on either page', 'No JavaScript runtime errors'], notes: 'Read-only browser checks with mocked API responses. No enquiries submitted.' };
  await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
