import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174';
const output = fileURLToPath(new URL('../../../output/design/north-east/', import.meta.url));
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.VERIFY_BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => sessionStorage.setItem('generalEnquiryShown', 'true'));
await page.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  return url.origin === new URL(base).origin ? route.continue() : route.abort();
});

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  const domestic = page.locator('.domestic-trending-section').filter({ has: page.locator('#domestic-trending-title') });
  const originalCards = domestic.locator('article:not([aria-hidden="true"])');
  const card = originalCards.filter({ has: page.getByRole('heading', { name: 'Sikkim', exact: true }) });
  assert.equal(await card.count(), 1);
  assert.match(await card.innerText(), /Assam & Meghalaya/i);
  assert.equal(await card.getByRole('link').getAttribute('href'), '/sikkim');
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await domestic.scrollIntoViewIfNeeded();
    const sizes = await originalCards.evaluateAll(cards => cards.map(card => ({ width: card.clientWidth, scroll: card.scrollWidth })));
    assert.ok(sizes.every(size => size.width <= 280 && size.scroll <= size.width), 'Compact card sizing at ' + width);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await card.getByRole('link').click();
  await page.locator('#ne-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/sikkim');
  assert.match(await page.title(), /North East.*Assam & Meghalaya/);
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /40,000 per adult on twin sharing/);
  assert.equal(await page.locator('.ne-day').count(), 7);
  assert.equal(await page.locator('.ne-package').count(), 3);
  assert.equal(await page.locator('.ne-hotels li').count(), 12);
  assert.equal(await page.locator('.ne-pending').count(), 2);
  assert.equal(await page.locator('.ne-inclusion-grid article').first().locator('li').count(), 6);
  assert.equal(await page.locator('.ne-inclusion-grid article').nth(1).locator('li').count(), 25);
  assert.equal(await page.locator('.ne-information li').count(), 8);
  assert.equal(await page.locator('.ne-hotels').filter({ hasText: 'Vegetarian hotel' }).count(), 2);
  assert.doesNotMatch(await page.locator('.north-east-page').innerText(), /GST|Gangtok|Nathula/i);
  await page.locator('.ne-day summary').nth(2).click();
  assert.match(await page.locator('.ne-day').nth(2).innerText(), /Safari charges are extra/);
  await page.locator('.ne-day summary').nth(5).click();
  assert.match(await page.locator('.ne-day').nth(5).innerText(), /Programme pending confirmation/);

  let payload;
  let fail = true;
  let submissions = 0;
  await page.route('**/api/holiday-form/', async route => {
    payload = route.request().postDataJSON();
    submissions += 1;
    await route.fulfill({ status: fail ? 500 : 201, contentType: 'application/json', body: fail ? '{"detail":"Simulated error"}' : '{"id":0}' });
  });
  await page.locator('#ne-name').fill('Preview Test');
  await page.locator('#ne-phone').fill('123');
  await page.locator('#ne-email').fill('preview@example.com');
  await page.getByRole('button', { name: 'Enquire about North East', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(submissions, 0);
  await page.locator('#ne-phone').fill('+919876543210');
  await page.getByRole('button', { name: 'Enquire about North East', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'could not be sent' }).waitFor();
  assert.equal(await page.locator('#ne-name').inputValue(), 'Preview Test');
  fail = false;
  for (const [index, rate, total] of [[0, 40000, 160000], [1, 51000, 204000], [2, 58725, 234900]]) {
    if (index === 1) await page.locator('#ne-package').selectOption(String(index));
    else await page.locator('.ne-package button').nth(index).click();
    assert.equal(await page.locator('#ne-package').inputValue(), String(index));
    assert.equal(await page.locator('.ne-package button').nth(index).getAttribute('aria-pressed'), 'true');
    assert.match(await page.locator('.ne-price').nth(index).innerText(), new RegExp(rate.toLocaleString('en-IN')));
    assert.match(await page.locator('.ne-selection').innerText(), new RegExp(rate.toLocaleString('en-IN')));
    assert.match(await page.locator('.ne-selection').innerText(), /per adult.*twin sharing/);
    assert.match(await page.locator('.ne-enquiry-summary').innerText(), new RegExp(total.toLocaleString('en-IN')));
    await page.getByRole('button', { name: 'Enquire about North East', exact: true }).click();
    await page.locator('.ne-success').waitFor();
    assert.equal(payload.budget, String(total));
    assert.equal(payload.adults, 4);
    assert.equal(payload.rooms, 2);
    assert.equal(payload.nights, 6);
    assert.equal(payload.travel_date, '2026-11-08');
    assert.equal(payload.holiday_type, 'Domestic');
    assert.deepEqual(payload.room_details, [{ adults: 2, children: 0, child_ages: [] }, { adults: 2, children: 0, child_ages: [] }]);
    assert.deepEqual(payload.cities, [{ destination: 'Guwahati', nights: 1 }, { destination: 'Kaziranga', nights: 1 }, { destination: 'Shillong', nights: 2 }, { destination: 'Cherrapunji', nights: 2 }]);
    assert.ok(payload.message.includes(`INR ${rate} per adult on twin sharing`));
    assert.match(payload.message, /Day 6 sightseeing and Day 7 departure pickup city await/);
    assert.ok(payload.transfer_details.length <= 100);
    await page.getByRole('button', { name: 'Make another enquiry' }).click();
  }

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/sikkim`, { waitUntil: 'networkidle' });
    await page.locator('.north-east-page img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    assert.ok(dimensions.scroll <= dimensions.client, 'Page overflow at ' + width);
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `${output}/page-${width}.png`, fullPage: true });
      await page.locator('#ne-packages').screenshot({ path: `${output}/packages-${width}.png`, style: 'header { visibility: hidden !important; }' });
    }
  }
  assert.deepEqual(errors, []);
  const report = { passed: true, checks: ['Compact domestic cards, North East card opens /sikkim', 'Accurate Assam & Meghalaya identity, route and SEO', 'Three per-adult rates, correct four-adult totals and 12 hotel stops', 'Seven itinerary slots; Days 6 and 7 explicitly pending user corrections', 'Six inclusions, 25 exclusions and vegetarian hotel notes', 'Package selection and all three enquiry payloads', 'Invalid phone blocked; failed submission preserves input', 'All images load; no overflow at 320, 390, 768 or 1440px', 'No runtime errors'], note: 'All API requests mocked; no live enquiries submitted.' };
  await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
