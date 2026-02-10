/**
 * POST-FIX AUDIT — Verify spacing and visibility fixes
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/post-fix-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/post-fix-audit'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🔍 Starting post-fix audit...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3000)

const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`📏 Page height: ${pageHeight}px\n`)

// Critical checkpoints focusing on the fixed areas
const checkpoints = [
  { 
    name: '01-hero-full', 
    scrollY: 0, 
    wait: 2500,
    description: 'Hero section with stats bar',
  },
  { 
    name: '02-hero-stats-connection', 
    scrollY: 650, 
    wait: 1500,
    description: 'Hero stats bar connection point',
  },
  { 
    name: '03-problem-scroll-transition', 
    scrollY: 900, 
    wait: 1500,
    description: 'Problem scroll section start',
  },
  { 
    name: '04-gradient-dark-to-light', 
    scrollY: 2800, 
    wait: 1500,
    description: '🔴 CRITICAL: Dark→Light gradient (should be ~64-96px tall)',
  },
  { 
    name: '05-capabilities-section-top', 
    scrollY: 3100, 
    wait: 2500,
    description: '🔴 CRITICAL: Capabilities heading on LIGHT bg',
  },
  { 
    name: '06-capabilities-cards', 
    scrollY: 3500, 
    wait: 2500,
    description: '🔴 CRITICAL: Capabilities cards VISIBLE at opacity 1',
  },
  { 
    name: '07-capabilities-bottom', 
    scrollY: 4200, 
    wait: 1500,
    description: 'Bottom of capabilities section',
  },
  { 
    name: '08-gradient-light-to-dark', 
    scrollY: 4700, 
    wait: 1500,
    description: 'Light→Dark gradient (should be ~64-96px tall)',
  },
  { 
    name: '09-counter-wall-full', 
    scrollY: 5100, 
    wait: 2500,
    description: '🔴 CRITICAL: Counter Wall (NO min-h-screen)',
  },
  { 
    name: '10-counter-wall-compact', 
    scrollY: 5800, 
    wait: 2000,
    description: 'Counter Wall numbers (should feel compact)',
  },
  { 
    name: '11-gradient-dark-to-light-2', 
    scrollY: 6800, 
    wait: 1500,
    description: 'Dark→Light gradient before Use Cases',
  },
  { 
    name: '12-use-cases-heading', 
    scrollY: 7200, 
    wait: 2000,
    description: '🔴 CRITICAL: Use Cases heading',
  },
  { 
    name: '13-use-cases-cards-1', 
    scrollY: 7700, 
    wait: 2000,
    description: '🔴 CRITICAL: Use Cases card 01 (tight spacing)',
  },
  { 
    name: '14-use-cases-cards-2', 
    scrollY: 8200, 
    wait: 2000,
    description: '🔴 CRITICAL: Use Cases card 02 (NO 400-600px gaps)',
  },
  { 
    name: '15-use-cases-cards-3', 
    scrollY: 8700, 
    wait: 2000,
    description: 'Use Cases card 03',
  },
  { 
    name: '16-cta-section', 
    scrollY: 'bottom-offset-800', 
    wait: 1500,
    description: 'CTA hero section',
  },
  { 
    name: '17-footer', 
    scrollY: 'bottom', 
    wait: 1000,
    description: 'Footer',
  },
]

console.log('📸 Capturing checkpoints...\n')

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
  
  console.log(`✅ ${checkpoint.name}`)
  console.log(`   ${checkpoint.description}`)
}

// Measure specific elements
console.log('\n🔍 Measuring critical elements...\n')

await page.evaluate(() => window.scrollTo(0, 3200))
await page.waitForTimeout(2000)

const measurements = await page.evaluate(() => {
  const results = {}
  
  // Capabilities cards visibility
  const capCards = document.querySelectorAll('[data-capability-card]')
  if (capCards.length > 0) {
    const firstCard = capCards[0]
    const styles = window.getComputedStyle(firstCard)
    results.capabilitiesCards = {
      count: capCards.length,
      opacity: styles.opacity,
      display: styles.display,
      visibility: styles.visibility,
      transform: styles.transform,
    }
  }
  
  // Capabilities section background
  const capSection = document.querySelector('section.light, section.bg-background')
  if (capSection) {
    const styles = window.getComputedStyle(capSection)
    results.capabilitiesSection = {
      backgroundColor: styles.backgroundColor,
      height: capSection.offsetHeight + 'px',
      padding: styles.paddingTop + ' ' + styles.paddingBottom,
    }
  }
  
  // Gradient heights
  const gradients = Array.from(document.querySelectorAll('div[aria-hidden="true"]'))
    .filter(el => {
      const styles = window.getComputedStyle(el)
      return styles.background.includes('gradient')
    })
  
  results.gradients = gradients.map((g, i) => ({
    index: i,
    height: g.offsetHeight + 'px',
  }))
  
  return results
})

console.log('Capabilities Cards:')
if (measurements.capabilitiesCards) {
  console.log(`  Count: ${measurements.capabilitiesCards.count}`)
  console.log(`  Opacity: ${measurements.capabilitiesCards.opacity}`)
  console.log(`  Display: ${measurements.capabilitiesCards.display}`)
  console.log(`  Visibility: ${measurements.capabilitiesCards.visibility}`)
} else {
  console.log('  ❌ NOT FOUND')
}

console.log('\nCapabilities Section:')
if (measurements.capabilitiesSection) {
  console.log(`  Background: ${measurements.capabilitiesSection.backgroundColor}`)
  console.log(`  Height: ${measurements.capabilitiesSection.height}`)
  console.log(`  Padding: ${measurements.capabilitiesSection.padding}`)
} else {
  console.log('  ❌ NOT FOUND')
}

console.log('\nGradient Heights:')
measurements.gradients.forEach(g => {
  console.log(`  Gradient ${g.index}: ${g.height}`)
})

console.log(`\n✨ Post-fix audit complete. Screenshots: ${OUTPUT}/`)

await browser.close()
