/**
 * Typography Measurement Script
 * Measures exact computed font sizes of all headings
 */

import { chromium } from 'playwright';

const PAGES = [
  { url: 'http://localhost:3001/services', name: 'Services' },
  { url: 'http://localhost:3001/about', name: 'About' },
  { url: 'http://localhost:3001/case-studies', name: 'Case Studies' },
];

async function measureTypography(browser, pageInfo) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${pageInfo.name} - ${pageInfo.url}`);
  console.log('='.repeat(80));
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  try {
    // Try with a longer timeout
    await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(3000); // Wait for hydration
    
    // Run the measurement script
    const results = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3');
      return Array.from(headings).map(h => {
        const styles = window.getComputedStyle(h);
        return {
          tag: h.tagName,
          text: h.textContent?.trim().slice(0, 45),
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
        };
      });
    });
    
    if (results.length === 0) {
      console.log('⚠️  No headings found on page');
      return;
    }
    
    // Group by tag
    const h1s = results.filter(r => r.tag === 'H1');
    const h2s = results.filter(r => r.tag === 'H2');
    const h3s = results.filter(r => r.tag === 'H3');
    
    // H1s
    if (h1s.length > 0) {
      console.log(`\n🎯 H1 Headings (${h1s.length}):`);
      h1s.forEach(h => {
        const size = parseFloat(h.fontSize);
        const status = size >= 40 && size <= 60 ? '✅' : 
                      size < 40 ? '❌ TOO SMALL' : '⚠️  LARGE';
        console.log(`   ${status} "${h.text}"`);
        console.log(`       Font: ${h.fontSize} / Weight: ${h.fontWeight} / Line: ${h.lineHeight}`);
      });
    }
    
    // H2s
    if (h2s.length > 0) {
      console.log(`\n📐 H2 Section Headings (${h2s.length}):`);
      h2s.forEach(h => {
        const size = parseFloat(h.fontSize);
        const status = size >= 30 && size <= 48 ? '✅' : 
                      size < 30 ? '❌ TOO SMALL' : '⚠️  LARGE';
        console.log(`   ${status} "${h.text}"`);
        console.log(`       Font: ${h.fontSize} / Weight: ${h.fontWeight}`);
      });
    }
    
    // H3s
    if (h3s.length > 0) {
      console.log(`\n📝 H3 Card/Row Titles (${h3s.length}):`);
      
      // Check consistency
      const sizes = [...new Set(h3s.map(h => parseFloat(h.fontSize)))];
      const allAround18 = sizes.every(s => s >= 16 && s <= 20);
      const consistent = sizes.length === 1;
      
      // Show first 5
      h3s.slice(0, 5).forEach(h => {
        console.log(`   • "${h.text}"`);
        console.log(`     ${h.fontSize} / ${h.fontWeight}wt`);
      });
      
      if (h3s.length > 5) {
        console.log(`   ... and ${h3s.length - 5} more`);
      }
      
      console.log(`\n   📊 H3 Size Analysis:`);
      console.log(`       Unique sizes: ${sizes.join(', ')}px`);
      
      if (consistent && sizes[0] >= 17 && sizes[0] <= 19) {
        console.log(`       ✅ Consistent at ~18px`);
      } else if (allAround18) {
        console.log(`       ⚠️  Close to 18px but has ${sizes.length} variants`);
      } else {
        console.log(`       ❌ Inconsistent sizing`);
      }
    }
    
    // Summary
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`Summary for ${pageInfo.name}:`);
    
    const h1Status = h1s.every(h => {
      const s = parseFloat(h.fontSize);
      return s >= 40 && s <= 60;
    });
    const h2Status = h2s.every(h => {
      const s = parseFloat(h.fontSize);
      return s >= 30 && s <= 48;
    });
    const h3Sizes = [...new Set(h3s.map(h => parseFloat(h.fontSize)))];
    const h3Status = h3Sizes.length === 1 && h3Sizes[0] >= 17 && h3Sizes[0] <= 19;
    
    console.log(`   H1s (40-60px): ${h1Status ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   H2s (30-48px): ${h2Status ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   H3s (~18px):   ${h3Status ? '✅ PASS' : '⚠️  NEEDS WORK'}`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Main
(async () => {
  const browser = await chromium.launch({ headless: true });
  
  for (const pageInfo of PAGES) {
    await measureTypography(browser, pageInfo);
  }
  
  await browser.close();
  
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log(`✅ Typography measurement complete`);
  console.log('═'.repeat(80) + '\n');
})();
