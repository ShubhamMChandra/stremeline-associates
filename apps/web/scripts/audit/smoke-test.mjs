/**
 * SMOKE TEST — All pages quick check
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/smoke-test.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/smoke-test'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🔥 Running smoke test on all pages...\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

const pages = [
  { url: 'http://localhost:3001/', name: 'homepage', label: 'Homepage' },
  { url: 'http://localhost:3001/services', name: 'services', label: 'Services' },
  { url: 'http://localhost:3001/about', name: 'about', label: 'About' },
  { url: 'http://localhost:3001/contact', name: 'contact', label: 'Contact' },
  { url: 'http://localhost:3001/case-studies', name: 'case-studies', label: 'Case Studies' },
  { url: 'http://localhost:3001/blog', name: 'blog', label: 'Blog' },
]

const results = []

for (const pageInfo of pages) {
  console.log(`━━━ ${pageInfo.label.toUpperCase()} ━━━`)
  console.log(`Loading ${pageInfo.url}...`)
  
  try {
    const response = await page.goto(pageInfo.url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    })
    
    console.log('Waiting 15 seconds for compilation...')
    await page.waitForTimeout(15000)
    
    // Check for build errors
    const hasError = await page.evaluate(() => {
      const body = document.body.textContent || ''
      return body.includes('Build Error') || 
             body.includes('Module not found') ||
             body.includes('Error:') && document.querySelector('[data-nextjs-dialog-overlay]')
    })
    
    // Check if page has content
    const hasContent = await page.evaluate(() => {
      const body = document.body
      return body && body.innerText.length > 200
    })
    
    // Take screenshot
    await page.screenshot({ path: `${OUTPUT}/${pageInfo.name}.png` })
    
    const result = {
      page: pageInfo.label,
      url: pageInfo.url,
      status: response.status(),
      hasError,
      hasContent,
      pass: !hasError && hasContent && response.status() === 200,
    }
    
    results.push(result)
    
    if (result.pass) {
      console.log('✅ PASS')
    } else {
      console.log('❌ FAIL')
      if (hasError) console.log('   Error: Build error detected')
      if (!hasContent) console.log('   Error: No content (blank page)')
      if (response.status() !== 200) console.log(`   Error: HTTP ${response.status()}`)
    }
    
  } catch (error) {
    console.log('❌ FAIL')
    console.log(`   Error: ${error.message}`)
    results.push({
      page: pageInfo.label,
      url: pageInfo.url,
      pass: false,
      error: error.message,
    })
  }
  
  console.log('')
}

console.log('━━━ SUMMARY ━━━\n')

const passed = results.filter(r => r.pass).length
const failed = results.filter(r => !r.pass).length

results.forEach(r => {
  const icon = r.pass ? '✅' : '❌'
  console.log(`${icon} ${r.page}`)
})

console.log(`\n${passed}/${results.length} pages passed`)

if (failed > 0) {
  console.log(`${failed} pages failed`)
}

console.log(`\n✨ Smoke test complete. Screenshots: ${OUTPUT}/`)

await browser.close()
