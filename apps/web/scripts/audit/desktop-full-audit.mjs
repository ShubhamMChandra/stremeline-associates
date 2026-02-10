/**
 * COMPREHENSIVE DESKTOP AUDIT — 1440x900
 * Checks: overflow, layout, spacing, font hierarchy, accessibility, clipping, gaps
 * Run: node scripts/audit/desktop-full-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots'
fs.mkdirSync(OUTPUT, { recursive: true })

const BASE_URL = 'http://localhost:3001'
const VIEWPORT = { width: 1440, height: 900 }

const sectionIds = ['hero', 'capabilities', 'social-proof', 'use-cases', 'cta']
const issues = []

function log(severity, section, message) {
  const entry = { severity, section, message }
  issues.push(entry)
  const icon = severity === 'CRITICAL' ? '🔴' : severity === 'WARNING' ? '🟡' : '🔵'
  console.log(`  ${icon} [${severity}] #${section}: ${message}`)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: VIEWPORT })

console.log('=== DESKTOP FULL AUDIT (1440x900) ===\n')

// Navigate and wait for content
await page.goto(BASE_URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000) // animations + lazy content

// ========================================
// 1. FULL PAGE SCREENSHOT
// ========================================
console.log('--- Full Page Screenshot ---')
await page.screenshot({ path: `${OUTPUT}/desktop-full-audit.png`, fullPage: true })
console.log(`  Saved: desktop-full-audit.png\n`)

// ========================================
// 2. PAGE-LEVEL OVERFLOW CHECK
// ========================================
console.log('--- Page-Level Overflow ---')
const pageOverflow = await page.evaluate(() => {
  const scrollW = document.documentElement.scrollWidth
  const clientW = document.documentElement.clientWidth
  return { scrollWidth: scrollW, clientWidth: clientW, overflow: scrollW - clientW }
})
if (pageOverflow.overflow > 0) {
  log('CRITICAL', 'page', `Horizontal overflow: ${pageOverflow.overflow}px (scrollWidth=${pageOverflow.scrollWidth}, clientWidth=${pageOverflow.clientWidth})`)
} else {
  console.log(`  ✅ No horizontal overflow (scrollWidth=${pageOverflow.scrollWidth}, clientWidth=${pageOverflow.clientWidth})\n`)
}

// ========================================
// 3. SECTION-BY-SECTION ANALYSIS
// ========================================
console.log('\n--- Section-by-Section Analysis ---')

// Get all section positions first for gap analysis
const sectionPositions = await page.evaluate((ids) => {
  const results = []
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      results.push({ id, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, height: rect.height })
    }
  }
  // Also get footer
  const footer = document.querySelector('footer')
  if (footer) {
    const rect = footer.getBoundingClientRect()
    results.push({ id: 'footer', top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, height: rect.height })
  }
  // Also get header
  const header = document.querySelector('header')
  if (header) {
    const rect = header.getBoundingClientRect()
    results.push({ id: 'header', top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, height: rect.height })
  }
  return results
}, sectionIds)

console.log('\n  Section Layout Map:')
sectionPositions.forEach(s => {
  console.log(`    #${s.id}: top=${Math.round(s.top)}px, bottom=${Math.round(s.bottom)}px, height=${Math.round(s.height)}px`)
})

// Check gaps between consecutive sections
console.log('\n  Section Gaps:')
const orderedSections = sectionPositions
  .filter(s => s.id !== 'header')
  .sort((a, b) => a.top - b.top)

for (let i = 0; i < orderedSections.length - 1; i++) {
  const curr = orderedSections[i]
  const next = orderedSections[i + 1]
  const gap = Math.round(next.top - curr.bottom)
  console.log(`    ${curr.id} → ${next.id}: ${gap}px gap`)
  if (gap > 100) {
    log('WARNING', `${curr.id}→${next.id}`, `Large gap between sections: ${gap}px — may appear as empty space`)
  }
  if (gap < -5) {
    log('WARNING', `${curr.id}→${next.id}`, `Sections overlap by ${Math.abs(gap)}px`)
  }
}

// ========================================
// 4. PER-SECTION DEEP ANALYSIS
// ========================================
for (const sectionId of [...sectionIds, 'footer']) {
  console.log(`\n--- #${sectionId} ---`)

  const selector = sectionId === 'footer' ? 'footer' : `#${sectionId}`

  // Screenshot the section
  const sectionEl = await page.$(selector)
  if (!sectionEl) {
    log('CRITICAL', sectionId, 'Section element not found in DOM')
    continue
  }

  await sectionEl.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await sectionEl.screenshot({ path: `${OUTPUT}/desktop-audit-${sectionId}.png` })
  console.log(`  Screenshot: desktop-audit-${sectionId}.png`)

  // Deep analysis
  const analysis = await page.evaluate((sel) => {
    const el = sel.startsWith('#') ? document.getElementById(sel.slice(1)) : document.querySelector(sel)
    if (!el) return null

    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)

    // Overflow
    const overflowX = el.scrollWidth - el.clientWidth
    const hasOverflowHidden = style.overflow === 'hidden' || style.overflowX === 'hidden'

    // Children overflow
    const overflowingChildren = []
    el.querySelectorAll('*').forEach(child => {
      const childRect = child.getBoundingClientRect()
      if (childRect.width > 0 && childRect.height > 0) {
        if (childRect.right > rect.right + 2) {
          overflowingChildren.push({
            tag: child.tagName.toLowerCase(),
            class: child.className?.toString().slice(0, 80) || '',
            overflowPx: Math.round(childRect.right - rect.right),
          })
        }
        if (childRect.left < rect.left - 2) {
          overflowingChildren.push({
            tag: child.tagName.toLowerCase(),
            class: child.className?.toString().slice(0, 80) || '',
            overflowPx: Math.round(rect.left - childRect.left),
            direction: 'left',
          })
        }
      }
    })

    // Font hierarchy
    const headings = []
    el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      const hStyle = window.getComputedStyle(h)
      headings.push({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 60),
        fontSize: hStyle.fontSize,
        fontWeight: hStyle.fontWeight,
        lineHeight: hStyle.lineHeight,
        color: hStyle.color,
      })
    })

    // Body text
    const bodyTexts = []
    el.querySelectorAll('p').forEach(p => {
      const pStyle = window.getComputedStyle(p)
      const pRect = p.getBoundingClientRect()
      if (pRect.height > 0) {
        bodyTexts.push({
          text: p.textContent?.trim().slice(0, 40),
          fontSize: pStyle.fontSize,
          lineHeight: pStyle.lineHeight,
          color: pStyle.color,
        })
      }
    })

    // Text clipping/truncation
    const clippedElements = []
    el.querySelectorAll('*').forEach(child => {
      const cs = window.getComputedStyle(child)
      if (cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden') {
        if (child.scrollWidth > child.clientWidth + 1 || child.scrollHeight > child.clientHeight + 1) {
          clippedElements.push({
            tag: child.tagName.toLowerCase(),
            class: child.className?.toString().slice(0, 60) || '',
            text: child.textContent?.trim().slice(0, 40),
            scrollW: child.scrollWidth,
            clientW: child.clientWidth,
            scrollH: child.scrollHeight,
            clientH: child.clientHeight,
          })
        }
      }
    })

    // Accessibility: images without alt
    const imgsNoAlt = []
    el.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label') && !img.getAttribute('role')) {
        imgsNoAlt.push({
          src: img.src?.slice(0, 80),
          class: img.className?.toString().slice(0, 60) || '',
        })
      }
    })

    // Accessibility: buttons/links without accessible text
    const inaccessibleInteractive = []
    el.querySelectorAll('a, button, [role="button"]').forEach(interactive => {
      const text = interactive.textContent?.trim()
      const ariaLabel = interactive.getAttribute('aria-label')
      const ariaLabelledby = interactive.getAttribute('aria-labelledby')
      const title = interactive.getAttribute('title')
      if (!text && !ariaLabel && !ariaLabelledby && !title) {
        inaccessibleInteractive.push({
          tag: interactive.tagName.toLowerCase(),
          class: interactive.className?.toString().slice(0, 60) || '',
          href: interactive.getAttribute('href') || '',
        })
      }
    })

    // Contrast check (approximate): very light text on very light bg
    // Just flag very low opacity or near-invisible text
    const lowContrastTexts = []
    el.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, li').forEach(t => {
      const tStyle = window.getComputedStyle(t)
      const opacity = parseFloat(tStyle.opacity)
      if (opacity < 0.4 && t.textContent?.trim().length > 0) {
        lowContrastTexts.push({
          tag: t.tagName.toLowerCase(),
          text: t.textContent?.trim().slice(0, 40),
          opacity,
          color: tStyle.color,
        })
      }
    })

    // Z-index stacking — detect overlapping positioned elements
    const positionedElements = []
    el.querySelectorAll('*').forEach(child => {
      const cs = window.getComputedStyle(child)
      if (cs.position === 'absolute' || cs.position === 'fixed') {
        const cRect = child.getBoundingClientRect()
        if (cRect.width > 0 && cRect.height > 0) {
          positionedElements.push({
            tag: child.tagName.toLowerCase(),
            class: child.className?.toString().slice(0, 60) || '',
            zIndex: cs.zIndex,
            position: cs.position,
            bounds: {
              top: Math.round(cRect.top),
              left: Math.round(cRect.left),
              width: Math.round(cRect.width),
              height: Math.round(cRect.height),
            },
          })
        }
      }
    })

    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      padding: style.padding,
      margin: style.margin,
      overflowX: Math.round(overflowX),
      hasOverflowHidden,
      overflowCSS: style.overflow,
      overflowingChildren: overflowingChildren.slice(0, 5), // limit
      headings,
      bodyTexts: bodyTexts.slice(0, 5),
      clippedElements,
      imgsNoAlt,
      inaccessibleInteractive,
      lowContrastTexts: lowContrastTexts.slice(0, 5),
      positionedElements: positionedElements.slice(0, 10),
    }
  }, selector)

  if (!analysis) {
    log('CRITICAL', sectionId, 'Could not analyze section')
    continue
  }

  console.log(`  Dimensions: ${analysis.width}x${analysis.height}`)
  console.log(`  Padding: ${analysis.padding}`)
  console.log(`  Overflow CSS: ${analysis.overflowCSS} | overflow-hidden: ${analysis.hasOverflowHidden}`)

  // Overflow issues
  if (analysis.overflowX > 0) {
    log('CRITICAL', sectionId, `Section has horizontal overflow: ${analysis.overflowX}px`)
  }
  if (analysis.overflowingChildren.length > 0 && !analysis.hasOverflowHidden) {
    analysis.overflowingChildren.forEach(c => {
      log('CRITICAL', sectionId, `Child <${c.tag}> overflows ${c.direction || 'right'} by ${c.overflowPx}px (class: ${c.class})`)
    })
  }

  // Font hierarchy
  if (analysis.headings.length > 0) {
    console.log('  Headings:')
    analysis.headings.forEach(h => {
      console.log(`    ${h.tag}: "${h.text}" — ${h.fontSize}, weight ${h.fontWeight}, line-height ${h.lineHeight}`)
    })
    // Check hierarchy violation: h2 font larger than h1, h3 larger than h2, etc
    for (let i = 0; i < analysis.headings.length - 1; i++) {
      const curr = analysis.headings[i]
      const next = analysis.headings[i + 1]
      const currSize = parseFloat(curr.fontSize)
      const nextSize = parseFloat(next.fontSize)
      const currLevel = parseInt(curr.tag.replace('H', ''))
      const nextLevel = parseInt(next.tag.replace('H', ''))
      if (nextLevel > currLevel && nextSize > currSize) {
        log('WARNING', sectionId, `Font hierarchy issue: ${next.tag} (${next.fontSize}) is larger than ${curr.tag} (${curr.fontSize})`)
      }
    }
  }

  // Body text
  if (analysis.bodyTexts.length > 0) {
    console.log('  Body text samples:')
    analysis.bodyTexts.slice(0, 3).forEach(t => {
      console.log(`    "${t.text}" — ${t.fontSize}, line-height ${t.lineHeight}`)
    })
  }

  // Clipped text
  if (analysis.clippedElements.length > 0) {
    analysis.clippedElements.forEach(c => {
      log('WARNING', sectionId, `Text possibly clipped: <${c.tag}> "${c.text}" (scrollW=${c.scrollW} > clientW=${c.clientW}, scrollH=${c.scrollH} > clientH=${c.clientH})`)
    })
  }

  // Accessibility
  if (analysis.imgsNoAlt.length > 0) {
    analysis.imgsNoAlt.forEach(img => {
      log('WARNING', sectionId, `Image missing alt text: src="${img.src}"`)
    })
  }
  if (analysis.inaccessibleInteractive.length > 0) {
    analysis.inaccessibleInteractive.forEach(el => {
      log('WARNING', sectionId, `Interactive element missing accessible text: <${el.tag}> class="${el.class}" href="${el.href}"`)
    })
  }

  // Low contrast
  if (analysis.lowContrastTexts.length > 0) {
    analysis.lowContrastTexts.forEach(t => {
      log('INFO', sectionId, `Low opacity text (${t.opacity}): <${t.tag}> "${t.text}" color=${t.color}`)
    })
  }

  // Positioned element info
  if (analysis.positionedElements.length > 0) {
    console.log(`  Positioned elements: ${analysis.positionedElements.length}`)
    analysis.positionedElements.slice(0, 3).forEach(p => {
      console.log(`    <${p.tag}> pos=${p.position} z=${p.zIndex} bounds=(${p.bounds.left},${p.bounds.top} ${p.bounds.width}x${p.bounds.height})`)
    })
  }
}

// ========================================
// 5. VIEWPORT SCREENSHOT AT EACH SCROLL POSITION
// ========================================
console.log('\n\n--- Viewport Snapshots (scrolling top to bottom) ---')
const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight)
const steps = Math.ceil(totalHeight / 900)
console.log(`  Total page height: ${totalHeight}px, taking ${steps} viewport snapshots`)

for (let i = 0; i < Math.min(steps, 20); i++) {
  const scrollY = i * 900
  await page.evaluate((y) => window.scrollTo(0, y), scrollY)
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUTPUT}/desktop-scroll-${i}.png` })
}
console.log(`  Saved ${Math.min(steps, 20)} scroll snapshots`)

// ========================================
// SUMMARY
// ========================================
console.log('\n' + '='.repeat(60))
console.log('AUDIT SUMMARY')
console.log('='.repeat(60))

const criticals = issues.filter(i => i.severity === 'CRITICAL')
const warnings = issues.filter(i => i.severity === 'WARNING')
const infos = issues.filter(i => i.severity === 'INFO')

if (issues.length === 0) {
  console.log('✅ 0 issues. Clean!')
} else {
  console.log(`Total: ${issues.length} issues (${criticals.length} critical, ${warnings.length} warnings, ${infos.length} info)\n`)

  if (criticals.length > 0) {
    console.log('🔴 CRITICAL:')
    criticals.forEach(i => console.log(`  - [#${i.section}] ${i.message}`))
  }
  if (warnings.length > 0) {
    console.log('\n🟡 WARNINGS:')
    warnings.forEach(i => console.log(`  - [#${i.section}] ${i.message}`))
  }
  if (infos.length > 0) {
    console.log('\n🔵 INFO:')
    infos.forEach(i => console.log(`  - [#${i.section}] ${i.message}`))
  }
}

await browser.close()
console.log('\nDone.')
