/**
 * TARGETED FIX VERIFICATION — Problem section, Capabilities, Use Cases
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/verify-fixes.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/verify-fixes'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🎯 Verifying specific fixes...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3500)

const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`📏 Page height: ${pageHeight}px\n`)

// Targeted checkpoints for the three fixes
const checkpoints = [
  { 
    name: '01-hero-baseline', 
    scrollY: 0, 
    wait: 2000,
    description: 'Hero section baseline',
  },
  { 
    name: '02-problem-section-full', 
    scrollY: 850, 
    wait: 2500,
    description: '🎯 FIX #1: Problem section - Before/After cards side by side',
    critical: true
  },
  { 
    name: '03-problem-section-close', 
    scrollY: 1100, 
    wait: 2000,
    description: '🎯 FIX #1: Problem section cards detail',
    critical: true
  },
  { 
    name: '04-transition-to-capabilities', 
    scrollY: 2700, 
    wait: 1500,
    description: 'Gradient transition to capabilities',
  },
  { 
    name: '05-capabilities-heading', 
    scrollY: 3000, 
    wait: 2500,
    description: '🎯 FIX #2: Capabilities - "What We Automate" heading',
    critical: true
  },
  { 
    name: '06-capabilities-cards-top', 
    scrollY: 3350, 
    wait: 2500,
    description: '🎯 FIX #2: Capabilities cards VISIBLE on light bg',
    critical: true
  },
  { 
    name: '07-capabilities-cards-all', 
    scrollY: 3750, 
    wait: 2500,
    description: '🎯 FIX #2: All capabilities cards',
    critical: true
  },
  { 
    name: '08-counter-wall', 
    scrollY: 5000, 
    wait: 2000,
    description: 'Counter Wall section',
  },
  { 
    name: '09-transition-to-use-cases', 
    scrollY: 6600, 
    wait: 1500,
    description: 'Gradient transition to use cases',
  },
  { 
    name: '10-use-cases-start', 
    scrollY: 7000, 
    wait: 2500,
    description: '🎯 FIX #3: Use Cases - Clean vertical list start',
    critical: true
  },
  { 
    name: '11-use-cases-items-1-2', 
    scrollY: 7500, 
    wait: 2500,
    description: '🎯 FIX #3: Use Cases items 01-02',
    critical: true
  },
  { 
    name: '12-use-cases-items-3-4', 
    scrollY: 8200, 
    wait: 2500,
    description: '🎯 FIX #3: Use Cases items 03-04',
    critical: true
  },
  { 
    name: '13-cta-section', 
    scrollY: 'bottom-offset-800', 
    wait: 1500,
    description: 'CTA section',
  },
]

console.log('📸 Capturing verification screenshots...\n')

for (const checkpoint of checkpoints) {
  if (checkpoint.scrollY === 'bottom') {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  } else if (typeof checkpoint.scrollY === 'string' && checkpoint.scrollY.startsWith('bottom-offset-')) {
    const offset = parseInt(checkpoint.scrollY.split('-')[2])
    await page.evaluate((offset) => window.scrollTo(0, document.body.scrollHeight - offset), offset)
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), checkpoint.scrollY)
  }
  
  await page.waitForTimeout(checkpoint.wait)
  
  await page.screenshot({ 
    path: `${OUTPUT}/${checkpoint.name}.png` 
  })
  
  const icon = checkpoint.critical ? '🎯' : '✅'
  console.log(`${icon} ${checkpoint.name}`)
  console.log(`   ${checkpoint.description}`)
}

// Detailed measurements for verification
console.log('\n🔍 Measuring critical elements...\n')

// Check Problem section structure
await page.evaluate(() => window.scrollTo(0, 950))
await page.waitForTimeout(1500)

const problemSection = await page.evaluate(() => {
  const problemSection = document.querySelector('[data-problem-section]') || 
                          document.querySelector('section:has(.text-\\[4\\.3\\])') ||
                          Array.from(document.querySelectorAll('section')).find(s => 
                            s.textContent.includes('4.3 hours') || s.textContent.includes('12 min')
                          )
  
  if (!problemSection) return null
  
  return {
    found: true,
    textContent: problemSection.textContent.substring(0, 200),
    childCount: problemSection.children.length,
  }
})

console.log('Problem Section:')
if (problemSection) {
  console.log(`  ✅ Found`)
  console.log(`  Children: ${problemSection.childCount}`)
  console.log(`  Text preview: ${problemSection.textContent}...`)
} else {
  console.log('  ❌ NOT FOUND')
}

// Check Capabilities cards
await page.evaluate(() => window.scrollTo(0, 3400))
await page.waitForTimeout(2000)

const capabilities = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-capability-card]')
  const section = document.querySelector('section.light') || 
                   document.querySelector('section.bg-background')
  
  if (cards.length === 0) return { found: false }
  
  const cardData = Array.from(cards).map(card => {
    const styles = window.getComputedStyle(card)
    const rect = card.getBoundingClientRect()
    return {
      opacity: styles.opacity,
      visible: rect.width > 0 && rect.height > 0,
      display: styles.display,
      transform: styles.transform,
    }
  })
  
  return {
    found: true,
    count: cards.length,
    cards: cardData,
    sectionBg: section ? window.getComputedStyle(section).backgroundColor : null,
  }
})

console.log('\nCapabilities Cards:')
if (capabilities.found) {
  console.log(`  ✅ Found ${capabilities.count} cards`)
  console.log(`  Section bg: ${capabilities.sectionBg}`)
  capabilities.cards.forEach((card, i) => {
    const status = parseFloat(card.opacity) > 0.5 && card.visible ? '✅' : '❌'
    console.log(`  ${status} Card ${i + 1}: opacity=${card.opacity}, visible=${card.visible}`)
  })
} else {
  console.log('  ❌ NOT FOUND')
}

// Check Use Cases structure
await page.evaluate(() => window.scrollTo(0, 7500))
await page.waitForTimeout(2000)

const useCases = await page.evaluate(() => {
  // Look for numbered items (01, 02, etc.)
  const items = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.textContent
    return /^0[1-4]/.test(text.trim()) && el.offsetHeight > 50
  })
  
  return {
    found: items.length > 0,
    count: items.length,
    type: items.length > 2 ? 'vertical-list' : 'pinned-panels',
  }
})

console.log('\nUse Cases Section:')
if (useCases.found) {
  console.log(`  ✅ Found ${useCases.count} numbered items`)
  console.log(`  Layout type: ${useCases.type}`)
} else {
  console.log('  ❌ NOT FOUND')
}

console.log(`\n✨ Verification complete. Screenshots: ${OUTPUT}/`)

await browser.close()
