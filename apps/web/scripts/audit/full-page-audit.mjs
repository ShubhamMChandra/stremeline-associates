/**
 * FULL PAGE LOAD & AUDIT — Wait for build, then check everything
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/full-page-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/full-audit'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🌐 Navigating to homepage and waiting for full load...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

console.log('Loading http://localhost:3001...')
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' })

console.log('Waiting 35 seconds for Next.js compilation...')
await page.waitForTimeout(35000)

console.log('Page loaded. Starting audit...\n')

const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`📏 Page height: ${pageHeight}px\n`)

// Define checkpoints for every section
const checkpoints = [
  { name: '01-hero-headline', scrollY: 0, wait: 2500, section: 'HERO' },
  { name: '02-hero-buttons-stats', scrollY: 550, wait: 2000, section: 'HERO' },
  { name: '03-problem-heading', scrollY: 800, wait: 2000, section: 'PROBLEM' },
  { name: '04-problem-cards', scrollY: 950, wait: 2500, section: 'PROBLEM' },
  { name: '05-problem-detail', scrollY: 1150, wait: 2000, section: 'PROBLEM' },
  { name: '06-gradient-1-dark-to-light', scrollY: 2750, wait: 1500, section: 'GRADIENT #1' },
  { name: '07-capabilities-heading', scrollY: 2950, wait: 2500, section: 'CAPABILITIES' },
  { name: '08-capabilities-cards-top', scrollY: 3250, wait: 2500, section: 'CAPABILITIES' },
  { name: '09-capabilities-cards-bottom', scrollY: 3650, wait: 2500, section: 'CAPABILITIES' },
  { name: '10-gradient-2-light-to-dark', scrollY: 4450, wait: 1500, section: 'GRADIENT #2' },
  { name: '11-counter-wall-numbers', scrollY: 4750, wait: 2500, section: 'COUNTER WALL' },
  { name: '12-counter-wall-quote', scrollY: 5250, wait: 2000, section: 'COUNTER WALL' },
  { name: '13-gradient-3-dark-to-light', scrollY: 6550, wait: 1500, section: 'GRADIENT #3' },
  { name: '14-use-cases-heading', scrollY: 6850, wait: 2000, section: 'USE CASES' },
  { name: '15-use-cases-01-02', scrollY: 7300, wait: 2500, section: 'USE CASES' },
  { name: '16-use-cases-03-04', scrollY: 7950, wait: 2500, section: 'USE CASES' },
  { name: '17-use-cases-05', scrollY: 8550, wait: 2000, section: 'USE CASES' },
  { name: '18-gradient-4-light-to-dark', scrollY: 9200, wait: 1500, section: 'GRADIENT #4' },
  { name: '19-cta-section', scrollY: 9600, wait: 2000, section: 'CTA' },
  { name: '20-footer', scrollY: 'bottom', wait: 1500, section: 'FOOTER' },
]

console.log('📸 Capturing screenshots...\n')

let currentSection = ''
for (const checkpoint of checkpoints) {
  if (checkpoint.section !== currentSection) {
    console.log(`━━━ ${checkpoint.section} ━━━`)
    currentSection = checkpoint.section
  }
  
  if (checkpoint.scrollY === 'bottom') {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), checkpoint.scrollY)
  }
  
  await page.waitForTimeout(checkpoint.wait)
  
  await page.screenshot({ path: `${OUTPUT}/${checkpoint.name}.png` })
  console.log(`✓ ${checkpoint.name}`)
}

// Detailed measurements
console.log('\n🔍 Measuring critical elements...\n')

// Reset to top
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(1000)

// Measure Problem section numbers
await page.evaluate(() => window.scrollTo(0, 950))
await page.waitForTimeout(1500)

const problemNumbers = await page.evaluate(() => {
  const text = document.body.textContent
  return {
    hasToday: /3\.0\s*hrs?\s*\/?\s*day/.test(text) || text.includes('3.0'),
    hasStremeline: /35\s*min\s*\/?\s*day/.test(text) || text.includes('35') || text.includes('~35'),
    foundText: Array.from(document.querySelectorAll('*')).filter(el => {
      const t = el.textContent
      return (t.includes('3.0') || t.includes('35 min')) && el.offsetHeight < 200
    }).map(el => el.textContent.trim().substring(0, 50))
  }
})

console.log('Problem Section Numbers:')
console.log('  "3.0 hrs/day" found:', problemNumbers.hasToday)
console.log('  "~35 min/day" found:', problemNumbers.hasStremeline)
if (problemNumbers.foundText.length > 0) {
  console.log('  Sample text:', problemNumbers.foundText[0])
}

// Check Capabilities cards
await page.evaluate(() => window.scrollTo(0, 3400))
await page.waitForTimeout(2000)

const capabilities = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-capability-card]')
  return {
    found: cards.length > 0,
    count: cards.length,
    visible: Array.from(cards).map(card => ({
      opacity: window.getComputedStyle(card).opacity,
      height: card.offsetHeight,
    }))
  }
})

console.log('\nCapabilities Cards:')
console.log('  Found:', capabilities.found)
console.log('  Count:', capabilities.count)
if (capabilities.visible.length > 0) {
  capabilities.visible.forEach((v, i) => {
    const status = parseFloat(v.opacity) > 0.5 ? '✅' : '❌'
    console.log(`  ${status} Card ${i+1}: opacity=${v.opacity}, height=${v.height}px`)
  })
}

// Check Counter Wall
await page.evaluate(() => window.scrollTo(0, 5000))
await page.waitForTimeout(2000)

const counterWall = await page.evaluate(() => {
  const text = document.body.textContent
  return {
    has50Plus: /50\+/.test(text),
    has90Percent: /90%/.test(text),
    has1Week: /\b1\b/.test(text) && text.includes('week'),
    foundLargeNumbers: Array.from(document.querySelectorAll('*')).filter(el => {
      const fontSize = parseInt(window.getComputedStyle(el).fontSize)
      return fontSize > 80 && el.textContent.trim().length < 10
    }).map(el => el.textContent.trim())
  }
})

console.log('\nCounter Wall:')
console.log('  "50+" found:', counterWall.has50Plus)
console.log('  "90%" found:', counterWall.has90Percent)
console.log('  "1 week" found:', counterWall.has1Week)
console.log('  Large number elements:', counterWall.foundLargeNumbers)

console.log(`\n✨ Full audit complete. Screenshots: ${OUTPUT}/`)

await browser.close()
