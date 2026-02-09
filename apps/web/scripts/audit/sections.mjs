/**
 * SECTIONS AUDIT — Individual section screenshots at desktop + mobile
 * Prerequisites: pnpm dev running on port 3000
 * Run: node scripts/audit/sections.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots'
fs.mkdirSync(OUTPUT, { recursive: true })

const sections = ['hero', 'capabilities', 'social-proof', 'use-cases', 'cta']
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
]

console.log('Sections audit\n')

const browser = await chromium.launch()

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto('http://localhost:3001')
  await page.waitForTimeout(2500)

  for (const sectionId of sections) {
    const section = await page.$(`#${sectionId}`)
    if (section) {
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
      const filename = `section-${sectionId}-${vp.name}.png`
      await section.screenshot({ path: `${OUTPUT}/${filename}` })
      console.log(`Done: ${filename}`)
    } else {
      console.log(`MISSING: #${sectionId} not found at ${vp.name}`)
    }
  }
  await page.close()
}

console.log(`\nScreenshots: ${OUTPUT}/`)
await browser.close()
