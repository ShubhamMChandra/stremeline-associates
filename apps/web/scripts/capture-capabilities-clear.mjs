#!/usr/bin/env node

/**
 * What this does: Captures just the capabilities cards section clearly
 * Why it's here: Need better view of updated capability card copy
 * How it works: Scrolls to exact position and captures
 * Dependencies: @playwright/test
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../screenshots/services-copy-review');

async function captureCapabilities() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  await mkdir(screenshotsDir, { recursive: true });

  await page.goto('http://localhost:3001/services', {
    waitUntil: 'networkidle',
  });

  await page.waitForTimeout(2000);

  // Scroll to capabilities section
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(1000);
  
  await page.screenshot({
    path: join(screenshotsDir, '0-capabilities-cards-clear.png'),
  });

  await browser.close();
}

captureCapabilities().catch(console.error);
