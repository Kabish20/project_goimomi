import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, channel: process.env.VERIFY_BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const base = process.env.VERIFY_BASE_URL || 'http://localhost:5174';
const output = fileURLToPath(new URL('../../../output/design/manali/', import.meta.url));
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
try {
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.destination-disclosure-card').filter({ has: page.getByRole('button', { name: 'Manali details', exact: true }) }).first().hover();
  await page.getByRole('link', { name: 'Explore Manali', exact: true }).click();
  await page.locator('#ml-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/manali');
  await page.locator('.manali-page img').evaluateAll(async images => { await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); })); });
  await page.screenshot({ path: `${output}/desktop-top.png` });
  await page.screenshot({ path: `${output}/desktop-full.png`, fullPage: true });
  assert.equal(await page.locator('.ml-day').count(), 4);
  assert.equal(await page.locator('.ml-stay').count(), 3);
  assert.equal(await page.locator('.ml-tax').count(), 0);
  assert.doesNotMatch(await page.locator('.manali-page').innerText(), /GST/i);
  assert.doesNotMatch(await page.locator('meta[name="description"]').getAttribute('content'), /GST/i);
  for (const [index, price] of [23500, 25000, 29500].entries()) {
    const formattedPrice = (price / 2).toLocaleString('en-IN');
    assert.match(await page.locator('.ml-price').nth(index).innerText(), new RegExp(formattedPrice));
    assert.match(await page.locator('.ml-price').nth(index).innerText(), /per adult.*twin sharing/);
    assert.match(await page.locator('#ml-stay option').nth(index).innerText(), new RegExp(formattedPrice));
  }
  assert.equal(await page.locator('.ml-inclusion-grid article').first().locator('li').count(), 15);
  assert.equal(await page.locator('.ml-inclusion-grid article').nth(1).locator('li').count(), 13);
  await page.locator('.ml-day summary').nth(2).click();
  assert.match(await page.locator('.ml-day').nth(2).innerText(), /local government conditions/);
  await page.locator('#ml-name').fill('Preview Test');
  await page.locator('#ml-phone').fill('+919876543210');
  await page.locator('#ml-email').fill('preview@example.com');
  let payload;
  let fail = true;
  await page.route('**/api/holiday-form/', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: fail ? 500 : 201, contentType: 'application/json', body: fail ? '{"detail":"Simulated failure"}' : '{"id":0}' });
  });
  await page.getByRole('button', { name: 'Enquire about Manali', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('#ml-name').inputValue(), 'Preview Test');
  fail = false;
  for (const [index, price, room] of [[0,23500,'Deluxe Room'],[1,25000,'Deluxe Room'],[2,29500,'Super Deluxe Room']]) {
    await page.locator('.ml-stay button').nth(index).click();
    assert.equal(await page.locator('#ml-stay').inputValue(), String(index));
    assert.match(await page.locator('.ml-enquiry-summary').innerText(), new RegExp((price / 2).toLocaleString('en-IN')));
    assert.match(await page.locator('.ml-enquiry-summary').innerText(), new RegExp(price.toLocaleString('en-IN')));
    await page.getByRole('button', { name: 'Enquire about Manali', exact: true }).click();
    await page.locator('.ml-success').waitFor();
    assert.equal(payload.budget, String(price));
    assert.equal(payload.room_type, room);
    assert.equal(payload.adults, 2);
    assert.equal(payload.rooms, 1);
    assert.equal(payload.nights, 3);
    assert.equal(payload.travel_date, '2026-11-26');
    assert.equal(payload.meal_plan, '3 breakfasts and 3 dinners');
    assert.ok(payload.message.includes(`Price for 2 adults together: INR ${price}.`));
    assert.ok(payload.message.includes(`Price per adult on twin sharing: INR ${price / 2}.`));
    assert.doesNotMatch(payload.message, /GST/i);
    await page.getByRole('button', { name: 'Make another enquiry' }).click();
  }
  for (const width of [390,320,768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/manali`, { waitUntil: 'networkidle' });
    await page.locator('.manali-page img').evaluateAll(async images => { await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); })); });
    const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(size.scroll <= size.viewport, `Horizontal overflow at ${width}px`);
    if (width === 390) {
      await page.screenshot({ path: `${output}/mobile-top.png` });
      await page.screenshot({ path: `${output}/mobile-full.png`, fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  const report = { passed: true, checks: ['Homepage domestic card opens Manali', '4 dated itinerary days, 3 stay options, 15 inclusions and 13 exclusions', 'Weather/access conditions visible in itinerary', 'Per-adult prices 11750, 12500 and 14750 displayed on a twin-sharing basis', 'No GST labels, breakdown or SEO copy', 'Enquiry retains the two-adult package total and records the per-adult rate', 'Simulated failure preserves form inputs', 'No overflow at 320px, 390px and 768px', 'No browser runtime errors'], note: 'API responses mocked; no real enquiries sent.' };
  await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
