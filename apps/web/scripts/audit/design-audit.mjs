/**
 * DETAILED DESIGN AUDIT — Spacing, typography, and layout precision
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/design-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/design-audit'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🎨 Starting detailed design audit...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3000)

// Get full page height for reference
const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`📏 Page height: ${pageHeight}px\n`)

// Define precise checkpoints for design review
const checkpoints = [
  { 
    name: '01-hero-above-fold', 
    scrollY: 0, 
    wait: 2500,
    description: 'Hero section - above the fold',
  },
  { 
    name: '02-hero-stats-bar', 
    scrollY: 700, 
    wait: 1000,
    description: 'Stat bar and transition area',
  },
  { 
    name: '03-problem-scroll-start', 
    scrollY: 950, 
    wait: 1500,
    description: 'Problem Scroll - "Your team\'s day" heading',
  },
  { 
    name: '04-problem-scroll-cards', 
    scrollY: 1200, 
    wait: 1500,
    description: 'Problem Scroll - task cards grid',
  },
  { 
    name: '05-problem-scroll-after', 
    scrollY: 2100, 
    wait: 1500,
    description: 'Problem Scroll - "After Stremeline" section',
  },
  { 
    name: '06-gradient-dark-to-light', 
    scrollY: 2900, 
    wait: 1200,
    description: 'Gradient transition: dark → light',
  },
  { 
    name: '07-capabilities-heading', 
    scrollY: 3400, 
    wait: 2000,
    description: 'Capabilities section heading (light bg)',
  },
  { 
    name: '08-capabilities-cards', 
    scrollY: 3800, 
    wait: 2000,
    description: 'Capabilities cards grid',
  },
  { 
    name: '09-capabilities-bottom', 
    scrollY: 4600, 
    wait: 1500,
    description: 'Bottom of capabilities section',
  },
  { 
    name: '10-gradient-light-to-dark', 
    scrollY: 5000, 
    wait: 1200,
    description: 'Gradient transition: light → dark',
  },
  { 
    name: '11-counter-wall-top', 
    scrollY: 5400, 
    wait: 2000,
    description: 'Counter Wall - serif heading',
  },
  { 
    name: '12-counter-wall-numbers', 
    scrollY: 5900, 
    wait: 2000,
    description: 'Counter Wall - big numbers',
  },
  { 
    name: '13-counter-wall-testimonial', 
    scrollY: 6400, 
    wait: 1500,
    description: 'Counter Wall - testimonial quote',
  },
  { 
    name: '14-gradient-dark-to-light-2', 
    scrollY: 7000, 
    wait: 1200,
    description: 'Gradient transition: dark → light (before Use Cases)',
  },
  { 
    name: '15-use-cases-heading', 
    scrollY: 7600, 
    wait: 1500,
    description: 'Use Cases - section heading',
  },
  { 
    name: '16-use-cases-cards-top', 
    scrollY: 8200, 
    wait: 1500,
    description: 'Use Cases - first cards',
  },
  { 
    name: '17-use-cases-cards-bottom', 
    scrollY: 8900, 
    wait: 1500,
    description: 'Use Cases - more cards',
  },
  { 
    name: '18-gradient-light-to-dark-2', 
    scrollY: 9600, 
    wait: 1200,
    description: 'Gradient transition: light → dark (before CTA)',
  },
  { 
    name: '19-cta-testimonial', 
    scrollY: 10200, 
    wait: 1500,
    description: 'CTA section - testimonial',
  },
  { 
    name: '20-cta-hero', 
    scrollY: 'bottom-offset-800', 
    wait: 1500,
    description: 'CTA hero - "Two weeks from now" section',
  },
  { 
    name: '21-footer-top', 
    scrollY: 'bottom-offset-400', 
    wait: 1000,
    description: 'Footer - top section',
  },
  { 
    name: '22-footer-bottom', 
    scrollY: 'bottom', 
    wait: 1000,
    description: 'Footer - bottom with copyright',
  },
]

console.log('📸 Capturing design checkpoints...\n')

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
  
  await page.waitForTimeout(checkpoint.wait)
  
  // Take screenshot
  await page.screenshot({ 
    path: `${OUTPUT}/${checkpoint.name}.png` 
  })
  
  console.log(`✅ ${checkpoint.name}`)
  console.log(`   ${checkpoint.description}`)
  console.log('')
}

// Capture computed styles for key elements
console.log('🔍 Analyzing typography and spacing...\n')

await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(1000)

const styleAnalysis = await page.evaluate(() => {
  const getComputedStyle = (selector) => {
    const el = document.querySelector(selector)
    if (!el) return null
    const styles = window.getComputedStyle(el)
    return {
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
    }
  }

  return {
    h1: getComputedStyle('h1'),
    h2: getComputedStyle('h2'),
    h3: getComputedStyle('h3'),
    bodyText: getComputedStyle('p'),
    button: getComputedStyle('button'),
  }
})

console.log('Typography Analysis:')
console.log('-------------------')
if (styleAnalysis.h1) {
  console.log(`H1: ${styleAnalysis.h1.fontSize} / ${styleAnalysis.h1.lineHeight}`)
}
if (styleAnalysis.h2) {
  console.log(`H2: ${styleAnalysis.h2.fontSize} / ${styleAnalysis.h2.lineHeight}`)
}
if (styleAnalysis.h3) {
  console.log(`H3: ${styleAnalysis.h3.fontSize} / ${styleAnalysis.h3.lineHeight}`)
}
if (styleAnalysis.bodyText) {
  console.log(`Body: ${styleAnalysis.bodyText.fontSize} / ${styleAnalysis.bodyText.lineHeight}`)
}

console.log(`\n✨ Design audit complete. Screenshots saved to: ${OUTPUT}/`)

await browser.close()
