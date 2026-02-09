/**
 * DIAGNOSIS — Deep layout diagnostic at all viewports
 * Prerequisites: pnpm dev running on port 3000
 * Run: node scripts/audit/diagnosis.mjs
 */
import { chromium } from 'playwright'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'iphone-16', width: 393, height: 852 },
  { name: 'galaxy-s24', width: 360, height: 780 },
]

const sections = ['hero', 'capabilities', 'social-proof', 'use-cases', 'cta']
const issues = []

const browser = await chromium.launch()

for (const vp of viewports) {
  console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`)

  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto('http://localhost:3001')
  await page.waitForTimeout(2500)

  // Page-level horizontal overflow
  const pageOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  if (pageOverflow > 0) {
    issues.push(`${vp.name}: Page horizontal overflow ${pageOverflow}px`)
    console.log(`  PAGE OVERFLOW: ${pageOverflow}px`)
  }

  for (const sectionId of sections) {
    const sectionData = await page.evaluate((id) => {
      const el = document.getElementById(id)
      if (!el) return { found: false }

      const rect = el.getBoundingClientRect()
      const style = window.getComputedStyle(el)
      const overflow = el.scrollWidth - el.clientWidth

      // Check children extending beyond section
      let widestChild = 0
      el.querySelectorAll('*').forEach(child => {
        const childRect = child.getBoundingClientRect()
        if (childRect.right > rect.right + 1) {
          widestChild = Math.max(widestChild, childRect.right - rect.right)
        }
      })

      // Check headings
      const headings = []
      el.querySelectorAll('h1, h2, h3').forEach(h => {
        headings.push({
          tag: h.tagName,
          fontSize: window.getComputedStyle(h).fontSize,
          text: h.textContent?.trim().slice(0, 40),
        })
      })

      // Check touch targets (mobile)
      const smallTargets = []
      el.querySelectorAll('a, button, [role="button"]').forEach(t => {
        const tRect = t.getBoundingClientRect()
        if (tRect.height > 0 && tRect.height < 44) {
          smallTargets.push({
            text: t.textContent?.trim().slice(0, 30),
            height: Math.round(tRect.height),
          })
        }
      })

      return {
        found: true,
        visible: style.display !== 'none' && style.visibility !== 'hidden',
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        padding: style.padding,
        overflow: Math.round(overflow),
        childOverflow: Math.round(widestChild),
        overflowHidden: style.overflow === 'hidden' || style.overflowX === 'hidden',
        headings,
        smallTargets,
      }
    }, sectionId)

    if (!sectionData.found) {
      issues.push(`${vp.name}/#${sectionId}: Section not found`)
      console.log(`  #${sectionId}: NOT FOUND`)
      continue
    }

    console.log(`\n  #${sectionId}: ${sectionData.width}x${sectionData.height} | overflow: ${sectionData.overflow}px | overflow-hidden: ${sectionData.overflowHidden}`)

    if (!sectionData.visible) {
      issues.push(`${vp.name}/#${sectionId}: Not visible`)
    }
    if (sectionData.overflow > 0) {
      issues.push(`${vp.name}/#${sectionId}: Section overflow ${sectionData.overflow}px`)
    }
    if (sectionData.childOverflow > 0 && !sectionData.overflowHidden) {
      issues.push(`${vp.name}/#${sectionId}: Child element overflows by ${sectionData.childOverflow}px without overflow-hidden`)
    }
    if (sectionData.headings.length > 0) {
      sectionData.headings.forEach(h => {
        console.log(`    ${h.tag}: "${h.text}" (${h.fontSize})`)
      })
    }
    if (sectionData.smallTargets.length > 0 && vp.width < 500) {
      sectionData.smallTargets.forEach(t => {
        issues.push(`${vp.name}/#${sectionId}: Touch target "${t.text}" only ${t.height}px tall`)
        console.log(`    Touch target: "${t.text}" ${t.height}px`)
      })
    }
  }

  await page.close()
}

await browser.close()

// Summary
console.log('\n' + '='.repeat(50))
console.log('DIAGNOSIS SUMMARY')
console.log('='.repeat(50))
if (issues.length === 0) {
  console.log('0 issues. Clean.')
} else {
  console.log(`${issues.length} issues found:`)
  issues.forEach(i => console.log(`  - ${i}`))
}
