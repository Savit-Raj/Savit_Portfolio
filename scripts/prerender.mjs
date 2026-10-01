/**
 * Post-build step (part of `npm run build`):
 *   1. renders the app to HTML with the SSR bundle and injects it into dist/index.html
 *   2. fills in the site URL and the JSON-LD structured data
 *   3. writes robots.txt, sitemap.xml, llms.txt and llms-full.txt into dist/
 * Everything is derived from src/config/site.ts and src/data, so there's one source of truth.
 */
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, site, structuredData, llmsTxt, llmsFullTxt, robotsTxt, sitemapXml } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const today = new Date().toISOString().slice(0, 10)
const indexPath = path.join(dist, 'index.html')
let html = await readFile(indexPath, 'utf8')

for (const marker of ['<!--app-html-->', '<!--seo:jsonld-->', '__SITE_URL__']) {
  if (!html.includes(marker)) throw new Error(`prerender: "${marker}" not found in dist/index.html`)
}

// "<" escaped so the JSON can never close the <script> tag early.
const jsonLd = JSON.stringify(structuredData(today)).replace(/</g, '\\u003c')

// Function replacers: the rendered HTML contains "$" (e.g. "$0.30"), which string replacers treat specially.
html = html
  .replace('<!--app-html-->', () => render())
  .replace('<!--seo:jsonld-->', () => `<script type="application/ld+json">${jsonLd}</script>`)
  .replaceAll('__SITE_URL__', () => site.url)

await writeFile(indexPath, html)
await writeFile(path.join(dist, 'robots.txt'), robotsTxt())
await writeFile(path.join(dist, 'sitemap.xml'), sitemapXml(today))
await writeFile(path.join(dist, 'llms.txt'), llmsTxt())
await writeFile(path.join(dist, 'llms-full.txt'), llmsFullTxt())
await rm(ssrDir, { recursive: true, force: true })

const kb = (n) => `${(Buffer.byteLength(n) / 1024).toFixed(1)} kB`
console.log(`✓ prerendered index.html (${kb(html)}) for ${site.url}`)
console.log('✓ robots.txt · sitemap.xml · llms.txt · llms-full.txt')
