import { chromium } from 'file:///C:/Users/kabis/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright-core@1.61.1/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const base = 'http://localhost:5177';
const output = 'goimomifrontend/design/azerbaijan';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => sessionStorage.setItem('generalEnquiryShown', 'true'));
await page.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.hostname === 'localhost' || (url.hostname === 'cdn-icons-png.flaticon.com' && route.request().resourceType() === 'image')) return route.continue();
  return route.abort();
});
try {
  await page.goto(`${base}/trendinginternationaldestination`, { waitUntil: 'networkidle' });
  await page.locator('#td-search').fill('Baku');
  assert.equal(await page.locator('.td-card').count(), 1);
  assert.match(await page.locator('.td-card-footer').innerText(), /52,430[\s\S]*total for 2 adults/);
  await page.getByRole('link', { name: 'Explore Azerbaijan packages', exact: true }).click();
  await page.locator('#az-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/azerbaijan');
  await page.locator('.td-hero-image').evaluate(image => image.decode());
  await page.screenshot({ path: `${output}/desktop-top.png` });
  await page.screenshot({ path: `${output}/desktop-full.png`, fullPage: true });
  assert.equal(await page.locator('.az-day').count(), 5);
  await page.locator('.az-day summary').nth(1).click();
  assert.equal(await page.locator('.az-day').nth(1).locator('.az-attractions li').count(), 8);
  assert.match(await page.locator('.az-day').nth(1).innerText(), /exterior visit/);
  assert.equal(await page.locator('.az-inclusions-grid article').first().locator('li').count(), 17);
  assert.equal(await page.locator('.az-inclusions-grid article').nth(1).locator('li').count(), 9);
  assert.equal(await page.locator('.az-important li').count(), 8);
  await page.getByRole('button', { name: 'Select 4-star option' }).click();
  assert.equal(await page.locator('#az-hotel').inputValue(), '1');
  assert.match(await page.locator('.az-selection').innerText(), /Parkside Hotel[\s\S]*63,700 total for 2 adults/);
  await page.locator('#az-name').fill('Preview Test');
  await page.locator('#az-phone').fill('+919876543210');
  await page.locator('#az-email').fill('preview@example.com');
  await page.locator('#az-date').fill('2027-06-15');
  let payload;
  let fail = true;
  await page.route('**/api/holiday-form/', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: fail ? 500 : 201, contentType: 'application/json', body: fail ? '{"detail":"Simulated failure"}' : '{"id":0}' });
  });
  await page.getByRole('button', { name: 'Enquire about Azerbaijan', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('#az-name').inputValue(), 'Preview Test');
  fail = false;
  await page.getByRole('button', { name: 'Enquire about Azerbaijan', exact: true }).click();
  await page.locator('.az-success').waitFor();
  assert.equal(payload.budget, '63700');
  assert.equal(payload.adults, 2);
  assert.equal(payload.rooms, 1);
  assert.equal(payload.nights, 4);
  assert.equal(payload.star_rating, '4');
  assert.match(payload.message, /total package price INR 63700 for 2 adults together/i);
  await page.getByRole('button', { name: 'Make another enquiry' }).click();
  await page.locator('#az-hotel').selectOption('0');
  await page.getByRole('button', { name: 'Enquire about Azerbaijan', exact: true }).click();
  await page.locator('.az-success').waitFor();
  assert.equal(payload.budget, '52430');
  assert.equal(payload.star_rating, '3');
  assert.match(payload.message, /Metro City Hotel/);
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/azerbaijan`, { waitUntil: 'networkidle' });
    await page.locator('.td-hero-image').evaluate(image => image.decode());
    const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(size.scroll <= size.viewport, `Horizontal overflow at ${width}`);
    if (width === 390) {
      await page.screenshot({ path: `${output}/mobile-top.png` });
      await page.screenshot({ path: `${output}/mobile-full.png`, fullPage: true });
    }
  }
  await page.goto(`${base}/trendingdomesticdestination`, { waitUntil: 'networkidle' });
  assert.match(await page.locator('.td-card').filter({ has: page.getByRole('heading', { name: 'Kashmir', exact: true }) }).locator('.td-card-footer').innerText(), /per person/);
  assert.deepEqual(errors, []);
  const report = { passed: true, checks: ['Azerbaijan discoverable by Baku search and card opens page', 'Total-for-two card price and unchanged Kashmir per-person label', 'Five days, eight city attractions, 17 inclusions, nine exclusions, eight important notes', 'Hotel selection updates both the total and enquiry', 'Mocked failed request retains input', 'Both hotel enquiry payloads have correct total, adults, rooms, nights and category', 'No page overflow at 320px, 390px or 768px', 'No browser JavaScript errors'], note: 'No live enquiries submitted; API success and error responses were mocked.' };
  await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
