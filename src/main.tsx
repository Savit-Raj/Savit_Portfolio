import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is pre-rendered at build time (scripts/prerender.mjs), so attach to it;
// the dev server serves an empty root, so render from scratch.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
