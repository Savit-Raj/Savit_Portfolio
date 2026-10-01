/**
 * Server entry, used only at build time by scripts/prerender.mjs. Renders the page to static HTML
 * so search engines and AI agents (most of which don't run JavaScript) see the full content.
 * The browser then hydrates that HTML into the live, animated app (see main.tsx).
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { site } from '@/config/site'
export { llmsFullTxt, llmsTxt, robotsTxt, sitemapXml } from '@/seo/agentFiles'
export { structuredData } from '@/seo/structuredData'
