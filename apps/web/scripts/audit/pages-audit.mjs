/**
 * PAGES AUDIT — Check all main pages for visual issues
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/pages-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/pages'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🎬 Starting pages audit...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

// Pages to audit
const pages = [
  { url: 'http://localhost:3001', name: 'homepage', description: 'Homepage' },
  { url: 'http://localhost:3001/services', name: 'services', description: 'Services page' },
  { url: 'http://localhost:3001/about', name: 'about', description: 'About page' },
  { url: 'http://localhost:3001/contact', name: 'contact', description: 'Contact page' },
  { url: 'http://localhost:3001/case-studies', name: 'case-studies', description: 'Case Studies page' },
  { url: 'http://localhost:3001/blog', name: 'blog', description: 'Blog page' },
]

const results = []

for (const pageInfo of pages) {
  console.log(`📸 Checking: ${pageInfo.description}`)
  
  try {
    const response = await page.goto(pageInfo.url, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    })
    
    await page.waitForTimeout(2000) // Let animations settle
    
    const result = {
      page: pageInfo.description,
      url: pageInfo.url,
      loaded: true,
      statusCode: response.status(),
      errors: [],
    }
    
    // Check for console errors
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Check for obvious layout issues
    const hasContent = await page.evaluate(() => {
      const body = document.body
      return body && body.innerText.length > 100
    })
    
    if (!hasContent) {
      result.errors.push('Page appears empty (< 100 chars)')
    }
    
    // Take full-page screenshot
    await page.screenshot({ 
      path: `${OUTPUT}/${pageInfo.name}-full.png`,
      fullPage: true 
    })
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: `${OUTPUT}/${pageInfo.name}-viewport.png` 
    })
    
    // Scroll to middle and bottom for additional checks
    const pageHeight = await page.evaluate(() => document.body.scrollHeight)
    
    if (pageHeight > 1200) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(1000)
      await page.screenshot({ 
        path: `${OUTPUT}/${pageInfo.name}-middle.png` 
      })
      
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)
      await page.screenshot({ 
        path: `${OUTPUT}/${pageInfo.name}-bottom.png` 
      })
    }
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
    
    results.push(result)
    console.log(`   ✅ Status: ${result.statusCode}`)
    if (result.errors.length > 0) {
      console.log(`   ⚠️  Issues: ${result.errors.join(', ')}`)
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    results.push({
      page: pageInfo.description,
      url: pageInfo.url,
      loaded: false,
      error: error.message
    })
  }
  
  console.log('')
}

// Homepage-specific checks
console.log('🔍 Running homepage-specific checks...\n')

await page.goto('http://localhost:3001')
await page.waitForTimeout(2500)

const homepageChecks = {
  'Hero terminal visible': await page.locator('[data-terminal]').isVisible().catch(() => false) ||
                           await page.locator('.terminal').isVisible().catch(() => false) ||
                           await page.locator('text=stremeline').first().isVisible().catch(() => false),
  'Scroll progress bar': await page.locator('[data-scroll-progress]').isVisible().catch(() => false) ||
                          await page.evaluate(() => {
                            const bar = document.querySelector('div[style*="position"][style*="fixed"][style*="top"]')
                            return bar && bar.offsetHeight <= 4 && bar.offsetHeight > 0
                          }),
  'Header navigation': await page.locator('nav').isVisible().catch(() => false) ||
                        await page.locator('header').isVisible().catch(() => false),
  'CTA buttons': await page.locator('button, a[href*="audit"], a[href*="contact"]').first().isVisible().catch(() => false),
}

console.log('Homepage Checks:')
for (const [check, passed] of Object.entries(homepageChecks)) {
  console.log(`${passed ? '✅' : '❌'} ${check}`)
}

console.log(`\n✨ Audit complete. Screenshots saved to: ${OUTPUT}/`)
console.log('\nSummary:')
results.forEach(r => {
  const status = r.loaded ? `✅ ${r.statusCode}` : '❌ FAILED'
  console.log(`  ${status} - ${r.page}`)
})

await browser.close()
