#!/usr/bin/env node

/**
 * What this does: Captures detailed screenshots of each services page section for design review
 * Why it's here: To critically analyze layout, spacing, and visual polish
 * How it works: Scrolls to specific positions and captures viewport screenshots
 * Dependencies: @playwright/test
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../screenshots/services-review');

async function reviewServicesPage() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  await mkdir(screenshotsDir, { recursive: true });

  console.log('Navigating to http://localhost:3001/services...');
  await page.goto('http://localhost:3001/services', {
    waitUntil: 'networkidle',
  });

  // Wait for page to be fully loaded
  await page.waitForTimeout(2000);

  // 1. Hero section at top
  console.log('1. Capturing hero/top section...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(screenshotsDir, '1-hero-top.png'),
    fullPage: false,
  });

  // 2. Capabilities grid (light section)
  console.log('2. Capturing capabilities card grid section...');
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(screenshotsDir, '2-capabilities-grid.png'),
    fullPage: false,
  });

  // 3. Check if there's a stat band (numbers)
  console.log('3. Looking for stat band / numbers section...');
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(screenshotsDir, '3-stats-or-transition.png'),
    fullPage: false,
  });

  // 4. Use cases section (numbered rows)
  console.log('4. Capturing use cases numbered rows...');
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(screenshotsDir, '4-use-cases-rows.png'),
    fullPage: false,
  });

  // 5. More use cases
  console.log('5. Capturing more use cases...');
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(screenshotsDir, '5-use-cases-continued.png'),
    fullPage: false,
  });

  // 6. CTA and footer
  console.log('6. Capturing CTA and footer section...');
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(screenshotsDir, '6-cta-footer.png'),
    fullPage: false,
  });

  console.log(`\n✅ Review screenshots saved to: ${screenshotsDir}`);

  await browser.close();
}

reviewServicesPage().catch(console.error);
