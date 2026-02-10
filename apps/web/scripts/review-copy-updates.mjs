#!/usr/bin/env node

/**
 * What this does: Captures specific sections after content updates
 * Why it's here: To review updated copy for use cases and capabilities
 * How it works: Navigates and scrolls to specific sections for screenshots
 * Dependencies: @playwright/test
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../screenshots/services-copy-review');

async function reviewCopyUpdates() {
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

  // First, scroll to capabilities section
  console.log('1. Scrolling to capabilities cards section...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '1-capabilities-cards.png'),
  });

  // Scroll a bit more to capture all capabilities if needed
  console.log('2. Capturing full capabilities grid...');
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '2-capabilities-full.png'),
  });

  // Now scroll to use cases section
  console.log('3. Scrolling to "Common Bottlenecks We Fix" section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '3-use-cases-top.png'),
  });

  // Capture more of use cases
  console.log('4. Capturing full use cases list...');
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '4-use-cases-full.png'),
  });

  console.log(`\n✅ Copy review screenshots saved to: ${screenshotsDir}`);

  await browser.close();
}

reviewCopyUpdates().catch(console.error);
