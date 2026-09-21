import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({headless:true,channel:'msedge'});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const failures=[], errors=[];
page.on('pageerror', e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith('https://goimomi.com/')&&r.status()>=400)failures.push([r.status(),r.url()]);});
await page.addInitScript(()=>{localStorage.setItem('accessToken','expired-access-token');localStorage.setItem('refreshToken','expired-refresh-token');sessionStorage.setItem('generalEnquiryShown','true');});
await page.route('**/*',r=>{
  const request=r.request();
  if(request.url().startsWith('https://fonts.googleapis.com/')) return r.fulfill({status:200,contentType:'text/css',body:''});
  return ['GET','HEAD'].includes(request.method())&&/^https:\/\/(www\.)?goimomi\.com\//.test(request.url())?r.continue():r.abort();
});
try {
  const visas=page.waitForResponse(r=>r.url().includes('/api/visas/?is_popular=true'));
  await page.goto('https://goimomi.com/',{waitUntil:'domcontentloaded',timeout:60000});
  assert.equal((await visas).status(),200);
  await page.goto('https://goimomi.com/shop/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('.gp-card-title').first().waitFor();
  const img=page.locator('.gp-card-img-slider img').first();
  await img.scrollIntoViewIfNeeded();
  await img.evaluate(i=>i.decode());
  assert.ok((await img.getAttribute('src')).includes('/generated/20260921/zamzam.png'));
  assert.ok(await img.evaluate(i=>i.naturalWidth>0));
  await page.screenshot({path:'../output/release-fixes/live-shop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'../output/release-fixes/live-shop-mobile.png',fullPage:true});
  assert.deepEqual(failures,[]);
  assert.deepEqual(errors,[]);
  console.log('PASS live public APIs with expired session, generated product image, no HTTP or JavaScript errors. No writes sent.');
} catch(error) {console.log({failures,errors}); throw error;} finally {await browser.close();}
