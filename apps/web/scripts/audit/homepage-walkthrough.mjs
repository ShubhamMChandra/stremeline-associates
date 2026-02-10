/**
 * HOMEPAGE WALKTHROUGH — Capture every section as user scrolls
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/homepage-walkthrough.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/walkthrough'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🎬 Starting homepage walkthrough...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2 // Retina quality
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3000) // Let animations settle

// Define checkpoints - using better scroll positions based on actual sections
const checkpoints = [
  { name: '01-hero-section', scrollY: 0, description: 'Hero section with terminal', wait: 2000 },
  { name: '02-problem-scroll-before', scrollY: 1000, description: 'Problem Scroll - Your team\'s day', wait: 1500 },
  { name: '03-problem-scroll-after', scrollY: 2200, description: 'Problem Scroll - After Stremeline', wait: 1500 },
  { name: '04-gradient-dark-to-light', scrollY: 3000, description: 'Dark → Light gradient transition', wait: 1000 },
  { name: '05-capabilities-light', scrollY: 3600, description: 'Capabilities - What We Automate (LIGHT)', wait: 2000 },
  { name: '06-capabilities-cards', scrollY: 4000, description: 'Capabilities cards assembled', wait: 1500 },
  { name: '07-gradient-light-to-dark', scrollY: 5000, description: 'Light → Dark gradient transition', wait: 1000 },
  { name: '08-counter-wall-heading', scrollY: 5600, description: 'Counter Wall heading (dark)', wait: 1500 },
  { name: '09-counter-wall-numbers', scrollY: 6200, description: 'Counter Wall numbers (0+ 0× 12)', wait: 2000 },
  { name: '10-gradient-dark-to-light-2', scrollY: 7000, description: 'Dark → Light gradient (before Use Cases)', wait: 1000 },
  { name: '11-use-cases-light', scrollY: 7800, description: 'Use Cases section (LIGHT)', wait: 1500 },
  { name: '12-gradient-light-to-dark-2', scrollY: 9200, description: 'Light → Dark gradient (before CTA)', wait: 1000 },
  { name: '13-testimonial', scrollY: 9800, description: 'Testimonial section (dark)', wait: 1500 },
  { name: '14-cta-hero', scrollY: 'bottom-offset-400', description: 'CTA hero section (dark)', wait: 1500 },
  { name: '15-footer', scrollY: 'bottom', description: 'Footer', wait: 1000 },
]

// Take full-page screenshot first
console.log('📸 Taking full-page screenshot...')
await page.screenshot({ 
  path: `${OUTPUT}/00-full-page.png`,
  fullPage: true 
})
console.log('✅ Full page captured\n')

// Check for key elements
console.log('🔍 Checking for key elements...\n')

// Get page height for better scroll positions
const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`Page height: ${pageHeight}px\n`)

const checks = {
  'Scroll progress bar (2px amber)': await page.$('[data-scroll-progress]') !== null || 
                                       await page.$('.scroll-progress') !== null,
  'Hero terminal': await page.$('[data-terminal]') !== null || 
                    await page.$('.terminal') !== null ||
                    await page.locator('text=/Terminal|Command|>|\\$/i').first().isVisible().catch(() => false),
  'Capabilities section (light bg)': await page.locator('section.light').first().isVisible().catch(() => false) ||
                                      await page.locator('text=What We Automate').isVisible().catch(() => false),
  'Counter Wall heading': await page.locator('text=/What if your team/i').isVisible().catch(() => false),
  'Use Cases section': await page.locator('text=/Automate What Comes In/i').isVisible().catch(() => false),
}

for (const [check, found] of Object.entries(checks)) {
  console.log(`${found ? '✅' : '❌'} ${check}`)
}
console.log('')

// Walk through each checkpoint
console.log('📸 Capturing section checkpoints...\n')

for (const checkpoint of checkpoints) {
  // Scroll to position
  if (checkpoint.scrollY === 'bottom') {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  } else if (typeof checkpoint.scrollY === 'string' && checkpoint.scrollY.startsWith('bottom-offset-')) {
    const offset = parseInt(checkpoint.scrollY.split('-')[2])
    await page.evaluate((offset) => window.scrollTo(0, document.body.scrollHeight - offset), offset)
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), checkpoint.scrollY)
  }
  
  await page.waitForTimeout(checkpoint.wait || 1000) // Let scroll animations settle
  
  // Take screenshot
  await page.screenshot({ 
    path: `${OUTPUT}/${checkpoint.name}.png` 
  })
  
  console.log(`✅ ${checkpoint.name} — ${checkpoint.description}`)
}

console.log(`\n✨ All screenshots saved to: ${OUTPUT}/`)
await browser.close()
