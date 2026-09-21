import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const browser = await chromium.launch({headless:true,channel:'msedge'});
const page = await browser.newPage({viewport:{width:1440,height:950}});
await page.goto(pathToFileURL(path.resolve('../output/imagegen/review.html')).href);
await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
const count = await page.locator('figure').count();
for(let i=0;i<count;i+=16){
  await page.locator('figure').evaluateAll((els,start)=>els.forEach((e,n)=>e.style.display=n>=start&&n<start+16?'block':'none'),i);
  await page.screenshot({path:`../output/imagegen/review-${i}.png`});
}
console.log('Reviewed image load:',count);
await browser.close();
