import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = new URL(process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174');
const browser = await chromium.launch({ headless: true, channel: process.env.VERIFY_BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('dialog', async dialog => { errors.push(dialog.message()); await dialog.dismiss(); });
await page.addInitScript(() => {
  sessionStorage.setItem('generalEnquiryShown', 'true');
  localStorage.setItem('accessToken', 'e30.' + btoa(JSON.stringify({ exp: 9999999999, is_staff: true })) + '.test');
  localStorage.setItem('adminUser', JSON.stringify({ username: 'Review', is_staff: true }));
});
const countries = [{ id: 1, name: 'India' }, { id: 2, name: 'Japan' }];
let requests = 0;
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.pathname.startsWith('/api/')) {
    requests++;
    assert.equal(route.request().method(), 'GET', 'Smoke checks must not write data');
    let data = [];
    if (url.pathname === '/api/countries/') data = countries;
    if (url.pathname === '/api/visa-applications/') data = countries.map(country => ({ id: country.id, visa_country: country.name, visa_title: 'Fixture visa', status: 'Processing', applicants: [] }));
    if (/\/\d+\/$/.test(url.pathname)) data = { id: 1, name: 'Fixture record', country: 1, region: '', routes: [], column_vehicles: [], images: [], cruise_type: 'Fixture cruise', itinerary: 'Fixture itinerary' };
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  }
  if (url.origin === base.origin) return route.continue();
  return route.abort();
});

try {
  await page.goto(new URL('/cab', base).href, { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Cab/);
  assert.ok(await page.locator('input').count() > 0);

  for (const route of [
    'management-country/cities', 'management-country/countries', 'management-country/nationalities',
    'management-country/regions', 'cruise-calendar', 'driver-masters', 'sightseeing-masters',
    'vehicle-masters', 'vehicle-rate-cards',
  ]) {
    const before = requests;
    const url = new URL(`/admin/${route}/edit/1`, base).href;
    await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(page.url(), url, `Edit page redirected: ${route}`);
    assert.ok(await page.locator('input').count() > 0, `No edit controls: ${route}`);
    assert.ok(requests - before < 30, `Repeated loading requests: ${route}`);
  }

  await page.goto(new URL('/admin/visa-applications', base).href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('tbody tr').count(), 2);
  await page.locator('select').first().selectOption('Japan');
  await page.waitForFunction(() => document.querySelectorAll('tbody tr').length === 1);
  assert.match(await page.locator('tbody').innerText(), /Japan/);
  assert.doesNotMatch(await page.locator('tbody').innerText(), /India/);
  await page.locator('select').first().selectOption('');
  await page.waitForFunction(() => document.querySelectorAll('tbody tr').length === 2);
  assert.deepEqual(errors, []);
  console.log('Passed: cab rendering, nine admin edit pages, visa country filtering/reset, no runtime errors. All APIs mocked.');
} finally {
  await browser.close();
}
