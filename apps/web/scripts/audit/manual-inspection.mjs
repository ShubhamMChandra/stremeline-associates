/**
 * Manual Visual Inspection Script
 * Captures specific sections for manual review
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const VIEWPORT = { width: 1440, height: 900 };

async function inspectPage(browser, url, pageName, scrollPoints) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 Inspecting: ${pageName}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(80));
  
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const screenshotDir = `screenshots/manual-inspection/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
    await mkdir(screenshotDir, { recursive: true });
    
    // Hero screenshot
    console.log('\n📸 Capturing hero section...');
    await page.screenshot({
      path: `${screenshotDir}/01-hero.png`,
      fullPage: false,
    });
    
    // Get hero heading size
    const heroHeading = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const styles = window.getComputedStyle(h1);
      return {
        text: h1.textContent?.trim().slice(0, 60),
        fontSize: parseFloat(styles.fontSize),
        fontWeight: parseInt(styles.fontWeight),
        lineHeight: styles.lineHeight,
      };
    });
    
    if (heroHeading) {
      console.log(`\n🎯 Hero H1: "${heroHeading.text}"`);
      console.log(`   Size: ${heroHeading.fontSize}px / Weight: ${heroHeading.fontWeight}`);
      
      if (heroHeading.fontSize >= 44 && heroHeading.fontSize <= 60) {
        console.log(`   ✅ Hero heading size is good (44-60px range)`);
      } else if (heroHeading.fontSize > 60) {
        console.log(`   ⚠️  Hero heading is larger than expected (>${heroHeading.fontSize}px)`);
      } else {
        console.log(`   ❌ Hero heading is too small (should be 44-60px)`);
      }
    }
    
    // Scroll and capture each section
    for (let i = 0; i < scrollPoints.length; i++) {
      const point = scrollPoints[i];
      console.log(`\n📸 Scrolling to: ${point.name}`);
      
      if (point.selector) {
        await page.locator(point.selector).first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
      } else if (point.pixels) {
        await page.evaluate((px) => window.scrollTo(0, px), point.pixels);
        await page.waitForTimeout(500);
      }
      
      await page.screenshot({
        path: `${screenshotDir}/${String(i + 2).padStart(2, '0')}-${point.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: false,
      });
      
      // Analyze section headings
      const sectionInfo = await page.evaluate(() => {
        const viewport = {
          top: window.scrollY,
          bottom: window.scrollY + window.innerHeight,
        };
        
        // Find all headings in viewport
        const h2s = Array.from(document.querySelectorAll('h2')).filter(h => {
          const rect = h.getBoundingClientRect();
          const absTop = rect.top + window.scrollY;
          return absTop >= viewport.top && absTop <= viewport.bottom;
        });
        
        const h3s = Array.from(document.querySelectorAll('h3')).filter(h => {
          const rect = h.getBoundingClientRect();
          const absTop = rect.top + window.scrollY;
          return absTop >= viewport.top && absTop <= viewport.bottom;
        });
        
        return {
          h2s: h2s.map(h => {
            const styles = window.getComputedStyle(h);
            return {
              text: h.textContent?.trim().slice(0, 50),
              fontSize: parseFloat(styles.fontSize),
              fontWeight: parseInt(styles.fontWeight),
            };
          }),
          h3s: h3s.map(h => {
            const styles = window.getComputedStyle(h);
            return {
              text: h.textContent?.trim().slice(0, 40),
              fontSize: parseFloat(styles.fontSize),
              fontWeight: parseInt(styles.fontWeight),
            };
          }),
        };
      });
      
      if (sectionInfo.h2s.length > 0) {
        console.log(`\n   📝 Section H2s in view:`);
        sectionInfo.h2s.forEach(h2 => {
          console.log(`      "${h2.text}" - ${h2.fontSize}px / ${h2.fontWeight}wt`);
          
          if (h2.fontSize >= 32 && h2.fontSize <= 44) {
            console.log(`      ✅ Good section heading size`);
          } else if (h2.fontSize < 32) {
            console.log(`      ❌ Too small for section heading (should be 32-44px)`);
          }
        });
      }
      
      if (sectionInfo.h3s.length > 0) {
        console.log(`\n   📝 H3s in view:`);
        sectionInfo.h3s.slice(0, 3).forEach(h3 => {
          console.log(`      "${h3.text}" - ${h3.fontSize}px / ${h3.fontWeight}wt`);
        });
        if (sectionInfo.h3s.length > 3) {
          console.log(`      ... and ${sectionInfo.h3s.length - 3} more`);
        }
        
        const sizes = [...new Set(sectionInfo.h3s.map(h => h.fontSize))];
        if (sizes.length === 1 && sizes[0] === 18) {
          console.log(`      ✅ All H3s consistent at 18px`);
        } else if (sizes.every(s => s >= 16 && s <= 20)) {
          console.log(`      ⚠️  H3 sizes vary: ${sizes.join(', ')}px`);
        } else {
          console.log(`      ❌ H3 sizing inconsistent: ${sizes.join(', ')}px`);
        }
      }
    }
    
    // Check CTA section
    console.log(`\n📸 Scrolling to CTA section...`);
    const ctaSection = page.locator('section').last();
    await ctaSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: `${screenshotDir}/${String(scrollPoints.length + 2).padStart(2, '0')}-cta.png`,
      fullPage: false,
    });
    
    // Check CTA quote
    const ctaQuote = await page.evaluate(() => {
      // Look for serif text or quotes in CTA
      const cta = document.querySelector('section:last-of-type');
      if (!cta) return null;
      
      // Find any large serif text or quotes
      const serifs = cta.querySelectorAll('[class*="serif"], [class*="font-serif"], blockquote, .text-3xl, .text-4xl, .text-5xl');
      if (serifs.length === 0) return null;
      
      const firstSerif = serifs[0];
      const styles = window.getComputedStyle(firstSerif);
      
      return {
        text: firstSerif.textContent?.trim().slice(0, 60),
        fontSize: parseFloat(styles.fontSize),
        fontFamily: styles.fontFamily,
      };
    });
    
    if (ctaQuote) {
      console.log(`\n   💬 CTA Quote: "${ctaQuote.text}"`);
      console.log(`      Size: ${ctaQuote.fontSize}px`);
      console.log(`      Font: ${ctaQuote.fontFamily}`);
    } else {
      console.log(`\n   ℹ️  No serif quote found in CTA`);
    }
    
    console.log(`\n✓ Screenshots saved to ${screenshotDir}/`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Main
(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Services page
  await inspectPage(browser, 'http://localhost:3001/services', 'Services', [
    { name: 'Capabilities', selector: 'section:has-text("Core Capabilities")' },
    { name: 'Use Cases', selector: 'section:has-text("Common Bottlenecks")' },
  ]);
  
  // About page
  await inspectPage(browser, 'http://localhost:3001/about', 'About', [
    { name: 'Principles', selector: 'section:has-text("Our Principles")' },
    { name: 'Process Steps', selector: 'section:has-text("Four Steps")' },
  ]);
  
  // Case Studies page
  await inspectPage(browser, 'http://localhost:3001/case-studies', 'Case Studies', [
    { name: 'Case Study Card', selector: 'section:nth-of-type(2)' },
  ]);
  
  await browser.close();
  
  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`✅ Manual inspection complete`);
  console.log(`📁 Screenshots: apps/web/screenshots/manual-inspection/`);
  console.log('='.repeat(80) + '\n');
})();
