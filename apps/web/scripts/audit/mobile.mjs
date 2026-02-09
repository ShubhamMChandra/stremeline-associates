/**
 * MOBILE AUDIT — iPhone 16 + Galaxy S24, Chrome + Safari
 * Checks: horizontal overflow, touch targets, screenshots
 * Prerequisites: pnpm dev running on port 3000, npx playwright install chromium webkit
 * Run: node scripts/audit/mobile.mjs
 */
import { chromium, webkit } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots'
fs.mkdirSync(OUTPUT, { recursive: true })

const viewports = [
  { name: 'iphone-16', width: 393, height: 852, scale: 3 },
  { name: 'galaxy-s24', width: 360, height: 780, scale: 3 },
]

const engines = [
  { name: 'chrome', launcher: chromium },
  { name: 'safari', launcher: webkit },
]

const issues = []

for (const engine of engines) {
  const browser = await engine.launcher.launch()

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.scale,
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()

    console.log(`\nMobile audit: ${engine.name} / ${vp.name} (${vp.width}x${vp.height})`)

    await page.goto('http://localhost:3001')
    await page.waitForTimeout(2500)

    // Screenshot
    const filename = `mobile-${engine.name}-${vp.name}.png`
    await page.screenshot({ path: `${OUTPUT}/${filename}`, fullPage: true })
    console.log(`  Screenshot: ${filename}`)

    // Horizontal overflow check
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    if (overflow > 0) {
      issues.push(`${engine.name}/${vp.name}: Horizontal overflow of ${overflow}px`)
    }
    console.log(`  Horizontal overflow: ${overflow}px ${overflow > 0 ? 'FAIL' : 'OK'}`)

    // Touch target check
    const smallTargets = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button, [role="button"]')
      const small = []
      elements.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.height > 0 && rect.height < 44 && rect.width > 0) {
          small.push({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 30),
            height: Math.round(rect.height),
            width: Math.round(rect.width),
          })
        }
      })
      return small
    })
    if (smallTargets.length > 0) {
      console.log(`  Touch targets < 44px: ${smallTargets.length}`)
      smallTargets.forEach(t => {
        console.log(`    - <${t.tag}> "${t.text}" (${t.width}x${t.height})`)
        issues.push(`${engine.name}/${vp.name}: Touch target too small: <${t.tag}> "${t.text}" ${t.height}px`)
      })
    } else {
      console.log(`  Touch targets: all OK`)
    }

    await context.close()
  }
  await browser.close()
}

// Summary
console.log('\n' + '='.repeat(50))
if (issues.length === 0) {
  console.log('All checks passed.')
} else {
  console.log(`Found ${issues.length} issues:`)
  issues.forEach(i => console.log(`  - ${i}`))
}
console.log(`\nScreenshots: ${OUTPUT}/`)
