/**
 * TABLET AUDIT — Deep visual & layout audit at 768x1024 (iPad-like)
 * Checks: overflow, grid orphans, spacing, nav, touch targets, section-by-section screenshots
 * Prerequisites: dev server on port 3001
 * Run: node scripts/audit/tablet.mjs
 */
import { chromium, webkit } from 'playwright'
import fs from 'fs'

const BASE_URL = 'http://localhost:3001'
const OUTPUT = './audit-screenshots/tablet'
fs.mkdirSync(OUTPUT, { recursive: true })

const VIEWPORT = { width: 768, height: 1024 }
const sections = ['hero', 'capabilities', 'social-proof', 'use-cases', 'cta']
const issues = []

console.log('=== TABLET AUDIT (768x1024) ===\n')

// ─── PHASE 1: Full-page screenshot ───────────────────────────────────
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: VIEWPORT })
await page.goto(BASE_URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

// Full page screenshot
await page.screenshot({ path: `${OUTPUT}/tablet-fullpage.png`, fullPage: true })
console.log('Full-page screenshot saved.\n')

// ─── PHASE 2: Horizontal overflow check ──────────────────────────────
const pageOverflow = await page.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth
)
if (pageOverflow > 0) {
  issues.push({ severity: 'CRITICAL', section: 'page', detail: `Page-level horizontal overflow: ${pageOverflow}px` })
  console.log(`CRITICAL: Page horizontal overflow ${pageOverflow}px`)
} else {
  console.log('Page horizontal overflow: NONE (clean)')
}

// ─── PHASE 3: Header / nav audit ─────────────────────────────────────
console.log('\n--- HEADER ---')
const headerData = await page.evaluate(() => {
  const header = document.querySelector('header')
  if (!header) return { found: false }
  const rect = header.getBoundingClientRect()

  // Desktop nav (hidden md:flex)
  const desktopNav = header.querySelector('nav')
  const desktopNavVisible = desktopNav
    ? window.getComputedStyle(desktopNav).display !== 'none'
    : false

  // Desktop CTA buttons
  const ctaContainer = header.querySelectorAll('div')
  let ctaVisible = false
  ctaContainer.forEach(div => {
    if (div.classList.contains('md:flex') || div.classList.contains('hidden')) {
      const style = window.getComputedStyle(div)
      if (style.display !== 'none' && div.querySelector('a[href="/contact"]')) {
        ctaVisible = true
      }
    }
  })

  // Mobile hamburger
  const mobileNav = header.querySelector('[aria-label*="menu"], [aria-label*="Menu"], button[class*="mobile"], [data-mobile-nav]')
  const mobileNavVisible = mobileNav
    ? window.getComputedStyle(mobileNav).display !== 'none'
    : false

  // Nav items - check if they all fit
  const navLinks = desktopNav ? desktopNav.querySelectorAll('a') : []
  const navItems = []
  navLinks.forEach(link => {
    const r = link.getBoundingClientRect()
    navItems.push({
      text: link.textContent?.trim(),
      width: Math.round(r.width),
      height: Math.round(r.height),
      left: Math.round(r.left),
      right: Math.round(r.right),
    })
  })

  // Check if nav items overflow or crowd
  const logo = header.querySelector('a[href="/"]')
  const logoRect = logo ? logo.getBoundingClientRect() : null

  return {
    found: true,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    desktopNavVisible,
    ctaVisible,
    mobileNavVisible,
    navItems,
    logoWidth: logoRect ? Math.round(logoRect.width) : 0,
    totalNavWidth: navItems.reduce((sum, item) => sum + item.width, 0),
  }
})

if (headerData.found) {
  console.log(`  Header: ${headerData.width}x${headerData.height}`)
  console.log(`  Desktop nav visible: ${headerData.desktopNavVisible}`)
  console.log(`  CTA button visible: ${headerData.ctaVisible}`)
  console.log(`  Mobile hamburger visible: ${headerData.mobileNavVisible}`)
  console.log(`  Logo width: ${headerData.logoWidth}px`)
  console.log(`  Nav items total width: ${headerData.totalNavWidth}px`)
  console.log(`  Nav items:`)
  headerData.navItems.forEach(item => {
    console.log(`    "${item.text}" — ${item.width}x${item.height} [left:${item.left}, right:${item.right}]`)
    if (item.right > 768) {
      issues.push({ severity: 'CRITICAL', section: 'header', detail: `Nav item "${item.text}" extends beyond viewport (right: ${item.right}px)` })
    }
  })

  // Check if desktop nav + CTA + logo crowd the header
  const totalHeaderContent = headerData.logoWidth + headerData.totalNavWidth + 150 // estimated CTA width
  if (totalHeaderContent > 768 - 48) { // 48px for padding
    issues.push({ severity: 'WARNING', section: 'header', detail: `Header content may be crowded: ~${totalHeaderContent}px of content in ${768 - 48}px of space` })
  }
}

// Screenshot header
const headerEl = await page.$('header')
if (headerEl) {
  await headerEl.screenshot({ path: `${OUTPUT}/tablet-header.png` })
  console.log('  Screenshot saved.')
}

// ─── PHASE 4: Per-section deep audit ─────────────────────────────────
for (const sectionId of sections) {
  console.log(`\n--- #${sectionId} ---`)

  const sectionData = await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (!el) return { found: false }

    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    const overflow = el.scrollWidth - el.clientWidth

    // Check children overflowing
    let childOverflows = []
    el.querySelectorAll('*').forEach(child => {
      const childRect = child.getBoundingClientRect()
      if (childRect.right > rect.right + 2) {
        const tag = child.tagName.toLowerCase()
        const cls = child.className?.toString().slice(0, 60) || ''
        childOverflows.push({
          selector: `${tag}.${cls.split(' ')[0] || 'no-class'}`,
          overflowBy: Math.round(childRect.right - rect.right),
        })
      }
    })
    // Deduplicate by taking top 5
    childOverflows = childOverflows.slice(0, 5)

    // Check grids
    const grids = []
    el.querySelectorAll('[class*="grid"]').forEach(grid => {
      const gridStyle = window.getComputedStyle(grid)
      const cols = gridStyle.gridTemplateColumns
      const children = grid.children
      const childCount = children.length

      // Check for orphaned items (last row not full)
      const colCount = cols.split(' ').filter(c => c && c !== 'none').length
      const lastRowItems = childCount % colCount
      const hasOrphan = lastRowItems > 0 && lastRowItems < colCount

      // Check individual grid children sizes
      const childSizes = []
      Array.from(children).forEach((child, i) => {
        const childRect = child.getBoundingClientRect()
        const childStyle = window.getComputedStyle(child)
        childSizes.push({
          index: i,
          width: Math.round(childRect.width),
          height: Math.round(childRect.height),
          colSpan: childStyle.gridColumn,
        })
      })

      grids.push({
        columns: cols,
        colCount,
        childCount,
        lastRowItems,
        hasOrphan,
        childSizes,
        gridWidth: Math.round(grid.getBoundingClientRect().width),
      })
    })

    // Padding check
    const padding = {
      top: style.paddingTop,
      right: style.paddingRight,
      bottom: style.paddingBottom,
      left: style.paddingLeft,
    }

    // Heading sizes
    const headings = []
    el.querySelectorAll('h1, h2, h3, h4').forEach(h => {
      const hStyle = window.getComputedStyle(h)
      headings.push({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 50),
        fontSize: hStyle.fontSize,
        lineHeight: hStyle.lineHeight,
        width: Math.round(h.getBoundingClientRect().width),
      })
    })

    // Touch targets
    const smallTargets = []
    el.querySelectorAll('a, button, [role="button"]').forEach(t => {
      const tRect = t.getBoundingClientRect()
      if (tRect.height > 0 && tRect.height < 44) {
        smallTargets.push({
          text: t.textContent?.trim().slice(0, 30),
          width: Math.round(tRect.width),
          height: Math.round(tRect.height),
          tag: t.tagName.toLowerCase(),
        })
      }
    })

    // Text container widths (check for too-wide paragraphs)
    const paragraphs = []
    el.querySelectorAll('p').forEach(p => {
      const pRect = p.getBoundingClientRect()
      const pStyle = window.getComputedStyle(p)
      if (pRect.width > 0) {
        // Characters per line estimate (width / avg char width)
        const fontSize = parseFloat(pStyle.fontSize)
        const estCharsPerLine = Math.round(pRect.width / (fontSize * 0.5))
        paragraphs.push({
          width: Math.round(pRect.width),
          fontSize: pStyle.fontSize,
          estCharsPerLine,
          text: p.textContent?.trim().slice(0, 40),
        })
      }
    })

    return {
      found: true,
      visible: style.display !== 'none' && style.visibility !== 'hidden',
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      overflow: Math.round(overflow),
      overflowHidden: style.overflow === 'hidden' || style.overflowX === 'hidden',
      childOverflows,
      grids,
      padding,
      headings,
      smallTargets,
      paragraphs,
    }
  }, sectionId)

  if (!sectionData.found) {
    issues.push({ severity: 'CRITICAL', section: sectionId, detail: 'Section not found in DOM' })
    console.log('  NOT FOUND')
    continue
  }

  console.log(`  Size: ${sectionData.width}x${sectionData.height}`)
  console.log(`  Overflow: ${sectionData.overflow}px | overflow-hidden: ${sectionData.overflowHidden}`)
  console.log(`  Padding: T=${sectionData.padding.top} R=${sectionData.padding.right} B=${sectionData.padding.bottom} L=${sectionData.padding.left}`)

  // Overflow issues
  if (sectionData.overflow > 0) {
    issues.push({ severity: 'CRITICAL', section: sectionId, detail: `Section scrollWidth overflow: ${sectionData.overflow}px` })
  }
  if (sectionData.childOverflows.length > 0 && !sectionData.overflowHidden) {
    sectionData.childOverflows.forEach(co => {
      issues.push({ severity: 'CRITICAL', section: sectionId, detail: `Child ${co.selector} overflows by ${co.overflowBy}px (no overflow-hidden)` })
    })
    console.log(`  Child overflows: ${sectionData.childOverflows.length} elements`)
  }

  // Grid analysis
  if (sectionData.grids.length > 0) {
    sectionData.grids.forEach((grid, gi) => {
      console.log(`  Grid ${gi}: ${grid.colCount} cols, ${grid.childCount} items, grid-template: ${grid.columns}`)
      console.log(`    Grid width: ${grid.gridWidth}px`)
      if (grid.hasOrphan) {
        console.log(`    ORPHAN: Last row has ${grid.lastRowItems}/${grid.colCount} items`)
        issues.push({ severity: 'WARNING', section: sectionId, detail: `Grid orphan: last row has ${grid.lastRowItems} of ${grid.colCount} columns filled` })
      }
      grid.childSizes.forEach(cs => {
        console.log(`    Card ${cs.index}: ${cs.width}x${cs.height} (colSpan: ${cs.colSpan})`)
        // Check for overly wide cards at tablet
        if (cs.width > 700) {
          issues.push({ severity: 'INFO', section: sectionId, detail: `Card ${cs.index} is very wide: ${cs.width}px at 768px viewport` })
        }
      })
    })
  }

  // Heading analysis
  if (sectionData.headings.length > 0) {
    console.log('  Headings:')
    sectionData.headings.forEach(h => {
      console.log(`    ${h.tag}: "${h.text}" — ${h.fontSize}, lh: ${h.lineHeight}, w: ${h.width}px`)
      const fs = parseFloat(h.fontSize)
      if (h.tag === 'H1' && fs > 56) {
        issues.push({ severity: 'WARNING', section: sectionId, detail: `H1 "${h.text}" is ${h.fontSize} — may be too large for tablet` })
      }
    })
  }

  // Touch targets
  if (sectionData.smallTargets.length > 0) {
    console.log('  Small touch targets:')
    sectionData.smallTargets.forEach(t => {
      console.log(`    ${t.tag}: "${t.text}" — ${t.width}x${t.height}`)
    })
    // Tablets are touch devices too
    sectionData.smallTargets.forEach(t => {
      issues.push({ severity: 'WARNING', section: sectionId, detail: `Touch target "${t.text}" is ${t.height}px tall (< 44px minimum)` })
    })
  }

  // Paragraph width check (optimal reading is 45-75 chars per line)
  if (sectionData.paragraphs.length > 0) {
    sectionData.paragraphs.forEach(p => {
      if (p.estCharsPerLine > 90) {
        issues.push({ severity: 'INFO', section: sectionId, detail: `Paragraph "${p.text}..." is ~${p.estCharsPerLine} chars/line (optimal: 45-75)` })
      }
    })
  }

  // Screenshot the section
  const sectionEl = await page.$(`#${sectionId}`)
  if (sectionEl) {
    await sectionEl.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    await sectionEl.screenshot({ path: `${OUTPUT}/tablet-section-${sectionId}.png` })
    console.log('  Screenshot saved.')
  }
}

// ─── PHASE 5: Footer audit ───────────────────────────────────────────
console.log('\n--- FOOTER ---')
const footerData = await page.evaluate(() => {
  const footer = document.querySelector('footer')
  if (!footer) return { found: false }

  const rect = footer.getBoundingClientRect()
  const grids = []
  footer.querySelectorAll('[class*="grid"]').forEach(grid => {
    const gridStyle = window.getComputedStyle(grid)
    const cols = gridStyle.gridTemplateColumns
    const children = grid.children
    const childSizes = []
    Array.from(children).forEach((child, i) => {
      const childRect = child.getBoundingClientRect()
      childSizes.push({
        index: i,
        width: Math.round(childRect.width),
        height: Math.round(childRect.height),
      })
    })
    grids.push({
      columns: cols,
      colCount: cols.split(' ').filter(c => c && c !== 'none').length,
      childCount: children.length,
      childSizes,
    })
  })

  return { found: true, width: Math.round(rect.width), height: Math.round(rect.height), grids }
})

if (footerData.found) {
  console.log(`  Size: ${footerData.width}x${footerData.height}`)
  footerData.grids.forEach((grid, gi) => {
    console.log(`  Grid ${gi}: ${grid.colCount} cols, ${grid.childCount} items`)
    grid.childSizes.forEach(cs => {
      console.log(`    Item ${cs.index}: ${cs.width}x${cs.height}`)
    })
  })
}

const footerEl = await page.$('footer')
if (footerEl) {
  await footerEl.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await footerEl.screenshot({ path: `${OUTPUT}/tablet-footer.png` })
  console.log('  Screenshot saved.')
}

// ─── PHASE 6: Scroll-through screenshots (viewport-sized chunks) ─────
console.log('\n--- SCROLL-THROUGH ---')
const totalHeight = await page.evaluate(() => document.body.scrollHeight)
const chunks = Math.ceil(totalHeight / VIEWPORT.height)
for (let i = 0; i < chunks; i++) {
  const y = i * VIEWPORT.height
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUTPUT}/tablet-scroll-${String(i).padStart(2, '0')}.png` })
  console.log(`  Scroll chunk ${i}: y=${y}`)
}

await browser.close()

// ─── SUMMARY ─────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(60))
console.log('TABLET AUDIT SUMMARY (768x1024)')
console.log('='.repeat(60))
if (issues.length === 0) {
  console.log('0 issues found. Clean layout at tablet viewport.')
} else {
  const critical = issues.filter(i => i.severity === 'CRITICAL')
  const warnings = issues.filter(i => i.severity === 'WARNING')
  const info = issues.filter(i => i.severity === 'INFO')

  if (critical.length) {
    console.log(`\nCRITICAL (${critical.length}):`)
    critical.forEach(i => console.log(`  [${i.section}] ${i.detail}`))
  }
  if (warnings.length) {
    console.log(`\nWARNING (${warnings.length}):`)
    warnings.forEach(i => console.log(`  [${i.section}] ${i.detail}`))
  }
  if (info.length) {
    console.log(`\nINFO (${info.length}):`)
    info.forEach(i => console.log(`  [${i.section}] ${i.detail}`))
  }

  console.log(`\nTotal: ${issues.length} issues (${critical.length} critical, ${warnings.length} warnings, ${info.length} info)`)
}
console.log(`\nScreenshots: ${OUTPUT}/`)
