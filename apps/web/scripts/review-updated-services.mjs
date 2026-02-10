#!/usr/bin/env node

/**
 * What this does: Captures updated services page with new dark/light rhythm
 * Why it's here: To review the redesigned layout and spacing improvements
 * How it works: Scrolls through each section and captures viewport screenshots
 * Dependencies: @playwright/test
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../screenshots/services-updated');

async function reviewUpdatedServices() {
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

  await page.waitForTimeout(2000);

  // 1. Dark hero with proof stats
  console.log('1. Dark hero with proof stats...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '1-dark-hero-with-stats.png'),
  });

  // 2. LIGHT capabilities card grid
  console.log('2. LIGHT capabilities card grid...');
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '2-light-capabilities-grid.png'),
  });

  // 3. Dark stat band with 4 numbers
  console.log('3. Dark stat band with 4 big numbers...');
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '3-dark-stat-band.png'),
  });

  // 4. LIGHT use cases section
  console.log('4. LIGHT use cases section...');
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '4-light-use-cases.png'),
  });

  // 5. Dark CTA with serif text
  console.log('5. Dark CTA section...');
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '5-dark-cta-footer.png'),
  });

  console.log(`\n✅ Updated screenshots saved to: ${screenshotsDir}`);

  await browser.close();
}

reviewUpdatedServices().catch(console.error);
