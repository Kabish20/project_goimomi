import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
try {
  const page = await browser.newPage();
  await page.clock.install({ time: new Date('2026-09-19T12:00:00Z') });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem('generalEnquiryShown', 'true'));
  const enquiries = [];
  let failEnquiry = false;
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/holiday-form/' && route.request().method() === 'POST') {
        enquiries.push(route.request().postDataJSON());
        return route.fulfill({ status: failEnquiry ? 500 : 201, contentType: 'application/json', body: '{}' });
      }
      return route.fulfill({ contentType: 'application/json', body: '[]' });
    }
    return url.origin === new URL(base).origin ? route.continue() : route.abort();
  });
  await page.goto(`${base}/trendinginternationaldestination`, { waitUntil: 'networkidle' });
  const card = page.locator('.destination-disclosure-card').filter({ has: page.getByRole('button', { name: 'Dubai details', exact: true }) });
  assert.match(await card.textContent(), /₹25,330/);
  await card.hover();
  await card.getByRole('link', { name: 'Explore Dubai', exact: true }).click();
  await page.locator('#db-title').waitFor();
  assert.match(await page.title(), /4 Nights \/ 5 Days from ₹25,330/);
  assert.equal(await page.locator('.bl-day').count(), 5);
  assert.equal(await page.locator('#db-inclusions article').first().locator('li').count(), 10);
  assert.equal(await page.locator('#db-inclusions article').last().locator('li').count(), 8);
  for (const day of await page.locator('.bl-day').all()) {
    if (await day.getAttribute('open') === null) await day.locator('summary').click();
    assert.ok(await day.locator('.bl-day-body').isVisible());
  }
  await page.locator('.dubai-page img').evaluateAll(async images => {
    await Promise.all(images.map(async img => { img.loading = 'eager'; await img.decode(); }));
  });
  await fs.mkdir('../output/design/dubai', { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `Overflow at ${width}px`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    if (width === 390 || width === 1440) await page.screenshot({ path: `../output/design/dubai/page-${width}.png`, fullPage: true });
  }
  await page.locator('#db-name').fill('Dubai package verification');
  await page.locator('#db-phone').fill('9999999999');
  await page.locator('#db-email').fill('test@example.com');
  for (const date of ['2026-10-14', '2027-01-31']) {
    await page.locator('#db-date').fill(date);
    await page.getByRole('button', { name: 'Enquire about Dubai', exact: true }).click();
    assert.equal(enquiries.length, 0);
    assert.equal(await page.locator('#db-date').evaluate(input => input.validity.valid), false);
  }
  await page.locator('#db-date').fill('2026-11-15');
  failEnquiry = true;
  await page.getByRole('button', { name: 'Enquire about Dubai', exact: true }).click();
  await page.getByRole('alert').waitFor();
  failEnquiry = false;
  await page.getByRole('button', { name: 'Enquire about Dubai', exact: true }).click();
  await page.locator('.bl-success').waitFor();
  const enquiry = enquiries.at(-1);
  assert.equal(enquiry.nights, 4);
  assert.equal(enquiry.cities[0].destination, 'Dubai');
  assert.equal(enquiry.cities[0].nights, 4);
  assert.equal(enquiry.budget, '50660');
  assert.equal(enquiry.star_rating, '3');
  assert.equal(enquiry.adults, 2);
  assert.match(enquiry.message, /Citymax Bur Dubai/);
  assert.match(enquiry.message, /Currency: INR/);
  assert.match(enquiry.transfer_details, /SIC basis/);
  await page.clock.setFixedTime(new Date('2027-02-01T12:00:00Z'));
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('button', { name: 'Enquire about Dubai', exact: true }).isDisabled(), true);
  assert.deepEqual(errors, []);
  console.log('PASS: Dubai card/navigation, five days, all inclusions/exclusions, images, 320–1440px layouts, date validity, mocked enquiry failure/retry and INR payload, expired package.');
} finally { await browser.close(); }
