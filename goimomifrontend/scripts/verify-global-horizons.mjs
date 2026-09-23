import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5174';
const output = fileURLToPath(new URL('../../output/global-horizons/', import.meta.url));
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.VERIFY_BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const photo = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
let profile = {
  id: 1, full_name: 'Sample Participant', city: 'Chennai', country: 'India', profession: 'Entrepreneur',
  attending_poster: '/media/example-attending.pdf', profile_booklet: '/media/example-profile.pdf',
  attending_poster_image: '/media/example-attending.png',
  organization: 'Sample Textiles', years_of_experience: 12, interests: 'Sustainable textiles',
  website: 'linkedin.com/in/example', email: 'participant@example.com', connections_sought: 'Meet distributors in Colombo',
  photo: `data:image/png;base64,${photo.toString('base64')}`, created_at: '2026-09-22T10:00:00Z',
  ticket_status: 'booked', arrival_date: '2026-10-22', arrival_flight_no: 'UL 122', arrival_time: '12:30',
  return_date: '2026-10-24', return_flight_no: 'UL 123', return_time: '18:45',
};
let failSubmission = true;
let submissions = 0;
let edits = 0;
let deletions = 0;
await page.route('**/*', async route => {
  const request = route.request();
  const url = new URL(request.url());
  if (url.pathname === '/media/example-profile.pdf') return route.fulfill({ contentType: 'application/pdf', body: '%PDF-1.4 test booklet fixture' });
  if (url.pathname === '/media/example-attending.png') {
    const preview = await fs.readFile(fileURLToPath(new URL('../../output/pdf/attending-poster-social.png', import.meta.url))).catch(() => photo);
    return route.fulfill({ contentType: 'image/png', body: preview });
  }
  if (url.pathname.startsWith('/api/global-horizons-srilanka/')) {
    if (url.pathname.endsWith('/export/')) {
      assert.match(request.headers().authorization, /^Bearer /);
      assert.equal(url.searchParams.get('search'), 'textiles');
      return route.fulfill({ contentType: 'application/octet-stream', body: 'export download fixture' });
    }
    if (request.method() === 'POST') {
      submissions++;
      assert.equal(request.headers().authorization, undefined);
      assert.match(request.headers()['content-type'], /multipart\/form-data; boundary=/);
      const body = request.postDataBuffer().toString();
      for (const name of ['ticket_status', 'arrival_date', 'arrival_flight_no', 'arrival_time', 'return_date', 'return_flight_no', 'return_time']) {
        assert.ok(body.includes(`name="${name}"`));
        assert.ok(body.includes(profile[name]));
      }
      for (const field of ['full_name', 'city', 'country', 'profession', 'photo', 'logo', 'organization', 'years_of_experience', 'interests', 'website', 'email', 'connections_sought']) {
        assert.ok(body.includes(`name="${field}"`), `Missing multipart field ${field}`);
      }
      if (failSubmission) return route.fulfill({ status: 400, json: { email: ['Please check your email address.'] } });
      return route.fulfill({ status: 201, json: profile });
    }
    assert.match(request.headers().authorization, /^Bearer /);
    if (request.method() === 'DELETE') {
      deletions++;
      assert.equal(url.pathname, `/api/global-horizons-srilanka/${profile.id}/`);
      return route.fulfill({ status: 204 });
    }
    if (request.method() === 'PATCH') {
      edits++;
      assert.ok(!request.postDataBuffer().toString().includes('name="photo"'));
      profile = { ...profile, city: 'Colombo' };
      return route.fulfill({ json: profile });
    }
    return route.fulfill({ json: [profile] });
  }
  if (url.pathname.startsWith('/api/')) return route.fulfill({ json: [] });
  return url.origin === new URL(base).origin || url.protocol === 'data:' ? route.continue() : route.abort();
});

try {
  await page.goto(`${base}/global-horizons-srilanka`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Participant Profile Request' }).waitFor();
  assert.equal(await page.title(), 'Global Horizons Sri Lanka | Participant Profile | Goimomi');
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `${base}/globalhorizonssrilanka/`);
  assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'), /sri-lanka-business-journey.jpg$/);
  for (const route of ['/globalhorizonssrilanka/', '/global-horizons-srilanka/']) {
    const html = await page.evaluate(async url => (await fetch(url)).text(), base + route);
    assert.ok(html.includes('<title>Global Horizons Sri Lanka | Participant Profile | Goimomi</title>'));
    assert.ok(html.includes('https://goimomi.com/globalhorizonssrilanka/'));
  }
  const sitemap = await page.evaluate(async url => (await fetch(url)).text(), base + '/sitemap.xml');
  assert.equal(sitemap.split('<loc>https://goimomi.com/globalhorizonssrilanka/</loc>').length - 1, 1);
  // The general enquiry popup must not interrupt the profile form.
  assert.equal(await page.evaluate(() => sessionStorage.getItem('generalEnquiryShown')), null);
  for (const name of ['full_name', 'city', 'country', 'profession', 'organization', 'years_of_experience', 'interests', 'website', 'email', 'connections_sought']) {
    await page.locator(`[name="${name}"]`).fill(String(profile[name]));
  }
  await page.locator('#gh-photo').setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: photo });
  await page.getByAltText('Participant photo preview').waitFor();
  await page.locator('#gh-logo').setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: photo });
  await page.getByAltText('Organization logo preview').waitFor();
  assert.equal(await page.locator('#gh-arrival_date').count(), 0);
  await page.getByRole('radio', { name: 'Booked', exact: true }).check();
  for (const name of ['arrival_date', 'arrival_flight_no', 'arrival_time', 'return_date', 'return_flight_no', 'return_time']) {
    await page.locator(`[name="${name}"]`).fill(profile[name]);
    assert.equal(await page.locator(`[name="${name}"]`).getAttribute('required'), '');
  }
  await page.getByRole('radio', { name: 'Not Booked', exact: true }).check();
  assert.equal(await page.locator('#gh-arrival_date').count(), 0);
  await page.getByRole('radio', { name: 'Booked', exact: true }).check();
  await page.screenshot({ path: `${output}/participant-desktop.png`, fullPage: true });
  await page.getByRole('button', { name: 'Submit profile' }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('[name="full_name"]').inputValue(), profile.full_name);
  failSubmission = false;
  await page.getByRole('button', { name: 'Submit profile' }).click();
  await page.getByRole('heading', { name: 'Thank you for sharing your profile' }).waitFor();
  assert.equal(submissions, 2);
  assert.equal(await page.getByRole('link', { name: 'Download attending poster (PDF)' }).getAttribute('href'), profile.attending_poster);
  assert.equal(await page.getByRole('link', { name: 'Download profile booklet (PDF)' }).getAttribute('href'), profile.profile_booklet);
  assert.equal(await page.getByRole('link', { name: 'Download social poster (PNG)' }).getAttribute('href'), profile.attending_poster_image);
  await page.getByAltText("I'm attending poster for Sample Participant").waitFor();
  await page.waitForFunction(() => window.scrollY === 0);
  await page.screenshot({ path: `${output}/participant-downloads.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Download cards overflow on mobile');
  await page.screenshot({ path: `${output}/participant-downloads-mobile.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#gh-photo').waitFor();
  await page.getByRole('radio', { name: 'Booked', exact: true }).check();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile horizontal overflow');
  await page.screenshot({ path: `${output}/participant-mobile.png`, fullPage: true });

  const token = `e30.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, is_staff: true })).toString('base64url')}.test`;
  await page.evaluate(token => localStorage.setItem('accessToken', token), token);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(`${base}/admin/global-horizons-srilanka`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'View profile for Sample Participant' }).waitFor();
  for (const [kind, path, filename] of [
    ['social poster', profile.attending_poster_image, 'global-horizons-1-social-poster.png'],
    ['booklet', profile.profile_booklet, 'global-horizons-1-booklet.pdf'],
  ]) {
    const link = page.getByRole('link', { name: `Download ${kind} for Sample Participant`, exact: true });
    assert.equal(await link.getAttribute('href'), path);
    const downloaded = page.waitForEvent('download');
    await link.click();
    assert.equal((await downloaded).suggestedFilename(), filename);
  }
  await page.screenshot({ path: `${output}/admin-profiles.png`, fullPage: true });
  await page.getByLabel('Search profiles').fill('unmatched');
  await page.getByText('No profiles match your search.').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Download Excel' }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Download PDF' }).isDisabled(), true);
  await page.getByLabel('Search profiles').fill('textiles');
  for (const [label, extension] of [['Download Excel', 'xlsx'], ['Download PDF', 'pdf'], ['Download participant booklet', 'pdf']]) {
    const downloaded = page.waitForEvent('download');
    await page.getByRole('button', { name: label }).click();
    const file = await downloaded;
    assert.ok(file.suggestedFilename().endsWith(`.${extension}`));
    assert.equal(await file.failure(), null);
  }
  await page.getByRole('button', { name: 'View profile for Sample Participant' }).click();
  await page.getByText('Meet distributors in Colombo', { exact: true }).waitFor();
  await page.getByText('UL 122', { exact: true }).waitFor();
  await page.getByText('UL 123', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  assert.equal(await page.locator('#gh-arrival_date').inputValue(), '2026-10-22');
  await page.locator('[name="city"]').fill('Colombo');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByText('Profile saved successfully.').waitFor();
  await page.getByText('Colombo, India', { exact: true }).waitFor();
  assert.equal(edits, 1);
  await page.getByRole('button', { name: 'Add profile', exact: true }).click();
  assert.equal(await page.locator('[name="full_name"]').inputValue(), '');
  assert.equal(await page.locator('#gh-photo').getAttribute('required'), '');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'View profile for Sample Participant' }).waitFor();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete profile for Sample Participant' }).click();
  await page.getByText('Profile for "Sample Participant" deleted successfully.').waitFor();
  assert.equal(deletions, 1);
  assert.equal(await page.getByRole('button', { name: 'View profile for Sample Participant' }).count(), 0);
  assert.deepEqual(errors, []);
  console.log('Global Horizons browser checks passed: upload, retry, submission, mobile layout, admin search, detail, edit, add, cancel and delete.');
} finally {
  await browser.close();
}
