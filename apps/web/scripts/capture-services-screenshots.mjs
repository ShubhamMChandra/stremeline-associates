#!/usr/bin/env node

/**
 * What this does: Captures screenshots of the services page at different scroll positions
 * Why it's here: To document the full page layout for review
 * How it works: Uses Playwright to navigate, scroll, and take screenshots at major sections
 * Dependencies: @playwright/test
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../screenshots/services');

async function captureServicesPage() {
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

  console.log('1. Capturing hero section at the top...');
  await page.screenshot({
    path: join(screenshotsDir, '1-hero-section.png'),
    fullPage: false,
  });

  // Scroll to capabilities section
  console.log('2. Scrolling to capabilities section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '2-capabilities-section.png'),
    fullPage: false,
  });

  // Continue scrolling to see more capabilities
  console.log('3. Scrolling through capabilities grid...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '3-capabilities-grid.png'),
    fullPage: false,
  });

  // Scroll to use cases section
  console.log('4. Scrolling to use cases section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '4-use-cases-section.png'),
    fullPage: false,
  });

  // Continue through use cases
  console.log('5. Scrolling through use cases...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '5-use-cases-continued.png'),
    fullPage: false,
  });

  // Scroll to CTA section
  console.log('6. Scrolling to CTA section at bottom...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(screenshotsDir, '6-cta-section.png'),
    fullPage: false,
  });

  // Capture full page screenshot
  console.log('7. Capturing full page screenshot...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(screenshotsDir, '0-full-page.png'),
    fullPage: true,
  });

  console.log(`\n✅ Screenshots saved to: ${screenshotsDir}`);
  console.log('\nFiles created:');
  console.log('- 0-full-page.png (complete page)');
  console.log('- 1-hero-section.png');
  console.log('- 2-capabilities-section.png');
  console.log('- 3-capabilities-grid.png');
  console.log('- 4-use-cases-section.png');
  console.log('- 5-use-cases-continued.png');
  console.log('- 6-cta-section.png');

  await browser.close();
}

captureServicesPage().catch(console.error);
