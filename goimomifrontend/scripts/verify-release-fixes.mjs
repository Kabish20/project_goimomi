import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5186';
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const missing = [];
let submitted;
let visaReads = 0;
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) missing.push(response.url()); });
await page.addInitScript(() => {
  localStorage.setItem('accessToken', 'expired-access-token');
  localStorage.setItem('refreshToken', 'expired-refresh-token');
  sessionStorage.setItem('generalEnquiryShown', 'true');
});
await page.route('**/*', async route => {
  const request = route.request();
  const url = new URL(request.url());
  if (url.pathname.startsWith('/api/')) {
    assert.notEqual(url.pathname, '/api/token/refresh/', 'Public browsing must not refresh an expired session');
    if (url.pathname === '/api/visas/') {
      visaReads++;
      assert.equal(request.headers().authorization, undefined);
    }
    if (request.method() === 'POST') {
      assert.equal(url.pathname, '/api/holiday-form/');
      assert.equal(request.headers().authorization, undefined);
      submitted = request.postDataJSON();
      return route.fulfill({ status: 201, contentType: 'application/json', body: '{"id":1}' });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  }
  if (url.origin === new URL(base).origin) return route.continue();
  return route.abort();
});
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.ok(visaReads > 0);
  await page.goto(base + '/trendingdomesticdestination', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'View Delhi Agra Jaipur package', exact: true }).click();
  await page.waitForURL('**/golden-triangle');
  await page.locator('#gt-title').waitFor();
  await page.waitForLoadState('networkidle');
  assert.match(await page.locator('h1').innerText(), /Golden Triangle/);
  assert.equal(await page.locator('.gt-day-card').count(), 5);
  assert.equal(await page.locator('.gt-package-card').count(), 3);
  assert.match(await page.locator('.gt-package-grid').innerText(), /19,800/);
  assert.match(await page.locator('.gt-package-grid').innerText(), /16,500/);
  assert.match(await page.locator('.gt-package-grid').innerText(), /14,650/);
  await page.getByRole('tab', { name: /Private Leisure/ }).click();
  for (const price of ['22,000', '19,250', '17,600']) assert.ok((await page.locator('.gt-package-grid').innerText()).includes(price));
  await page.getByRole('link', { name: 'Plan this trip' }).nth(2).click();
  await page.getByLabel('Full name', { exact: true }).fill('Browser Test');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Phone', { exact: true }).fill('+919876543210');
  await page.getByLabel('Travel date', { exact: true }).fill('2026-12-01');
  await page.getByRole('button', { name: 'Request a quote' }).click();
  await page.getByRole('status').waitFor();
  assert.equal(submitted.adults, 6);
  assert.equal(submitted.rooms, 3);
  assert.equal(submitted.budget, '105600');
  assert.equal(submitted.nights, 4);
  assert.equal(submitted.package_type, 'Delhi Agra Jaipur - Private Leisure Package');
  await mkdir('../output/release-fixes', { recursive: true });
  await page.screenshot({ path: '../output/release-fixes/golden-triangle-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/golden-triangle', { waitUntil: 'networkidle' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  assert.ok(await page.locator('.td-hero-image').evaluate(img => img.complete && img.naturalWidth > 0));
  await page.screenshot({ path: '../output/release-fixes/golden-triangle-mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, []);
  console.log('PASS: expired-session public browsing; trending link; six prices; five days; correct enquiry payload; desktop/mobile layout; no page or missing-asset errors. API writes mocked.');
} finally { await browser.close(); }
