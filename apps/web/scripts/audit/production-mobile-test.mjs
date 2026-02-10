/**
 * PRODUCTION MOBILE TEST — Test mobile experience on live site
 * Checks: layout, overflow, text readability, navigation, visual issues
 * Prerequisites: npx playwright install chromium
 * Run: node scripts/audit/production-mobile-test.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './screenshots/mobile-test'
fs.mkdirSync(OUTPUT, { recursive: true })

const BASE_URL = 'https://stremeline-associates-sam-chands-projects.vercel.app'

// iPhone-like viewport
const viewport = { width: 375, height: 812 }

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/about', name: 'about' },
  { path: '/services', name: 'services' },
  { path: '/contact', name: 'contact' },
]

const issues = []

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
})
const page = await context.newPage()

console.log(`\n${'='.repeat(60)}`)
console.log('PRODUCTION MOBILE TEST')
console.log(`Viewport: ${viewport.width}x${viewport.height} (iPhone-like)`)
console.log(`Base URL: ${BASE_URL}`)
console.log('='.repeat(60))

for (const pageInfo of pages) {
  const url = `${BASE_URL}${pageInfo.path}`
  console.log(`\n\n📱 Testing: ${pageInfo.name.toUpperCase()} (${pageInfo.path})`)
  console.log('-'.repeat(60))

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2000) // Wait for animations

    // 1. HORIZONTAL OVERFLOW CHECK
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        bodyClientWidth: document.body.clientWidth,
      }
    })
    const horizontalOverflow = overflow.scrollWidth - overflow.clientWidth
    console.log(`\n✓ Horizontal Overflow Check:`)
    console.log(`  Document: ${overflow.scrollWidth}px scroll / ${overflow.clientWidth}px client`)
    console.log(`  Overflow: ${horizontalOverflow}px ${horizontalOverflow > 0 ? '❌ FAIL' : '✅ OK'}`)
    if (horizontalOverflow > 0) {
      issues.push(`${pageInfo.name}: Horizontal overflow of ${horizontalOverflow}px`)
    }

    // 2. TEXT READABILITY CHECK
    const textIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li')
      const small = []
      elements.forEach(el => {
        const styles = window.getComputedStyle(el)
        const fontSize = parseFloat(styles.fontSize)
        const text = el.textContent?.trim()
        if (text && text.length > 0 && fontSize < 14 && el.offsetParent !== null) {
          small.push({
            tag: el.tagName,
            text: text.slice(0, 40),
            fontSize: Math.round(fontSize),
          })
        }
      })
      return small.slice(0, 10) // Limit to first 10
    })
    console.log(`\n✓ Text Readability Check:`)
    if (textIssues.length > 0) {
      console.log(`  Found ${textIssues.length} elements with font-size < 14px:`)
      textIssues.forEach(t => {
        console.log(`    - <${t.tag}> "${t.text}" (${t.fontSize}px)`)
      })
      issues.push(`${pageInfo.name}: ${textIssues.length} text elements smaller than 14px`)
    } else {
      console.log(`  All text is readable (≥14px) ✅`)
    }

    // 3. NAVIGATION CHECK
    const navCheck = await page.evaluate(() => {
      const nav = document.querySelector('nav')
      const hamburger = document.querySelector('[aria-label*="menu" i], [aria-label*="navigation" i], button[aria-expanded]')
      const mobileMenu = document.querySelector('[role="dialog"], [data-mobile-menu]')
      return {
        hasNav: !!nav,
        hasHamburger: !!hamburger,
        hasMobileMenu: !!mobileMenu,
        hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false,
      }
    })
    console.log(`\n✓ Navigation Check:`)
    console.log(`  Has <nav>: ${navCheck.hasNav ? '✅' : '❌'}`)
    console.log(`  Has hamburger button: ${navCheck.hasHamburger ? '✅' : '❌'}`)
    console.log(`  Hamburger visible: ${navCheck.hamburgerVisible ? '✅' : '❌'}`)
    if (!navCheck.hasHamburger || !navCheck.hamburgerVisible) {
      issues.push(`${pageInfo.name}: Mobile navigation issue (no visible hamburger menu)`)
    }

    // 4. TOUCH TARGET CHECK
    const smallTargets = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button, [role="button"], [onclick]')
      const small = []
      elements.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.height > 0 && rect.height < 44 && rect.width > 0 && el.offsetParent !== null) {
          small.push({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 30),
            height: Math.round(rect.height),
            width: Math.round(rect.width),
          })
        }
      })
      return small.slice(0, 10) // Limit to first 10
    })
    console.log(`\n✓ Touch Target Check:`)
    if (smallTargets.length > 0) {
      console.log(`  Found ${smallTargets.length} touch targets < 44px:`)
      smallTargets.forEach(t => {
        console.log(`    - <${t.tag}> "${t.text}" (${t.width}x${t.height}px)`)
      })
      issues.push(`${pageInfo.name}: ${smallTargets.length} touch targets smaller than 44px`)
    } else {
      console.log(`  All touch targets are adequate (≥44px) ✅`)
    }

    // 5. ELEMENT OVERLAP CHECK
    const overlapIssues = await page.evaluate(() => {
      const issues = []
      const elements = Array.from(document.querySelectorAll('section, header, footer, main, nav'))
      for (let i = 0; i < elements.length - 1; i++) {
        const rect1 = elements[i].getBoundingClientRect()
        const rect2 = elements[i + 1].getBoundingClientRect()
        if (rect1.bottom > rect2.top + 10) { // Allow 10px tolerance
          issues.push({
            el1: elements[i].tagName + (elements[i].id ? `#${elements[i].id}` : ''),
            el2: elements[i + 1].tagName + (elements[i + 1].id ? `#${elements[i + 1].id}` : ''),
            overlap: Math.round(rect1.bottom - rect2.top),
          })
        }
      }
      return issues
    })
    console.log(`\n✓ Element Overlap Check:`)
    if (overlapIssues.length > 0) {
      console.log(`  Found ${overlapIssues.length} potential overlaps:`)
      overlapIssues.forEach(o => {
        console.log(`    - ${o.el1} overlaps ${o.el2} by ${o.overlap}px`)
      })
      issues.push(`${pageInfo.name}: ${overlapIssues.length} element overlaps detected`)
    } else {
      console.log(`  No overlapping elements detected ✅`)
    }

    // 6. SCREENSHOT - Full page
    const filename = `${pageInfo.name}-full.png`
    await page.screenshot({ path: `${OUTPUT}/${filename}`, fullPage: true })
    console.log(`\n✓ Screenshot saved: ${filename}`)

    // 7. SCREENSHOT - Above the fold
    const filenameAtf = `${pageInfo.name}-atf.png`
    await page.screenshot({ path: `${OUTPUT}/${filenameAtf}`, fullPage: false })
    console.log(`✓ Screenshot saved: ${filenameAtf}`)

    // 8. For homepage, scroll through sections
    if (pageInfo.path === '/') {
      console.log(`\n✓ Scrolling through homepage sections...`)
      const sections = await page.evaluate(() => {
        const sectionElements = document.querySelectorAll('section, [data-section]')
        return Array.from(sectionElements).map((el, i) => ({
          index: i,
          id: el.id || `section-${i}`,
          offsetTop: el.offsetTop,
        }))
      })
      
      for (const section of sections.slice(0, 5)) { // First 5 sections
        await page.evaluate((top) => window.scrollTo(0, top), section.offsetTop)
        await page.waitForTimeout(1000)
        const sectionFilename = `homepage-section-${section.index}-${section.id}.png`
        await page.screenshot({ path: `${OUTPUT}/${sectionFilename}`, fullPage: false })
        console.log(`  Section ${section.index} (${section.id}): ${sectionFilename}`)
      }
      
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(500)
    }

  } catch (error) {
    console.error(`\n❌ ERROR testing ${pageInfo.name}:`, error.message)
    issues.push(`${pageInfo.name}: Failed to load or test - ${error.message}`)
  }
}

await browser.close()

// FINAL SUMMARY
console.log(`\n\n${'='.repeat(60)}`)
console.log('SUMMARY')
console.log('='.repeat(60))

if (issues.length === 0) {
  console.log('\n✅ All mobile checks passed! No issues found.')
} else {
  console.log(`\n❌ Found ${issues.length} issues:\n`)
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`)
  })
}

console.log(`\n📸 Screenshots saved to: ${OUTPUT}/`)
console.log('='.repeat(60))
