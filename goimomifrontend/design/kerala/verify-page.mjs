import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { packages } from '../../src/pages/Holidays/Kerala/keralaData.js';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174';
const output = fileURLToPath(new URL('../../../output/design/kerala/', import.meta.url));
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const submissions = [];
let failSubmission = true;
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => sessionStorage.setItem('generalEnquiryShown', 'true'));
await page.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.pathname === '/api/holiday-form/' && route.request().method() === 'POST') {
    submissions.push(route.request().postDataJSON());
    return route.fulfill({ status: failSubmission ? 500 : 201, contentType: 'application/json', body: '{}' });
  }
  if (url.pathname.startsWith('/api/')) return route.fulfill({ contentType: 'application/json', body: '[]' });
  return url.origin === new URL(base).origin ? route.continue() : route.abort();
});
try {
  await page.goto(`${base}/kerala`, { waitUntil: 'networkidle' });
  await page.locator('#kl-title').waitFor();
  assert.match(await page.title(), /Kerala Holiday Packages/);
  await page.locator('.kl-hero img').evaluate(image => image.decode());
  for (let packageIndex = 0; packageIndex < packages.length; packageIndex++) {
    await page.locator('#kl-package').selectOption(String(packageIndex));
    const option = packages[packageIndex];
    assert.equal(await page.locator('.kl-day').count(), option.nights + 1);
    for (let rateIndex = 0; rateIndex < option.rates.length; rateIndex++) {
      await page.locator('#kl-group').selectOption(String(rateIndex));
      for (let categoryIndex = 0; categoryIndex < option.categories.length; categoryIndex++) {
        await page.locator('#kl-category').selectOption(String(categoryIndex));
        assert.ok((await page.locator('.kl-rate-result>strong').textContent()).includes(option.rates[rateIndex].prices[categoryIndex].toLocaleString('en-IN')));
      }
    }
  }
  await page.locator('#kl-category').selectOption('0');
  await page.locator('#kl-name').fill('Preview Guest');
  await page.locator('#kl-phone').fill('9876543210');
  await page.locator('#kl-email').fill('preview@example.com');
  await page.locator('#kl-date').fill('2026-11-18');
  await page.getByRole('button', { name: 'Enquire about Kerala' }).click();
  await page.locator('.kl-error').waitFor();
  failSubmission = false;
  await page.getByRole('button', { name: 'Enquire about Kerala' }).click();
  await page.locator('.kl-success').waitFor();
  assert.equal(submissions.length, 2);
  assert.equal(submissions[1].budget, '9700');
  assert.equal(submissions[1].adults, 6);
  assert.equal(submissions[1].transfer_details, 'Crysta');
  assert.equal(submissions[1].travel_date, '2026-11-18');
  await page.getByRole('button', { name: 'Make another enquiry' }).click();
  await page.locator('#kl-package').selectOption('0');
  assert.equal(await page.locator('#kl-group').inputValue(), '0');
  assert.equal(await page.locator('#kl-category').inputValue(), '0');
  await page.locator('.kerala-page img').evaluateAll(async images => {
    await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `${output}/kerala-desktop.png`, fullPage: true });
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const option of ['0', '1']) {
      await page.locator('#kl-package').selectOption(option);
      const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(size.scroll <= size.viewport, `${width}px package ${option} overflows`);
    }
    if (width === 390) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `${output}/kerala-mobile.png`, fullPage: true });
      await page.screenshot({ path: `${output}/kerala-mobile-hero.png` });
    }
  }
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.domestic-trending-track{animation:none!important}' });
  const card = page.locator('.domestic-trending-card').filter({ has: page.getByRole('button', { name: 'Kerala details', exact: true }) }).first();
  assert.equal((await card.locator('.destination-card-price small').textContent()).toLowerCase(), 'per person');
  assert.match(await card.locator('.destination-card-price strong').textContent(), /9,700/);
  await card.hover();
  await card.getByRole('link', { name: 'Explore Kerala' }).click();
  await page.locator('#kl-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/kerala');
  assert.deepEqual(errors, []);
  console.log('PASS: both itineraries, all 18 package rates, selection reset, mocked enquiry error/retry/success and payload, domestic card navigation, image loading, SEO and 320/390/768px layouts. No real enquiries sent.');
} finally { await browser.close(); }
