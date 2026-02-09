/**
 * RESPONSIVE AUDIT — Desktop + Tablet + Mobile comparison
 * Prerequisites: pnpm dev running on port 3000
 * Run: node scripts/audit/responsive.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots'
fs.mkdirSync(OUTPUT, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
]

console.log('Responsive audit\n')

const browser = await chromium.launch()

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto('http://localhost:3001')
  await page.waitForTimeout(2000)
  const filename = `responsive-${vp.name}.png`
  await page.screenshot({ path: `${OUTPUT}/${filename}`, fullPage: true })
  console.log(`Done: ${filename} (${vp.width}x${vp.height})`)
  await page.close()
}

console.log(`\nScreenshots: ${OUTPUT}/`)
await browser.close()
