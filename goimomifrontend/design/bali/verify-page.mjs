import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174';
const output = fileURLToPath(new URL('../../../output/design/bali/', import.meta.url));
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
  await page.goto(base, { waitUntil: 'networkidle' });
  const card = page.locator('.international-trending-section .destination-disclosure-card').filter({ has: page.getByRole('button', { name: 'Bali details', exact: true }) });
  assert.equal(await page.locator('.international-trending-section .domestic-trending-card').count(), 2);
  assert.match(await card.textContent(), /24,570/);
  assert.match(await card.textContent(), /Per Person/);
  await card.locator('img').evaluate(async image => { image.loading = 'eager'; await image.decode(); });
  const size = await card.boundingBox();
  assert.equal(size.width, 280); assert.equal(size.height, 280);
  await card.hover();
  await page.waitForTimeout(600);
  await card.screenshot({ path: `${output}/bali-card.png` });
  await card.getByRole('link', { name: 'Explore Bali', exact: true }).click();
  await page.locator('#bl-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/bali');
  assert.match(await page.title(), /Bali Special Package/);
  assert.equal(await page.locator('.bl-day').count(), 5);
  await page.locator('.bl-day').nth(2).locator('summary').click();
  assert.match(await page.locator('.bl-day').nth(2).textContent(), /6:00 AM/);
  assert.match(await page.locator('.bl-day').nth(2).textContent(), /breakfast box/);
  assert.match(await page.locator('#bl-stay').textContent(), /49,140/);
  assert.match(await page.locator('#bl-inclusions').textContent(), /seafood dinner is not included/);
  await page.locator('#bl-name').fill('Preview Guest');
  await page.locator('#bl-phone').fill('9876543210');
  await page.locator('#bl-email').fill('preview@example.com');
  const futureDate = new Date(); futureDate.setDate(futureDate.getDate() + 30);
  const date = futureDate.toISOString().slice(0, 10);
  await page.locator('#bl-date').fill(date);
  await page.getByRole('button', { name: 'Enquire about Bali' }).click();
  await page.locator('.bl-error').waitFor();
  failSubmission = false;
  await page.getByRole('button', { name: 'Enquire about Bali' }).click();
  await page.locator('.bl-success').waitFor();
  assert.equal(submissions.length, 2);
  assert.equal(submissions[1].budget, '49140');
  assert.equal(submissions[1].adults, 2);
  assert.equal(submissions[1].holiday_type, 'International');
  assert.equal(submissions[1].travel_date, date);
  assert.match(submissions[1].meal_plan, /4 breakfasts \+ 1 lunch/);
  await page.getByRole('button', { name: 'Make another enquiry' }).click();
  await page.locator('.bali-page img').evaluateAll(async images => {
    await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `${output}/bali-desktop.png`, fullPage: true });
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(dimensions.scroll <= dimensions.viewport, `Overflow at ${width}px`);
    if (width === 390) await page.screenshot({ path: `${output}/bali-mobile-hero.png` });
  }
  assert.deepEqual(errors, []);
  console.log('PASS: square international card and navigation, five-day itinerary, price and meal details, mocked enquiry failure/retry/success and payload, image loading, SEO, and 320/390/768px responsive layouts. No real enquiries submitted.');
} finally { await browser.close(); }
