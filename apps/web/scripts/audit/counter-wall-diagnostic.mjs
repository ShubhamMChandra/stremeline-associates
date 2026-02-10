/**
 * COUNTER WALL DIAGNOSTIC — Find and inspect the section
 * Prerequisites: dev server running on port 3001
 * Run: node scripts/audit/counter-wall-diagnostic.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots/counter-wall-diagnostic'
fs.mkdirSync(OUTPUT, { recursive: true })

console.log('🔍 Counter Wall Diagnostic Check\n')

const browser = await chromium.launch()
const page = await browser.newPage({ 
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2
})

console.log('Loading http://localhost:3001...')
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' })

console.log('Waiting 30 seconds for compilation...')
await page.waitForTimeout(30000)

console.log('Running diagnostic JavaScript...\n')

// Run the diagnostic script
const diagnostic = await page.evaluate(() => {
  const results = []
  
  document.querySelectorAll('section').forEach((s, i) => {
    const text = s.textContent
    
    // Look for Counter Wall indicators
    if (text.includes('hours reclaimed') || 
        text.includes('fewer data-entry') ||
        text.includes('50+') ||
        text.includes('90%') ||
        text.includes('fewer manual errors') ||
        text.includes('hours saved per month')) {
      
      const styles = getComputedStyle(s)
      
      results.push({
        index: i,
        offsetTop: s.offsetTop,
        offsetHeight: s.offsetHeight,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
        zIndex: styles.zIndex,
        position: styles.position,
        textPreview: text.substring(0, 200).replace(/\s+/g, ' '),
      })
    }
  })
  
  return results
})

console.log('━━━ DIAGNOSTIC RESULTS ━━━\n')

if (diagnostic.length === 0) {
  console.log('❌ No Counter Wall section found!')
  console.log('   Searched for: "hours reclaimed", "fewer data-entry", "50+", "90%"')
} else {
  diagnostic.forEach((result, idx) => {
    console.log(`Found Counter Wall candidate #${idx + 1}:`)
    console.log(`  Section index: ${result.index}`)
    console.log(`  offsetTop: ${result.offsetTop}px`)
    console.log(`  offsetHeight: ${result.offsetHeight}px`)
    console.log(`  display: ${result.display}`)
    console.log(`  visibility: ${result.visibility}`)
    console.log(`  opacity: ${result.opacity}`)
    console.log(`  backgroundColor: ${result.backgroundColor}`)
    console.log(`  zIndex: ${result.zIndex}`)
    console.log(`  position: ${result.position}`)
    console.log(`  Text preview: "${result.textPreview}..."`)
    console.log('')
  })
}

// Take screenshot at current position (top of page)
await page.screenshot({ path: `${OUTPUT}/01-page-top.png` })
console.log('✓ Screenshot: Page top')

// If we found a Counter Wall section, scroll to it
if (diagnostic.length > 0) {
  const counterWall = diagnostic[0]
  
  console.log(`\nScrolling to Counter Wall section at offsetTop: ${counterWall.offsetTop}px...\n`)
  
  await page.evaluate((top) => {
    window.scrollTo(0, top)
  }, counterWall.offsetTop)
  
  await page.waitForTimeout(2000)
  
  await page.screenshot({ path: `${OUTPUT}/02-counter-wall-at-offsetTop.png` })
  console.log('✓ Screenshot: At Counter Wall offsetTop position')
  
  // Try scrolling 200px before the section
  await page.evaluate((top) => {
    window.scrollTo(0, Math.max(0, top - 200))
  }, counterWall.offsetTop)
  
  await page.waitForTimeout(1500)
  
  await page.screenshot({ path: `${OUTPUT}/03-counter-wall-200px-before.png` })
  console.log('✓ Screenshot: 200px before Counter Wall')
  
  // Try scrolling 200px after the section
  await page.evaluate((top, height) => {
    window.scrollTo(0, top + height + 200)
  }, counterWall.offsetTop, counterWall.offsetHeight)
  
  await page.waitForTimeout(1500)
  
  await page.screenshot({ path: `${OUTPUT}/04-counter-wall-200px-after.png` })
  console.log('✓ Screenshot: 200px after Counter Wall')
}

// Look for large numbers on the page
console.log('\n━━━ SEARCHING FOR LARGE NUMBERS ━━━\n')

const largeNumbers = await page.evaluate(() => {
  const results = []
  
  document.querySelectorAll('*').forEach(el => {
    const text = el.textContent.trim()
    const fontSize = parseInt(getComputedStyle(el).fontSize)
    
    // Look for large numbers like "50+", "90%", "1"
    if ((text === '50+' || text === '90%' || text === '1') && fontSize > 50) {
      const rect = el.getBoundingClientRect()
      const styles = getComputedStyle(el)
      
      results.push({
        text: text,
        fontSize: fontSize + 'px',
        offsetTop: el.offsetTop,
        visible: rect.width > 0 && rect.height > 0,
        display: styles.display,
        opacity: styles.opacity,
        color: styles.color,
      })
    }
  })
  
  return results
})

if (largeNumbers.length === 0) {
  console.log('❌ No large number elements found')
} else {
  console.log('Large number elements found:')
  largeNumbers.forEach((num, i) => {
    console.log(`  ${i + 1}. "${num.text}" - ${num.fontSize}, display: ${num.display}, opacity: ${num.opacity}, visible: ${num.visible}`)
  })
}

console.log(`\n✨ Diagnostic complete. Screenshots: ${OUTPUT}/`)

await browser.close()
