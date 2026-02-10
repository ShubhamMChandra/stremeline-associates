/**
 * COMPREHENSIVE VISUAL QA AUDIT — Every section, every detail
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/visual-qa.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/visual-qa'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🔬 Starting comprehensive visual QA audit...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

await page.goto('http://localhost:3001')
await page.waitForTimeout(3500)

const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`📏 Page height: ${pageHeight}px\n`)

// Comprehensive checkpoints covering every visual element
const checkpoints = [
  // HERO SECTION
  { 
    name: '01-hero-top', 
    scrollY: 0, 
    wait: 2500,
    section: 'HERO',
    description: 'Hero top - headline, subtitle, terminal',
  },
  { 
    name: '02-hero-buttons-stats', 
    scrollY: 500, 
    wait: 1500,
    section: 'HERO',
    description: 'Hero buttons and stats bar',
  },
  
  // PROBLEM SECTION
  { 
    name: '03-problem-section-top', 
    scrollY: 750, 
    wait: 2000,
    section: 'PROBLEM',
    description: 'Problem section heading area',
  },
  { 
    name: '04-problem-cards-full', 
    scrollY: 900, 
    wait: 2500,
    section: 'PROBLEM',
    description: 'Problem cards - TODAY vs WITH STREMELINE',
  },
  { 
    name: '05-problem-cards-detail', 
    scrollY: 1100, 
    wait: 2000,
    section: 'PROBLEM',
    description: 'Problem cards detail - task breakdowns',
  },
  
  // GRADIENT TRANSITION #1
  { 
    name: '06-gradient-dark-to-light-1', 
    scrollY: 2700, 
    wait: 1500,
    section: 'GRADIENT #1',
    description: 'Gradient transition: dark → light (before Capabilities)',
  },
  
  // CAPABILITIES SECTION
  { 
    name: '07-capabilities-heading', 
    scrollY: 2950, 
    wait: 2000,
    section: 'CAPABILITIES',
    description: 'Capabilities section heading on light bg',
  },
  { 
    name: '08-capabilities-cards-top', 
    scrollY: 3250, 
    wait: 2500,
    section: 'CAPABILITIES',
    description: 'Capabilities cards - first row',
  },
  { 
    name: '09-capabilities-cards-bottom', 
    scrollY: 3600, 
    wait: 2000,
    section: 'CAPABILITIES',
    description: 'Capabilities cards - complete grid',
  },
  
  // GRADIENT TRANSITION #2
  { 
    name: '10-gradient-light-to-dark-1', 
    scrollY: 4400, 
    wait: 1500,
    section: 'GRADIENT #2',
    description: 'Gradient transition: light → dark (before Counter Wall)',
  },
  
  // COUNTER WALL SECTION
  { 
    name: '11-counter-wall-top', 
    scrollY: 4700, 
    wait: 2000,
    section: 'COUNTER WALL',
    description: 'Counter Wall - big numbers',
  },
  { 
    name: '12-counter-wall-quote', 
    scrollY: 5200, 
    wait: 2000,
    section: 'COUNTER WALL',
    description: 'Counter Wall - testimonial quote',
  },
  
  // GRADIENT TRANSITION #3
  { 
    name: '13-gradient-dark-to-light-2', 
    scrollY: 6500, 
    wait: 1500,
    section: 'GRADIENT #3',
    description: 'Gradient transition: dark → light (before Use Cases)',
  },
  
  // USE CASES SECTION
  { 
    name: '14-use-cases-heading', 
    scrollY: 6850, 
    wait: 2000,
    section: 'USE CASES',
    description: 'Use Cases section heading',
  },
  { 
    name: '15-use-cases-items-1-2', 
    scrollY: 7250, 
    wait: 2500,
    section: 'USE CASES',
    description: 'Use Cases items 01-02',
  },
  { 
    name: '16-use-cases-items-3-4', 
    scrollY: 7850, 
    wait: 2500,
    section: 'USE CASES',
    description: 'Use Cases items 03-04',
  },
  { 
    name: '17-use-cases-item-5', 
    scrollY: 8450, 
    wait: 2000,
    section: 'USE CASES',
    description: 'Use Cases item 05',
  },
  
  // GRADIENT TRANSITION #4
  { 
    name: '18-gradient-light-to-dark-2', 
    scrollY: 9100, 
    wait: 1500,
    section: 'GRADIENT #4',
    description: 'Gradient transition: light → dark (before CTA)',
  },
  
  // CTA SECTION
  { 
    name: '19-cta-hero', 
    scrollY: 9500, 
    wait: 2000,
    section: 'CTA',
    description: 'CTA hero section - serif headline',
  },
  { 
    name: '20-cta-button', 
    scrollY: 9800, 
    wait: 1500,
    section: 'CTA',
    description: 'CTA button and transition to footer',
  },
  
  // FOOTER
  { 
    name: '21-footer-top', 
    scrollY: 'bottom-offset-400', 
    wait: 1500,
    section: 'FOOTER',
    description: 'Footer top section',
  },
  { 
    name: '22-footer-bottom', 
    scrollY: 'bottom', 
    wait: 1500,
    section: 'FOOTER',
    description: 'Footer bottom - copyright and tagline',
  },
]

console.log('📸 Capturing comprehensive QA screenshots...\n')

let currentSection = ''
for (const checkpoint of checkpoints) {
  if (checkpoint.section !== currentSection) {
    console.log(`\n━━━ ${checkpoint.section} ━━━`)
    currentSection = checkpoint.section
  }
  
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
  
  console.log(`✓ ${checkpoint.name} — ${checkpoint.description}`)
}

console.log(`\n✨ Visual QA audit complete. Screenshots: ${OUTPUT}/`)

await browser.close()
