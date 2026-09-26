/**
 * Regenerates public/og-image.png and public/apple-touch-icon.png.
 *
 *   npm i -D puppeteer            (once; or puppeteer-core + CHROME_PATH)
 *   node scripts/og/render.mjs
 */
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')

let puppeteer
try {
  puppeteer = (await import('puppeteer')).default
} catch {
  puppeteer = (await import('puppeteer-core')).default
}

const browser = await puppeteer.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--allow-file-access-from-files'],
})
const page = await browser.newPage()

await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(path.join(here, 'og-image.html')).href, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(root, 'public/og-image.png') })

await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 })
await page.setContent(
  `<body style="margin:0;background:#0a0b0d;display:grid;place-items:center;width:180px;height:180px">
     <svg width="120" height="120" viewBox="0 0 32 32">
       <path d="M22 9.5c-1.4-1.6-3.5-2.5-6-2.5-3.6 0-6 1.9-6 4.6 0 5.8 12 3.6 12 9.4 0 2.8-2.6 4.9-6.4 4.9-2.7 0-5-1-6.6-2.8" fill="none" stroke="#d9d8d1" stroke-width="1.8" stroke-linecap="round"/>
       <circle cx="22" cy="9.5" r="2.6" fill="#c8ff3d"/><circle cx="16" cy="16" r="1.9" fill="#f6f5f0"/><circle cx="9" cy="23.1" r="2.6" fill="#c8ff3d"/>
     </svg>
   </body>`,
)
await page.screenshot({ path: path.join(root, 'public/apple-touch-icon.png') })

await browser.close()
console.log('✓ public/og-image.png, public/apple-touch-icon.png')
