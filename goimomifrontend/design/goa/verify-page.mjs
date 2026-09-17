import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174';
const output = fileURLToPath(new URL('../../../output/design/goa/', import.meta.url));
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.VERIFY_BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
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
  const section = page.locator('.domestic-trending-section').filter({ has: page.locator('#domestic-trending-title') });
  const card = section.locator('article:not([aria-hidden="true"])').filter({ has: page.getByRole('heading', { name: 'Goa', exact: true }) });
  await card.waitFor();
  assert.equal(await card.count(), 1);
  assert.match(await card.innerText(), /triple sharing/);
  assert.equal(await card.getByRole('link').getAttribute('href'), '/goa');
  await card.locator('img').evaluate(image => image.decode());
  await card.getByRole('link').click();
  await page.locator('#ga-title').waitFor();
  assert.equal(new URL(page.url()).pathname, '/goa');
  assert.match(await page.title(), /Goa.*Triple Sharing/);
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /minimum of 6 adults/);
  assert.equal(await page.locator('.ga-hotel').count(), 3);
  assert.equal(await page.locator('.ga-day').count(), 4);
  assert.equal(await page.locator('.ga-inclusion-grid article').first().locator('li').count(), 9);
  assert.equal(await page.locator('.ga-inclusion-grid article').nth(1).locator('li').count(), 4);
  assert.match(await page.locator('#ga-hotels').innerText(), /minimum of 6 adults/);
  assert.doesNotMatch(await page.locator('#ga-hotels').innerText(), /GST|twin sharing/);
  assert.doesNotMatch(await page.locator('#ga-enquire').innerText(), /GST|twin sharing/);
  for (const index of [1, 2]) {
    await page.locator('.ga-day summary').nth(index).click();
    assert.match(await page.locator('.ga-day').nth(index).innerText(), /10:00 AM.*6:00 PM/);
  }
  assert.equal(await page.locator('.ga-day').nth(1).locator('.ga-tags li').count(), 6);
  assert.equal(await page.locator('.ga-day').nth(2).locator('.ga-tags li').count(), 11);
  assert.match(await page.locator('.ga-day').nth(2).innerText(), /lunch and all entry tickets are payable separately/i);

  let payload;
  let fail = true;
  let submissions = 0;
  await page.route('**/api/holiday-form/', async route => {
    submissions += 1;
    payload = route.request().postDataJSON();
    await route.fulfill({ status: fail ? 500 : 201, contentType: 'application/json', body: fail ? '{"detail":"Simulated failure"}' : '{"id":0}' });
  });
  await page.locator('#ga-name').fill('Preview Test');
  await page.locator('#ga-email').fill('preview@example.com');
  await page.locator('#ga-phone').fill('123');
  await page.getByRole('button', { name: 'Enquire about Goa', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(submissions, 0);
  await page.locator('#ga-phone').fill('+919876543210');
  await page.getByRole('button', { name: 'Enquire about Goa', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'could not be sent' }).waitFor();
  assert.equal(await page.locator('#ga-name').inputValue(), 'Preview Test');
  fail = false;
  for (const [index, name, rate, total] of [[0, 'Zone Connect by The Park Parra', 9400, 56400], [1, 'Vilmaris Breeze Hotel', 9400, 56400], [2, 'Bells Beach Resort', 9700, 58200]]) {
    if (index === 1) await page.locator('#ga-hotel').selectOption(String(index));
    else await page.locator('.ga-hotel button').nth(index).click();
    assert.equal(await page.locator('#ga-hotel').inputValue(), String(index));
    assert.equal(await page.locator('.ga-hotel button').nth(index).getAttribute('aria-pressed'), 'true');
    assert.ok((await page.locator('.ga-selection').innerText()).includes(name));
    assert.match(await page.locator('.ga-price').nth(index).innerText(), new RegExp(rate.toLocaleString('en-IN')));
    assert.match(await page.locator('.ga-selection').innerText(), /per adult.*triple sharing/);
    assert.match(await page.locator('.ga-enquiry-summary').innerText(), new RegExp(total.toLocaleString('en-IN')));
    await page.getByRole('button', { name: 'Enquire about Goa', exact: true }).click();
    await page.locator('.ga-success').waitFor();
    assert.equal(payload.budget, String(total));
    assert.equal(payload.adults, 6);
    assert.equal(payload.rooms, 2);
    assert.equal(payload.nights, 3);
    assert.equal(payload.travel_date, '2026-10-01');
    assert.equal(payload.room_type, 'Triple sharing; 2 rooms for 6 adults');
    assert.deepEqual(payload.room_details, [{ adults: 3, children: 0, child_ages: [] }, { adults: 3, children: 0, child_ages: [] }]);
    assert.deepEqual(payload.cities, [{ destination: 'Goa', nights: 3 }]);
    assert.ok(payload.message.includes(name));
    assert.ok(payload.message.includes(`INR ${rate} per adult on triple sharing`));
    assert.match(payload.message, /minimum of 6 adults/);
    assert.match(payload.message, /All taxes included/);
    assert.equal(payload.meal_plan, 'Breakfast only; lunch and dinner excluded');
    assert.ok(payload.transfer_details.length <= 100);
    await page.getByRole('button', { name: 'Make another enquiry' }).click();
  }
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/goa`, { waitUntil: 'networkidle' });
    await page.locator('.goa-page img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'Page overflow at ' + width);
    if ([1440, 390].includes(width)) {
      await page.locator('.ga-hero').screenshot({ path: `${output}/hero-${width}.png`, style: 'header { visibility: hidden !important; }' });
      await page.locator('#ga-hotels').screenshot({ path: `${output}/hotels-${width}.png`, style: 'header { visibility: hidden !important; }' });
    }
  }
  assert.deepEqual(errors, []);
  const report = { passed: true, checks: ['Goa domestic card opens /goa', 'Three hotel choices and four itinerary days', 'North Goa six attractions and South Goa eleven stops', 'Per-adult triple-sharing rates 9400, 9400, 9700; group totals 56400, 56400, 58200', 'Six adults in two triple-sharing rooms and minimum group condition', 'Taxes included; breakfast only; sightseeing lunches and entry tickets excluded', 'Both card buttons and hotel dropdown update selections', 'All three enquiry payloads correct; invalid phone blocked; failure preserves inputs', 'Images load and no overflow at 320, 390, 768 and 1440px', 'No runtime errors'], note: 'API requests mocked. No live enquiries submitted. Year assumed as 2026 pending user clarification.' };
  await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
