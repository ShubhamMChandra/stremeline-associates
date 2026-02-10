/**
 * TARGETED SECTION CHECK — Capabilities cards & Counter Wall
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/section-check.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/section-check'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🔍 Checking specific sections...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3000)

console.log('━━━ CHECK 1: CAPABILITIES SECTION ━━━\n')

// Scroll to find "What We Automate" heading
await page.evaluate(() => {
  const heading = Array.from(document.querySelectorAll('*')).find(el => 
    el.textContent.includes('What We Automate') && el.tagName.match(/H[1-6]/)
  )
  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

await page.waitForTimeout(2000)

await page.screenshot({ path: `${OUTPUT}/01-capabilities-heading.png` })
console.log('✓ Screenshot: Capabilities heading area')

// Check for cards
const capabilitiesCheck = await page.evaluate(() => {
  // Find "What We Automate" section
  const section = Array.from(document.querySelectorAll('section')).find(s => 
    s.textContent.includes('What We Automate')
  )
  
  if (!section) return { found: false, reason: 'Section not found' }
  
  const sectionBg = window.getComputedStyle(section).backgroundColor
  
  // Look for capability cards
  const cards = section.querySelectorAll('[data-capability-card]')
  
  if (cards.length === 0) {
    // Maybe they don't have the data attribute, try finding by icon
    const iconCards = Array.from(section.querySelectorAll('*')).filter(el => {
      const text = el.textContent
      return (text.includes('Automate What Comes In') || 
              text.includes('Connect Your Tools') || 
              text.includes('Clean Data') || 
              text.includes('Scale Without Adding Headcount')) &&
              el.offsetHeight > 50 && 
              el.offsetHeight < 500
    })
    
    return {
      found: true,
      sectionBg,
      cardCount: iconCards.length,
      method: 'text-search',
      firstCardText: iconCards[0]?.textContent.substring(0, 100),
    }
  }
  
  const cardData = Array.from(cards).map(card => {
    const styles = window.getComputedStyle(card)
    return {
      opacity: styles.opacity,
      display: styles.display,
      height: card.offsetHeight,
      text: card.textContent.substring(0, 50),
    }
  })
  
  return {
    found: true,
    sectionBg,
    cardCount: cards.length,
    method: 'data-attribute',
    cards: cardData,
  }
})

console.log('\nCapabilities Section Analysis:')
console.log('  Section found:', capabilitiesCheck.found)
console.log('  Background:', capabilitiesCheck.sectionBg)
console.log('  Card count:', capabilitiesCheck.cardCount)
console.log('  Detection method:', capabilitiesCheck.method)
if (capabilitiesCheck.cards) {
  capabilitiesCheck.cards.forEach((card, i) => {
    console.log(`  Card ${i+1}: opacity=${card.opacity}, height=${card.height}px`)
  })
}

// Scroll down a bit to see the cards
await page.evaluate(() => window.scrollBy(0, 300))
await page.waitForTimeout(1500)

await page.screenshot({ path: `${OUTPUT}/02-capabilities-cards-grid.png` })
console.log('✓ Screenshot: Capabilities cards grid')

// Scroll more to see all cards
await page.evaluate(() => window.scrollBy(0, 400))
await page.waitForTimeout(1500)

await page.screenshot({ path: `${OUTPUT}/03-capabilities-cards-complete.png` })
console.log('✓ Screenshot: Complete capabilities grid')

console.log('\n━━━ CHECK 2: COUNTER WALL SECTION ━━━\n')

// Look for Counter Wall section
const counterWallCheck = await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll('section'))
  
  // Look for section with very large numbers
  const counterSection = sections.find(s => {
    // Check for large numbers in text
    const text = s.textContent
    const hasLargeNumber = /\d{2,3}\+/.test(text) || /\d{2,3}%/.test(text) || /\d{1,2}×/.test(text)
    
    // Check for dark background
    const bg = window.getComputedStyle(s).backgroundColor
    const isDark = bg.includes('10, 10, 11') || bg.includes('0, 0, 0')
    
    return hasLargeNumber && isDark
  })
  
  if (!counterSection) {
    return { found: false, reason: 'No section with large numbers + dark bg found' }
  }
  
  // Extract the numbers
  const numberElements = Array.from(counterSection.querySelectorAll('*')).filter(el => {
    const styles = window.getComputedStyle(el)
    const fontSize = parseInt(styles.fontSize)
    return fontSize > 100 && el.offsetHeight > 100
  })
  
  return {
    found: true,
    numberCount: numberElements.length,
    numbers: numberElements.map(el => ({
      text: el.textContent.trim(),
      fontSize: window.getComputedStyle(el).fontSize,
    })),
    hasQuote: counterSection.textContent.includes('Response times') || 
              counterSection.textContent.includes('hours to minutes'),
  }
})

console.log('Counter Wall Analysis:')
console.log('  Section found:', counterWallCheck.found)
if (counterWallCheck.found) {
  console.log('  Large number elements:', counterWallCheck.numberCount)
  console.log('  Numbers:')
  counterWallCheck.numbers.forEach(n => {
    console.log(`    - "${n.text}" (${n.fontSize})`)
  })
  console.log('  Has testimonial quote:', counterWallCheck.hasQuote)
} else {
  console.log('  Reason:', counterWallCheck.reason)
}

// Try to scroll to counter wall
await page.evaluate(() => {
  const text = document.body.textContent
  if (text.includes('50+') || text.includes('90%')) {
    const el = Array.from(document.querySelectorAll('*')).find(e => 
      e.textContent.includes('50+') || e.textContent.includes('90%')
    )
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})

await page.waitForTimeout(2000)

await page.screenshot({ path: `${OUTPUT}/04-counter-wall-area.png` })
console.log('✓ Screenshot: Counter Wall area')

console.log(`\n✨ Section check complete. Screenshots: ${OUTPUT}/`)

await browser.close()
