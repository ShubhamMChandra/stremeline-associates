/**
 * FOCUSED AUDIT — Capabilities and Use Cases sections
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/focused-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/focused-audit'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🎯 Starting focused audit of Capabilities and Use Cases...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3000)

console.log('📸 Section 1: CAPABILITIES\n')

// Scroll to Capabilities section
await page.evaluate(() => window.scrollTo(0, 3300))
await page.waitForTimeout(2500)

// Check Capabilities visibility
const capabilitiesCheck = await page.evaluate(() => {
  const section = document.querySelector('section.light, section.bg-background')
  if (!section) return { found: false }
  
  const heading = section.querySelector('h2')
  const cards = section.querySelectorAll('[data-capability-card]')
  
  const cardData = Array.from(cards).map((card, i) => {
    const styles = window.getComputedStyle(card)
    const title = card.querySelector('h3')
    const desc = card.querySelector('p')
    return {
      index: i,
      visible: styles.opacity !== '0' && styles.display !== 'none',
      opacity: styles.opacity,
      title: title ? title.textContent.trim() : 'NO TITLE',
      description: desc ? desc.textContent.trim().substring(0, 50) + '...' : 'NO DESC',
    }
  })
  
  return {
    found: true,
    sectionBg: window.getComputedStyle(section).backgroundColor,
    heading: heading ? heading.textContent.trim() : 'NO HEADING',
    cardCount: cards.length,
    cards: cardData,
  }
})

console.log('Capabilities Section:')
if (capabilitiesCheck.found) {
  console.log(`  Heading: "${capabilitiesCheck.heading}"`)
  console.log(`  Background: ${capabilitiesCheck.sectionBg}`)
  console.log(`  Card Count: ${capabilitiesCheck.cardCount}`)
  console.log(`  Cards:`)
  capabilitiesCheck.cards.forEach(card => {
    const status = card.visible ? '✅ VISIBLE' : '❌ INVISIBLE'
    console.log(`    ${status} (opacity: ${card.opacity})`)
    console.log(`      Title: "${card.title}"`)
    console.log(`      Desc: "${card.description}"`)
  })
} else {
  console.log('  ❌ SECTION NOT FOUND')
}

// Take screenshots at different scroll positions
await page.evaluate(() => window.scrollTo(0, 3100))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUTPUT}/01-capabilities-heading.png` })
console.log('  📸 Screenshot: capabilities-heading')

await page.evaluate(() => window.scrollTo(0, 3500))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUTPUT}/02-capabilities-cards-full.png` })
console.log('  📸 Screenshot: capabilities-cards-full')

await page.evaluate(() => window.scrollTo(0, 3900))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUTPUT}/03-capabilities-cards-bottom.png` })
console.log('  📸 Screenshot: capabilities-cards-bottom')

console.log('\n📸 Section 2: USE CASES\n')

// Scroll to Use Cases section
await page.evaluate(() => window.scrollTo(0, 7200))
await page.waitForTimeout(2500)

const useCasesCheck = await page.evaluate(() => {
  // Find the Use Cases section by looking for the heading text
  const headings = Array.from(document.querySelectorAll('h2, h3'))
  const useCasesHeading = headings.find(h => 
    h.textContent.includes('Bottleneck') || 
    h.textContent.includes('Common') ||
    h.textContent.includes('Use Case')
  )
  
  if (!useCasesHeading) return { found: false }
  
  const section = useCasesHeading.closest('section')
  if (!section) return { found: false }
  
  // Find all use case cards (look for numbered items or cards)
  const cards = section.querySelectorAll('article, [class*="use-case"], div[class*="card"]')
  
  // Measure vertical spacing between cards
  const cardPositions = Array.from(cards).map(card => {
    const rect = card.getBoundingClientRect()
    const title = card.querySelector('h3, h4, strong')
    return {
      top: rect.top + window.scrollY,
      height: rect.height,
      title: title ? title.textContent.trim().substring(0, 40) : 'Untitled',
    }
  }).filter(c => c.height > 0)
  
  const gaps = []
  for (let i = 0; i < cardPositions.length - 1; i++) {
    const gap = cardPositions[i + 1].top - (cardPositions[i].top + cardPositions[i].height)
    gaps.push({
      between: `"${cardPositions[i].title}" → "${cardPositions[i + 1].title}"`,
      gap: Math.round(gap) + 'px',
    })
  }
  
  return {
    found: true,
    heading: useCasesHeading.textContent.trim(),
    cardCount: cardPositions.length,
    cards: cardPositions.map(c => ({ title: c.title, height: Math.round(c.height) + 'px' })),
    verticalGaps: gaps,
  }
})

console.log('Use Cases Section:')
if (useCasesCheck.found) {
  console.log(`  Heading: "${useCasesCheck.heading}"`)
  console.log(`  Card Count: ${useCasesCheck.cardCount}`)
  if (useCasesCheck.cards.length > 0) {
    console.log(`  Cards:`)
    useCasesCheck.cards.forEach((card, i) => {
      console.log(`    ${i + 1}. "${card.title}" (height: ${card.height})`)
    })
  }
  if (useCasesCheck.verticalGaps.length > 0) {
    console.log(`  Vertical Spacing:`)
    useCasesCheck.verticalGaps.forEach(gap => {
      const status = parseInt(gap.gap) > 300 ? '❌ TOO LARGE' : parseInt(gap.gap) > 150 ? '⚠️ LARGE' : '✅ GOOD'
      console.log(`    ${status} ${gap.gap} — ${gap.between}`)
    })
  }
} else {
  console.log('  ❌ SECTION NOT FOUND')
}

// Take Use Cases screenshots
await page.evaluate(() => window.scrollTo(0, 7200))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUTPUT}/04-use-cases-top.png` })
console.log('  📸 Screenshot: use-cases-top')

await page.evaluate(() => window.scrollTo(0, 7700))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUTPUT}/05-use-cases-middle.png` })
console.log('  📸 Screenshot: use-cases-middle')

await page.evaluate(() => window.scrollTo(0, 8200))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUTPUT}/06-use-cases-bottom.png` })
console.log('  📸 Screenshot: use-cases-bottom')

console.log('\n📸 Section 3: OVERALL PAGE FLOW\n')

// Quick scroll through entire page looking for issues
const flowCheckpoints = [
  { y: 0, name: '07-hero' },
  { y: 1000, name: '08-problem-scroll' },
  { y: 2000, name: '09-problem-after' },
  { y: 2900, name: '10-gradient-1' },
  { y: 4700, name: '11-gradient-2' },
  { y: 5500, name: '12-counter-wall' },
  { y: 6800, name: '13-gradient-3' },
  { y: 9500, name: '14-gradient-4' },
  { y: 10500, name: '15-cta' },
  { y: 'bottom', name: '16-footer' },
]

console.log('Taking full page flow screenshots...')
for (const checkpoint of flowCheckpoints) {
  if (checkpoint.y === 'bottom') {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), checkpoint.y)
  }
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUTPUT}/${checkpoint.name}.png` })
  console.log(`  ✅ ${checkpoint.name}`)
}

console.log(`\n✨ Focused audit complete. Screenshots: ${OUTPUT}/`)

await browser.close()
