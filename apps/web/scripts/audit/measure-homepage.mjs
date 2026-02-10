/**
 * Homepage Typography Measurement
 */

import { chromium } from 'playwright';

async function measureHomepage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3');
      return Array.from(headings).map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 50),
        fontSize: getComputedStyle(h).fontSize,
        fontWeight: getComputedStyle(h).fontWeight
      }));
    });
    
    console.log('HOMEPAGE MEASUREMENTS:\n');
    console.log(JSON.stringify(results, null, 2));
    
    // Analysis
    const h1s = results.filter(r => r.tag === 'H1');
    const h2s = results.filter(r => r.tag === 'H2');
    const h3s = results.filter(r => r.tag === 'H3');
    
    console.log('\n\n=== ANALYSIS ===\n');
    
    console.log(`H1s (${h1s.length}):`);
    h1s.forEach(h => {
      const size = parseFloat(h.fontSize);
      const status = size >= 40 && size <= 60 ? '✅' : size < 40 ? '❌' : '⚠️';
      console.log(`  ${status} ${h.fontSize} - "${h.text}"`);
    });
    
    console.log(`\nH2s (${h2s.length}):`);
    h2s.forEach(h => {
      const size = parseFloat(h.fontSize);
      const status = size >= 30 && size <= 48 ? '✅' : size < 30 ? '❌' : '⚠️';
      console.log(`  ${status} ${h.fontSize} - "${h.text}"`);
    });
    
    console.log(`\nH3s (${h3s.length}):`);
    const h3Sizes = [...new Set(h3s.map(h => parseFloat(h.fontSize)))];
    console.log(`  Unique sizes: ${h3Sizes.join(', ')}px`);
    h3s.forEach(h => {
      console.log(`  • ${h.fontSize} - "${h.text}"`);
    });
    
    const allH3s18 = h3Sizes.length === 1 && h3Sizes[0] === 18;
    console.log(`  ${allH3s18 ? '✅' : '⚠️'} Consistency: ${allH3s18 ? 'All 18px' : `${h3Sizes.length} variants`}`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await page.close();
    await browser.close();
  }
}

measureHomepage();
