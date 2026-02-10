/**
 * COMPREHENSIVE MOBILE AUDIT — 375x812 (iPhone-like)
 * Checks: overflow, touch targets, text size, image scaling, header/nav,
 *         spacing gaps, grid collapse, per-section screenshots
 * Prerequisites: dev server on port 3001, npx playwright install chromium
 * Run: node scripts/audit/mobile-full-audit.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const BASE_URL = 'http://localhost:3001'
const OUTPUT = './audit-screenshots/mobile-full'
const VP = { width: 375, height: 812 }
const SECTIONS = ['hero', 'capabilities', 'social-proof', 'use-cases', 'cta']

fs.mkdirSync(OUTPUT, { recursive: true })

const issues = []
const info = []

function logIssue(severity, section, message) {
  const entry = { severity, section, message }
  if (severity === 'CRITICAL' || severity === 'WARNING') {
    issues.push(entry)
  } else {
    info.push(entry)
  }
  const icon = severity === 'CRITICAL' ? '🔴' : severity === 'WARNING' ? '🟡' : '🔵'
  console.log(`  ${icon} [${severity}] ${section ? '#' + section + ': ' : ''}${message}`)
}

console.log(`\n${'='.repeat(60)}`)
console.log(`COMPREHENSIVE MOBILE AUDIT — ${VP.width}x${VP.height}`)
console.log(`${'='.repeat(60)}\n`)

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: VP,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
const page = await context.newPage()

// ──────────────────────────────────────────
// 1. LOAD PAGE
// ──────────────────────────────────────────
console.log('1. Loading page...')
await page.goto(BASE_URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

// Full page screenshot
await page.screenshot({ path: `${OUTPUT}/full-page.png`, fullPage: true })
console.log('   Full page screenshot saved.\n')

// ──────────────────────────────────────────
// 2. HORIZONTAL OVERFLOW CHECK
// ──────────────────────────────────────────
console.log('2. Horizontal overflow check...')
const pageOverflow = await page.evaluate(() => {
  const scrollW = document.documentElement.scrollWidth
  const clientW = document.documentElement.clientWidth
  return { scrollW, clientW, overflow: scrollW - clientW }
})
console.log(`   scrollWidth: ${pageOverflow.scrollW}, clientWidth: ${pageOverflow.clientW}`)
if (pageOverflow.overflow > 0) {
  logIssue('CRITICAL', null, `Page has horizontal overflow of ${pageOverflow.overflow}px — causes sideways scrolling`)
} else {
  console.log('   ✅ No horizontal overflow detected.')
}

// Find which elements cause overflow
if (pageOverflow.overflow > 0) {
  const overflowingElements = await page.evaluate((vpWidth) => {
    const all = document.querySelectorAll('*')
    const culprits = []
    all.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.right > vpWidth + 2) {
        culprits.push({
          tag: el.tagName,
          id: el.id || '',
          className: el.className?.toString?.()?.slice(0, 80) || '',
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflowBy: Math.round(rect.right - vpWidth),
        })
      }
    })
    // Deduplicate by keeping most specific (deepest) elements
    return culprits.slice(0, 20)
  }, VP.width)
  if (overflowingElements.length > 0) {
    console.log(`   Elements extending beyond viewport:`)
    overflowingElements.forEach(el => {
      console.log(`     <${el.tag}${el.id ? '#' + el.id : ''}> extends ${el.overflowBy}px beyond viewport (width: ${el.width}px)`)
    })
  }
}

// ──────────────────────────────────────────
// 3. HEADER / NAVIGATION CHECK
// ──────────────────────────────────────────
console.log('\n3. Header & Navigation audit...')

// Screenshot the header area
await page.screenshot({ path: `${OUTPUT}/header-top.png`, clip: { x: 0, y: 0, width: VP.width, height: 80 } })

const headerData = await page.evaluate(() => {
  const header = document.querySelector('header') || document.querySelector('[role="banner"]')
  if (!header) return { found: false }

  const rect = header.getBoundingClientRect()
  const style = window.getComputedStyle(header)

  // Check if mobile menu button exists
  const menuBtn = header.querySelector('button[aria-label*="menu" i], button[aria-label*="nav" i], [data-mobile-menu], button svg')
  const navLinks = header.querySelectorAll('nav a, nav button')
  const visibleLinks = [...navLinks].filter(l => {
    const s = window.getComputedStyle(l)
    return s.display !== 'none' && s.visibility !== 'hidden'
  })

  // Check if desktop nav is accidentally showing on mobile
  const desktopNav = header.querySelector('nav')
  let desktopNavVisible = false
  if (desktopNav) {
    const navStyle = window.getComputedStyle(desktopNav)
    desktopNavVisible = navStyle.display !== 'none' && navStyle.visibility !== 'hidden'
  }

  return {
    found: true,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    position: style.position,
    zIndex: style.zIndex,
    hasMenuButton: !!menuBtn,
    visibleNavLinks: visibleLinks.length,
    desktopNavVisible,
    overflowing: header.scrollWidth > header.clientWidth,
  }
})

if (!headerData.found) {
  logIssue('CRITICAL', 'header', 'No <header> element found')
} else {
  console.log(`   Header: ${headerData.width}x${headerData.height}, position: ${headerData.position}`)
  if (headerData.width > VP.width) {
    logIssue('CRITICAL', 'header', `Header is ${headerData.width}px wide — exceeds ${VP.width}px viewport`)
  }
  if (headerData.overflowing) {
    logIssue('CRITICAL', 'header', 'Header has internal horizontal overflow')
  }
  if (!headerData.hasMenuButton) {
    logIssue('WARNING', 'header', 'No mobile menu/hamburger button detected — desktop nav may be visible')
  }
  if (headerData.desktopNavVisible && headerData.visibleNavLinks > 3) {
    logIssue('WARNING', 'header', `Desktop nav appears visible on mobile with ${headerData.visibleNavLinks} links — may cause overflow`)
  }
  if (headerData.height < 44) {
    logIssue('WARNING', 'header', `Header height is only ${headerData.height}px — may be too compact for mobile`)
  }
  if (headerData.height > 80) {
    logIssue('WARNING', 'header', `Header height is ${headerData.height}px — taking too much vertical space on mobile`)
  }
  console.log(`   ✅ Header basic checks done.`)
}

// ──────────────────────────────────────────
// 4. PER-SECTION AUDIT
// ──────────────────────────────────────────
console.log('\n4. Per-section audit...')

for (const sectionId of SECTIONS) {
  console.log(`\n  ── #${sectionId} ──`)

  const sectionData = await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (!el) return { found: false }

    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)

    // Overflow
    const sectionOverflow = el.scrollWidth - el.clientWidth

    // Children overflowing
    let worstOverflow = 0
    let overflowingChild = null
    el.querySelectorAll('*').forEach(child => {
      const cr = child.getBoundingClientRect()
      if (cr.right > rect.right + 2) {
        const diff = cr.right - rect.right
        if (diff > worstOverflow) {
          worstOverflow = diff
          overflowingChild = {
            tag: child.tagName,
            className: child.className?.toString?.()?.slice(0, 60) || '',
            overflowBy: Math.round(diff),
          }
        }
      }
      if (cr.left < rect.left - 2) {
        const diff = rect.left - cr.left
        if (diff > worstOverflow) {
          worstOverflow = diff
          overflowingChild = {
            tag: child.tagName,
            className: child.className?.toString?.()?.slice(0, 60) || '',
            overflowBy: Math.round(diff),
            side: 'left',
          }
        }
      }
    })

    // Text size check
    const textElements = el.querySelectorAll('p, span, li, a, td, th, label, h1, h2, h3, h4, h5, h6')
    const smallTextElements = []
    const allFontSizes = []
    textElements.forEach(te => {
      const teStyle = window.getComputedStyle(te)
      const fontSize = parseFloat(teStyle.fontSize)
      const display = teStyle.display
      const visibility = teStyle.visibility
      const opacity = teStyle.opacity
      if (display !== 'none' && visibility !== 'hidden' && parseFloat(opacity) > 0) {
        allFontSizes.push({ tag: te.tagName, size: fontSize, text: te.textContent?.trim().slice(0, 40) })
        if (fontSize < 12 && te.textContent?.trim().length > 0) {
          smallTextElements.push({
            tag: te.tagName,
            fontSize,
            text: te.textContent?.trim().slice(0, 40),
          })
        }
      }
    })

    // Touch targets
    const interactives = el.querySelectorAll('a, button, [role="button"], input, select, textarea')
    const smallTargets = []
    interactives.forEach(t => {
      const tRect = t.getBoundingClientRect()
      const tStyle = window.getComputedStyle(t)
      if (tStyle.display !== 'none' && tStyle.visibility !== 'hidden' && tRect.height > 0 && tRect.width > 0) {
        if (tRect.height < 44 || tRect.width < 44) {
          smallTargets.push({
            tag: t.tagName,
            text: t.textContent?.trim().slice(0, 30) || t.getAttribute('aria-label') || '',
            height: Math.round(tRect.height),
            width: Math.round(tRect.width),
          })
        }
      }
    })

    // Grid layout check — look for multi-column grids
    const grids = el.querySelectorAll('[class*="grid"]')
    const gridIssues = []
    grids.forEach(g => {
      const gStyle = window.getComputedStyle(g)
      const cols = gStyle.gridTemplateColumns
      const gRect = g.getBoundingClientRect()
      // Count explicit columns
      const colParts = cols.split(/\s+/).filter(c => c && c !== 'none')
      if (colParts.length > 1 && gRect.width < 400) {
        gridIssues.push({
          columns: colParts.length,
          templateCols: cols.slice(0, 80),
          width: Math.round(gRect.width),
          className: g.className?.toString?.()?.slice(0, 60) || '',
        })
      }
    })

    // Images check
    const images = el.querySelectorAll('img, svg, video, canvas')
    const imageIssues = []
    images.forEach(img => {
      const imgRect = img.getBoundingClientRect()
      if (imgRect.width > rect.width + 2) {
        imageIssues.push({
          tag: img.tagName,
          src: img.getAttribute('src')?.slice(0, 60) || '',
          width: Math.round(imgRect.width),
          containerWidth: Math.round(rect.width),
        })
      }
    })

    // Heading sizes
    const headings = []
    el.querySelectorAll('h1, h2, h3').forEach(h => {
      const hStyle = window.getComputedStyle(h)
      headings.push({
        tag: h.tagName,
        fontSize: hStyle.fontSize,
        lineHeight: hStyle.lineHeight,
        text: h.textContent?.trim().slice(0, 50),
      })
    })

    return {
      found: true,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      overflowCSS: style.overflow,
      overflowXCSS: style.overflowX,
      sectionOverflow: Math.round(sectionOverflow),
      overflowHidden: style.overflow === 'hidden' || style.overflowX === 'hidden',
      worstOverflow: Math.round(worstOverflow),
      overflowingChild,
      smallTextElements,
      smallTargets,
      gridIssues,
      imageIssues,
      headings,
    }
  }, sectionId)

  if (!sectionData.found) {
    logIssue('CRITICAL', sectionId, 'Section element #' + sectionId + ' NOT FOUND in DOM')
    continue
  }

  console.log(`   Size: ${sectionData.width}x${sectionData.height}`)
  console.log(`   Padding: ${sectionData.padding}`)
  console.log(`   overflow CSS: ${sectionData.overflowCSS} / overflow-x: ${sectionData.overflowXCSS}`)

  // Screenshot the section
  const section = await page.$(`#${sectionId}`)
  if (section) {
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await section.screenshot({ path: `${OUTPUT}/section-${sectionId}.png` })
    console.log(`   📸 Screenshot saved: section-${sectionId}.png`)
  }

  // Section width check
  if (sectionData.width > VP.width) {
    logIssue('CRITICAL', sectionId, `Section is ${sectionData.width}px wide — exceeds ${VP.width}px viewport`)
  }

  // Internal overflow
  if (sectionData.sectionOverflow > 0) {
    logIssue('CRITICAL', sectionId, `Internal horizontal overflow of ${sectionData.sectionOverflow}px`)
  }

  // Child overflow without overflow-hidden
  if (sectionData.worstOverflow > 0 && !sectionData.overflowHidden) {
    logIssue('CRITICAL', sectionId, `Child element overflows by ${sectionData.worstOverflow}px and section lacks overflow-hidden. ${sectionData.overflowingChild ? `Culprit: <${sectionData.overflowingChild.tag}> class="${sectionData.overflowingChild.className}"` : ''}`)
  } else if (sectionData.worstOverflow > 0) {
    logIssue('INFO', sectionId, `Child overflows by ${sectionData.worstOverflow}px but overflow-hidden is set (clipped)`)
  }

  // Small text
  if (sectionData.smallTextElements.length > 0) {
    sectionData.smallTextElements.forEach(t => {
      logIssue('WARNING', sectionId, `Text too small: <${t.tag}> "${t.text}" is ${t.fontSize}px (< 12px minimum)`)
    })
  }

  // Touch targets
  if (sectionData.smallTargets.length > 0) {
    sectionData.smallTargets.forEach(t => {
      logIssue('WARNING', sectionId, `Touch target too small: <${t.tag}> "${t.text}" is ${t.width}x${t.height}px (need >= 44x44)`)
    })
  }

  // Grid issues
  if (sectionData.gridIssues.length > 0) {
    sectionData.gridIssues.forEach(g => {
      logIssue('WARNING', sectionId, `Grid still has ${g.columns} columns at ${g.width}px width: "${g.templateCols}" — class="${g.className}"`)
    })
  }

  // Image scaling
  if (sectionData.imageIssues.length > 0) {
    sectionData.imageIssues.forEach(img => {
      logIssue('WARNING', sectionId, `<${img.tag}> is ${img.width}px wide, exceeding container (${img.containerWidth}px). src="${img.src}"`)
    })
  }

  // Headings
  if (sectionData.headings.length > 0) {
    sectionData.headings.forEach(h => {
      const size = parseFloat(h.fontSize)
      console.log(`   ${h.tag}: "${h.text}" — ${h.fontSize} / line-height: ${h.lineHeight}`)
      if (h.tag === 'H1' && size > 48) {
        logIssue('WARNING', sectionId, `H1 is ${h.fontSize} — may be too large for mobile`)
      }
      if (h.tag === 'H2' && size > 36) {
        logIssue('WARNING', sectionId, `H2 is ${h.fontSize} — may be too large for mobile`)
      }
    })
  }

  // Excessive padding on mobile
  const padL = parseFloat(sectionData.paddingLeft)
  const padR = parseFloat(sectionData.paddingRight)
  if (padL + padR > VP.width * 0.25) {
    logIssue('WARNING', sectionId, `Horizontal padding (${sectionData.paddingLeft} + ${sectionData.paddingRight}) eats > 25% of viewport width`)
  }
}

// ──────────────────────────────────────────
// 5. FOOTER CHECK
// ──────────────────────────────────────────
console.log('\n\n  ── Footer ──')

const footerData = await page.evaluate(() => {
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]')
  if (!footer) return { found: false }

  const rect = footer.getBoundingClientRect()
  const style = window.getComputedStyle(footer)

  // Check for grids
  const grids = footer.querySelectorAll('[class*="grid"]')
  const gridIssues = []
  grids.forEach(g => {
    const gStyle = window.getComputedStyle(g)
    const cols = gStyle.gridTemplateColumns
    const gRect = g.getBoundingClientRect()
    const colParts = cols.split(/\s+/).filter(c => c && c !== 'none')
    if (colParts.length > 1 && gRect.width < 400) {
      gridIssues.push({
        columns: colParts.length,
        templateCols: cols.slice(0, 80),
        width: Math.round(gRect.width),
      })
    }
  })

  // Touch targets
  const links = footer.querySelectorAll('a, button')
  const smallTargets = []
  links.forEach(l => {
    const lRect = l.getBoundingClientRect()
    const lStyle = window.getComputedStyle(l)
    if (lStyle.display !== 'none' && lRect.height > 0 && lRect.height < 44) {
      smallTargets.push({
        text: l.textContent?.trim().slice(0, 30),
        height: Math.round(lRect.height),
        width: Math.round(lRect.width),
      })
    }
  })

  // Small text
  const texts = footer.querySelectorAll('p, span, a, li')
  const smallText = []
  texts.forEach(t => {
    const tStyle = window.getComputedStyle(t)
    const size = parseFloat(tStyle.fontSize)
    if (size < 12 && t.textContent?.trim().length > 0 && tStyle.display !== 'none') {
      smallText.push({ text: t.textContent?.trim().slice(0, 40), size })
    }
  })

  return {
    found: true,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    overflow: footer.scrollWidth - footer.clientWidth,
    gridIssues,
    smallTargets,
    smallText,
  }
})

if (!footerData.found) {
  logIssue('CRITICAL', 'footer', 'No <footer> element found')
} else {
  console.log(`   Size: ${footerData.width}x${footerData.height}`)

  // Screenshot footer
  const footer = await page.$('footer')
  if (footer) {
    await footer.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await footer.screenshot({ path: `${OUTPUT}/section-footer.png` })
    console.log(`   📸 Screenshot saved: section-footer.png`)
  }

  if (footerData.width > VP.width) {
    logIssue('CRITICAL', 'footer', `Footer width ${footerData.width}px exceeds viewport`)
  }
  if (footerData.overflow > 0) {
    logIssue('CRITICAL', 'footer', `Footer has horizontal overflow of ${footerData.overflow}px`)
  }
  if (footerData.gridIssues.length > 0) {
    footerData.gridIssues.forEach(g => {
      logIssue('WARNING', 'footer', `Grid still has ${g.columns} columns at ${g.width}px: "${g.templateCols}"`)
    })
  }
  if (footerData.smallTargets.length > 0) {
    footerData.smallTargets.forEach(t => {
      logIssue('WARNING', 'footer', `Touch target too small: "${t.text}" ${t.width}x${t.height}px`)
    })
  }
  if (footerData.smallText.length > 0) {
    footerData.smallText.forEach(t => {
      logIssue('WARNING', 'footer', `Text too small: "${t.text}" is ${t.size}px`)
    })
  }
}

// ──────────────────────────────────────────
// 6. SPACING / GAP ANALYSIS
// ──────────────────────────────────────────
console.log('\n\n5. Section spacing analysis...')

const spacingData = await page.evaluate((sectionIds) => {
  const results = []
  const allIds = [...sectionIds, '_footer']

  for (let i = 0; i < allIds.length - 1; i++) {
    const currentEl = allIds[i] === '_footer'
      ? document.querySelector('footer')
      : document.getElementById(allIds[i])
    const nextEl = allIds[i + 1] === '_footer'
      ? document.querySelector('footer')
      : document.getElementById(allIds[i + 1])

    if (currentEl && nextEl) {
      const currentRect = currentEl.getBoundingClientRect()
      const nextRect = nextEl.getBoundingClientRect()
      const gap = nextRect.top - currentRect.bottom
      results.push({
        from: allIds[i],
        to: allIds[i + 1] === '_footer' ? 'footer' : allIds[i + 1],
        gap: Math.round(gap),
      })
    }
  }
  return results
}, [...SECTIONS, '_footer'])

let maxGap = 0
let minGap = Infinity
spacingData.forEach(s => {
  console.log(`   ${s.from} → ${s.to}: ${s.gap}px gap`)
  if (Math.abs(s.gap) > maxGap) maxGap = Math.abs(s.gap)
  if (Math.abs(s.gap) < minGap) minGap = Math.abs(s.gap)
})

if (maxGap > 120) {
  const largest = spacingData.reduce((a, b) => Math.abs(a.gap) > Math.abs(b.gap) ? a : b)
  logIssue('WARNING', null, `Large gap between #${largest.from} and #${largest.to}: ${largest.gap}px — may look like dead space on mobile`)
}
if (maxGap > 0 && minGap > 0 && maxGap / minGap > 3) {
  logIssue('INFO', null, `Uneven section spacing — largest: ${maxGap}px, smallest: ${minGap}px (ratio ${(maxGap / minGap).toFixed(1)}:1)`)
}

// ──────────────────────────────────────────
// 7. VIEWPORT SCROLL AUDIT — scroll top to bottom
// ──────────────────────────────────────────
console.log('\n6. Scroll-through viewport captures...')

const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight)
const scrollSteps = Math.ceil(totalHeight / VP.height)
console.log(`   Total page height: ${totalHeight}px, capturing ${scrollSteps} viewport-height segments`)

for (let i = 0; i < Math.min(scrollSteps, 15); i++) {
  const y = i * VP.height
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUTPUT}/scroll-${String(i).padStart(2, '0')}-at-${y}px.png` })
}
console.log(`   Saved ${Math.min(scrollSteps, 15)} scroll captures.`)

// ──────────────────────────────────────────
// SUMMARY
// ──────────────────────────────────────────
console.log(`\n${'='.repeat(60)}`)
console.log('AUDIT SUMMARY')
console.log(`${'='.repeat(60)}`)

const critical = issues.filter(i => i.severity === 'CRITICAL')
const warnings = issues.filter(i => i.severity === 'WARNING')

console.log(`\n  🔴 Critical: ${critical.length}`)
critical.forEach(i => console.log(`     - ${i.section ? '#' + i.section + ': ' : ''}${i.message}`))

console.log(`\n  🟡 Warning: ${warnings.length}`)
warnings.forEach(i => console.log(`     - ${i.section ? '#' + i.section + ': ' : ''}${i.message}`))

console.log(`\n  🔵 Info: ${info.length}`)
info.forEach(i => console.log(`     - ${i.section ? '#' + i.section + ': ' : ''}${i.message}`))

console.log(`\n  Total issues: ${issues.length} (${critical.length} critical, ${warnings.length} warnings)`)
console.log(`  Screenshots: ${OUTPUT}/\n`)

await context.close()
await browser.close()
