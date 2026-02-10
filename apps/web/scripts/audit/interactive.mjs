/**
 * INTERACTIVE AUDIT — Check heading hierarchy, button sizes, hover states, animations
 */
import { chromium } from 'playwright';
import fs from 'fs';

const OUTPUT = './audit-screenshots';
fs.mkdirSync(OUTPUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3001');
await page.waitForTimeout(3000);

// 1. Check heading sizes properly
const headings = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('h1, h2, h3, h4').forEach(h => {
    const cs = getComputedStyle(h);
    results.push({
      tag: h.tagName,
      text: h.textContent?.trim().slice(0, 50),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      section: h.closest('section')?.id || 'none'
    });
  });
  return results;
});
console.log('HEADING HIERARCHY:');
headings.forEach(h => console.log(`  ${h.section} ${h.tag}: ${h.fontSize} / wt:${h.fontWeight} — "${h.text}"`));

// 2. Check all interactive element sizes
const interactiveElements = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cs = getComputedStyle(el);
    results.push({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 40),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      computedHeight: cs.height,
      section: el.closest('section')?.id || el.closest('footer') ? 'footer' : el.closest('header') ? 'header' : 'other'
    });
  });
  return results;
});
console.log('\nINTERACTIVE ELEMENT SIZES (desktop):');
interactiveElements.forEach(el => console.log(`  ${el.section} <${el.tag}>: "${el.text}" ${el.width}x${el.height} (computed h: ${el.computedHeight})`));

// 3. Check animation-related elements
const animations = await page.evaluate(() => {
  // TextGenerateEffect
  const tge = document.querySelector('#hero h1');
  const tgeWords = document.querySelectorAll('#hero h1 span');
  
  // TypewriterEffect - check if amber colored text exists in hero subtitle
  const typewriterEl = document.querySelector('#hero p .text-amber-500, #hero p span[class*="amber"]');
  
  // OrbitingCircles
  const orbitingParent = document.querySelector('#hero [aria-hidden="true"] .relative');
  const orbitPaths = document.querySelectorAll('svg circle, [class*="orbit"]');
  
  // NumberTicker
  const tickers = document.querySelectorAll('[class*="number-ticker"], [class*="tabular-nums"]');
  
  // BackgroundBeams
  const beams = document.querySelectorAll('svg.absolute, [class*="beam"]');
  
  return {
    textGenerate: { found: !!tge, wordCount: tgeWords.length, text: tge?.textContent?.trim().slice(0, 50) },
    typewriter: { found: !!typewriterEl, text: typewriterEl?.textContent?.trim() },
    orbiting: { parentFound: !!orbitingParent, paths: orbitPaths.length },
    numberTickers: tickers.length,
    beamElements: beams.length,
  };
});
console.log('\nANIMATION ELEMENTS:');
console.log('  TextGenerateEffect:', JSON.stringify(animations.textGenerate));
console.log('  TypewriterEffect:', JSON.stringify(animations.typewriter));
console.log('  OrbitingCircles:', JSON.stringify(animations.orbiting));
console.log('  NumberTickers:', animations.numberTickers);
console.log('  BeamElements:', animations.beamElements);

// 4. Custom class presence
const classes = await page.evaluate(() => {
  return {
    cardLift: document.querySelectorAll('.card-lift').length,
    btnGlow: document.querySelectorAll('.btn-glow').length,
    statGlow: document.querySelectorAll('.stat-glow').length,
    glass: document.querySelectorAll('.glass').length,
    marqueeFade: document.querySelectorAll('.marquee-fade').length,
  };
});
console.log('\nCUSTOM CLASSES:');
Object.entries(classes).forEach(([k, v]) => console.log(`  .${k}: ${v} elements`));

// 5. Hover state screenshots
// Primary CTA button hover
const bookBtn = page.locator('a:has-text("Book an Audit")').first();
await bookBtn.scrollIntoViewIfNeeded();
await bookBtn.hover();
await page.waitForTimeout(300);
const btnBox = await bookBtn.boundingBox();
if (btnBox) {
  await page.screenshot({
    path: `${OUTPUT}/hover-btn-primary.png`,
    clip: { x: Math.max(0, btnBox.x - 20), y: Math.max(0, btnBox.y - 20), width: btnBox.width + 40, height: btnBox.height + 40 }
  });
  console.log('\nPrimary button hover screenshot captured');
}

// Outline button hover
const outlineBtn = page.locator('a:has-text("See Our Work")').first();
await outlineBtn.hover();
await page.waitForTimeout(300);
const outBtnBox = await outlineBtn.boundingBox();
if (outBtnBox) {
  await page.screenshot({
    path: `${OUTPUT}/hover-btn-outline.png`,
    clip: { x: Math.max(0, outBtnBox.x - 20), y: Math.max(0, outBtnBox.y - 20), width: outBtnBox.width + 40, height: outBtnBox.height + 40 }
  });
  console.log('Outline button hover screenshot captured');
}

// Scroll to capabilities and hover on a card
const capSection = page.locator('#capabilities');
await capSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);

// Card hover
const firstCard = page.locator('#capabilities .group').first();
if (await firstCard.count() > 0) {
  await firstCard.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUTPUT}/hover-card-capabilities.png` });
  console.log('Capabilities card hover screenshot captured');
}

// Use cases card hover
const ucSection = page.locator('#use-cases');
await ucSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const ucCard = page.locator('#use-cases .card-lift').first();
if (await ucCard.count() > 0) {
  await ucCard.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUTPUT}/hover-card-usecase.png` });
  console.log('Use case card hover screenshot captured');
}

// 6. Check mobile button sizes specifically
await page.close();
const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
await mobilePage.goto('http://localhost:3001');
await mobilePage.waitForTimeout(3000);

const mobileButtons = await mobilePage.evaluate(() => {
  const results = [];
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    results.push({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 40),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      section: el.closest('section')?.id || (el.closest('footer') ? 'footer' : (el.closest('header') ? 'header' : 'other')),
      meets44: rect.height >= 44
    });
  });
  return results;
});
console.log('\nMOBILE TOUCH TARGETS (375px):');
mobileButtons.forEach(b => {
  const status = b.meets44 ? 'OK' : 'FAIL';
  console.log(`  [${status}] ${b.section} <${b.tag}>: "${b.text}" ${b.width}x${b.height}`);
});

// 7. Mobile overflow root cause
const mobileOverflow = await mobilePage.evaluate(() => {
  const results = [];
  // Check all direct children of body and sections
  const sections = document.querySelectorAll('section, header, footer, main > *');
  sections.forEach(el => {
    const id = el.id || el.tagName;
    // Check all children recursively for overflow
    el.querySelectorAll('*').forEach(child => {
      const rect = child.getBoundingClientRect();
      if (rect.right > window.innerWidth + 1) {
        const cs = getComputedStyle(child);
        results.push({
          section: id,
          element: child.tagName + (child.className ? '.' + child.className.split(' ').slice(0, 3).join('.') : ''),
          right: Math.round(rect.right),
          overflow: Math.round(rect.right - window.innerWidth),
          width: Math.round(rect.width),
          display: cs.display,
          position: cs.position,
        });
      }
    });
  });
  // Deduplicate by section + overflow amount
  const seen = new Set();
  return results.filter(r => {
    const key = r.section + ':' + r.overflow;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 30);
});
console.log('\nMOBILE OVERFLOW ROOT CAUSES (375px):');
mobileOverflow.forEach(o => console.log(`  #${o.section}: ${o.element} overflows by ${o.overflow}px (width: ${o.width}, pos: ${o.position})`));

await browser.close();
console.log('\nDone.');
