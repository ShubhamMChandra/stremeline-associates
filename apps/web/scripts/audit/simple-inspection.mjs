/**
 * Simple Manual Inspection - Just scroll and capture
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const VIEWPORT = { width: 1440, height: 900 };

async function capturePageSections(browser, url, pageName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${pageName}: ${url}`);
  console.log('='.repeat(80));
  
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const dir = `screenshots/manual-inspection/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
    await mkdir(dir, { recursive: true });
    
    // Get page height
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Page height: ${pageHeight}px`);
    
    // Hero
    console.log('\n📸 Hero section');
    await page.screenshot({ path: `${dir}/01-hero.png` });
    
    const heroInfo = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const s = window.getComputedStyle(h1);
      return {
        text: h1.textContent?.trim().slice(0, 50),
        fontSize: parseFloat(s.fontSize),
        fontWeight: parseInt(s.fontWeight),
      };
    });
    
    if (heroInfo) {
      console.log(`   H1: "${heroInfo.text}"`);
      console.log(`   ${heroInfo.fontSize}px / ${heroInfo.fontWeight}wt`);
      
      if (heroInfo.fontSize >= 44 && heroInfo.fontSize <= 60) {
        console.log(`   ✅ Hero size is good (44-60px)`);
      } else if (heroInfo.fontSize < 44) {
        console.log(`   ❌ Hero too small (${heroInfo.fontSize}px, should be 44-60px)`);
      } else {
        console.log(`   ⚠️  Hero is large (${heroInfo.fontSize}px)`);
      }
    }
    
    // Scroll through page in thirds
    const scrollStops = [
      pageHeight * 0.33,
      pageHeight * 0.66,
      pageHeight - 800, // Bottom (leaving room for viewport)
    ];
    
    for (let i = 0; i < scrollStops.length; i++) {
      const pos = Math.round(scrollStops[i]);
      console.log(`\n📸 Scrolling to ${pos}px`);
      
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.waitForTimeout(800);
      
      await page.screenshot({
        path: `${dir}/${String(i + 2).padStart(2, '0')}-scroll-${pos}.png`,
      });
      
      // Get visible headings
      const headings = await page.evaluate(() => {
        const vp = {
          top: window.scrollY,
          bottom: window.scrollY + window.innerHeight,
        };
        
        const inView = (el) => {
          const rect = el.getBoundingClientRect();
          const absTop = rect.top + window.scrollY;
          return absTop >= vp.top && absTop < vp.bottom;
        };
        
        const h2s = Array.from(document.querySelectorAll('h2'))
          .filter(inView)
          .map(h => {
            const s = window.getComputedStyle(h);
            return {
              text: h.textContent?.trim().slice(0, 40),
              fontSize: parseFloat(s.fontSize),
            };
          });
        
        const h3s = Array.from(document.querySelectorAll('h3'))
          .filter(inView)
          .map(h => {
            const s = window.getComputedStyle(h);
            return {
              text: h.textContent?.trim().slice(0, 35),
              fontSize: parseFloat(s.fontSize),
            };
          });
        
        return { h2s, h3s };
      });
      
      if (headings.h2s.length > 0) {
        console.log(`   H2s in view:`);
        headings.h2s.forEach(h => {
          const status = h.fontSize >= 32 && h.fontSize <= 44 ? '✅' : 
                        h.fontSize < 32 ? '❌ TOO SMALL' : '⚠️ ';
          console.log(`      ${status} "${h.text}" - ${h.fontSize}px`);
        });
      }
      
      if (headings.h3s.length > 0) {
        const sizes = [...new Set(headings.h3s.map(h => h.fontSize))];
        const consistent = sizes.length === 1 && sizes[0] === 18;
        console.log(`   H3s in view: ${headings.h3s.length} found, sizes: ${sizes.join(', ')}px ${consistent ? '✅' : '⚠️'}`);
      }
    }
    
    console.log(`✓ Saved to ${dir}/`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  await capturePageSections(browser, 'http://localhost:3001/services', 'Services');
  await capturePageSections(browser, 'http://localhost:3001/about', 'About');
  await capturePageSections(browser, 'http://localhost:3001/case-studies', 'Case Studies');
  
  await browser.close();
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ Inspection complete - check screenshots/manual-inspection/`);
  console.log('='.repeat(80) + '\n');
})();
