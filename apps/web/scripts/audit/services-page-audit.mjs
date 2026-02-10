/**
 * SERVICES PAGE COMPREHENSIVE AUDIT
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/services-page-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/services-page'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🔍 Services Page Comprehensive Audit\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

console.log('Loading http://localhost:3001/services...')
await page.goto('http://localhost:3001/services', { waitUntil: 'networkidle' })

console.log('Waiting 35 seconds for compilation...')
await page.waitForTimeout(35000)

console.log('Page loaded. Starting audit...\n')

const pageHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`📏 Page height: ${pageHeight}px\n`)

// Checkpoints for all 5 sections
const checkpoints = [
  // SECTION 1: Hero
  { name: '01-hero-top', scrollY: 0, wait: 2500, section: 'HERO' },
  { name: '02-hero-bridge-line', scrollY: 400, wait: 2000, section: 'HERO' },
  
  // SECTION 2: Services Deep-Dive (LIGHT)
  { name: '03-services-heading', scrollY: 750, wait: 2000, section: 'SERVICES DEEP-DIVE' },
  { name: '04-service-01', scrollY: 1100, wait: 2500, section: 'SERVICES DEEP-DIVE' },
  { name: '05-service-02', scrollY: 1700, wait: 2500, section: 'SERVICES DEEP-DIVE' },
  { name: '06-service-03', scrollY: 2300, wait: 2500, section: 'SERVICES DEEP-DIVE' },
  { name: '07-service-04', scrollY: 2900, wait: 2500, section: 'SERVICES DEEP-DIVE' },
  { name: '08-services-bottom', scrollY: 3500, wait: 2000, section: 'SERVICES DEEP-DIVE' },
  
  // SECTION 3: How We Work (DARK)
  { name: '09-how-we-work-top', scrollY: 4000, wait: 2500, section: 'HOW WE WORK' },
  { name: '10-how-we-work-grid', scrollY: 4500, wait: 2500, section: 'HOW WE WORK' },
  { name: '11-how-we-work-bottom', scrollY: 5100, wait: 2000, section: 'HOW WE WORK' },
  
  // SECTION 4: Proof Band (DARK)
  { name: '12-proof-band-numbers', scrollY: 5700, wait: 2500, section: 'PROOF BAND' },
  { name: '13-proof-band-quote', scrollY: 6200, wait: 2000, section: 'PROOF BAND' },
  
  // SECTION 5: CTA (DARK)
  { name: '14-cta-section', scrollY: 6800, wait: 2000, section: 'CTA' },
  { name: '15-cta-button', scrollY: 7200, wait: 1500, section: 'CTA' },
  
  // Footer
  { name: '16-footer', scrollY: 'bottom', wait: 1500, section: 'FOOTER' },
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

// Analyze section structure
console.log('\n🔍 Analyzing section structure...\n')

const sectionAnalysis = await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll('section'))
  
  return {
    totalSections: sections.length,
    sections: sections.map((s, i) => {
      const styles = getComputedStyle(s)
      const bg = styles.backgroundColor
      const isDark = bg.includes('10, 10, 11') || bg.includes('0, 0, 0') || bg === 'rgba(0, 0, 0, 0)'
      const isLight = bg.includes('250, 250, 249') || bg.includes('255, 255, 255')
      
      return {
        index: i,
        isDark,
        isLight,
        backgroundColor: bg,
        height: s.offsetHeight + 'px',
        hasNumbers: /\d{2}\+|\d{2}%/.test(s.textContent),
        textPreview: s.textContent.substring(0, 100).replace(/\s+/g, ' '),
      }
    })
  }
})

console.log(`Total sections: ${sectionAnalysis.totalSections}\n`)

sectionAnalysis.sections.forEach(s => {
  const theme = s.isDark ? 'DARK' : s.isLight ? 'LIGHT' : 'UNKNOWN'
  const marker = s.hasNumbers ? '📊' : '  '
  console.log(`${marker} Section ${s.index}: ${theme} (${s.height})`)
  console.log(`     "${s.textPreview}..."`)
})

console.log(`\n✨ Services page audit complete. Screenshots: ${OUTPUT}/`)

await browser.close()
