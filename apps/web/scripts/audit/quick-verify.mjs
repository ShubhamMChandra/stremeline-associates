import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const pages = [
    { url: 'http://localhost:3001', name: 'Homepage' },
    { url: 'http://localhost:3001/services', name: 'Services' },
    { url: 'http://localhost:3001/case-studies', name: 'Case Studies' }
  ];
  
  for (const p of pages) {
    await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const measurements = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3');
      return JSON.stringify(Array.from(headings).map(h => ({
        tag: h.tagName,
        text: h.textContent?.slice(0, 40),
        fontSize: getComputedStyle(h).fontSize
      })), null, 2);
    });
    
    console.log(`\n${p.name}:`);
    console.log(measurements);
    
    const data = JSON.parse(measurements);
    
    // Quick checks
    const h1s = data.filter(h => h.tag === 'H1');
    const h2s = data.filter(h => h.tag === 'H2');
    const h3s = data.filter(h => h.tag === 'H3');
    
    const h1Fail = h1s.filter(h => parseFloat(h.fontSize) < 48);
    const h2Fail = h2s.filter(h => parseFloat(h.fontSize) < 36);
    const h3Sizes = [...new Set(h3s.map(h => h.fontSize))];
    
    console.log(`\n✓ H1s: ${h1Fail.length === 0 ? 'PASS (all 48px+)' : `FAIL: ${h1Fail.length} under 48px`}`);
    console.log(`✓ H2s: ${h2Fail.length === 0 ? 'PASS (all 36px+)' : `FAIL: ${h2Fail.length} under 36px`}`);
    console.log(`✓ H3s: ${h3Sizes.length} variants: ${h3Sizes.join(', ')}`);
  }
  
  await browser.close();
})();
