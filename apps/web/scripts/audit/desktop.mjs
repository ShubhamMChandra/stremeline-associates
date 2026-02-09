/**
 * DESKTOP AUDIT — Full-page screenshot at 1440x900
 * Prerequisites: pnpm dev running on port 3000
 * Run: node scripts/audit/desktop.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const OUTPUT = './audit-screenshots'
fs.mkdirSync(OUTPUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

console.log('Desktop audit (1440x900)\n')

await page.goto('http://localhost:3001')
await page.waitForTimeout(2500) // Wait for animations/beams

await page.screenshot({ path: `${OUTPUT}/desktop-home.png`, fullPage: true })
console.log(`Done: ${OUTPUT}/desktop-home.png`)

await browser.close()
