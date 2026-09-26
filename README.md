# savit.raj — portfolio & freelance site

Personal site of **Savit Raj**, Agentic AI engineer at EY.
It's a single-page React app with hand-built generative visuals: a 3D agent graph, a live agent trace, animated architecture diagrams and project visuals. It's fully static, so no backend is needed.

```
Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · Motion
```

> **Moving to another computer?** Follow [SETUP.md](SETUP.md): how to zip it, install Node, run it, and troubleshoot.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
```

Node 20+ recommended.

---

## Project structure

```
├─ index.html                  SEO meta, Open Graph, JSON-LD (Person schema)
├─ vercel.json                 cache + security headers
├─ public/
│  ├─ favicon.svg · apple-touch-icon.png · og-image.png
│  ├─ robots.txt · sitemap.xml
│  └─ media/                   ← drop project demo videos here (see below)
├─ scripts/og/                 HTML template + script that renders og-image.png
└─ src/
   ├─ config/site.ts           ★ identity, links, availability, résumé toggle
   ├─ data/                    ★ ALL copy lives here — edit content without touching components
   │  ├─ projects.ts             project cards (links, stack, highlights, video paths)
   │  ├─ metrics.ts              the numbers strip under the hero
   │  ├─ pillars.ts              the six-pillars playbook
   │  ├─ services.ts             services, engagement models, process steps
   │  ├─ journey.ts              experience, education, achievements, toolbox
   │  └─ traces.ts               scripted agent runs shown in the hero terminal
   ├─ types/content.ts         typed content model for everything in data/
   ├─ sections/                one file per page section, in page order
   ├─ components/
   │  ├─ layout/               navbar, ⌘K command palette, footer, cursor, toasts
   │  ├─ ui/                   primitives: Button, Reveal, ScrambleText, Counter, Marquee…
   │  └─ visuals/              canvas/SVG generative art
   │     ├─ AgentGraphCanvas.tsx   dependency-free pseudo-3D force graph on <canvas>
   │     ├─ AgentTrace.tsx         typed-out ReAct trace with live cost/LLM-call counters
   │     ├─ RagFlowDiagram.tsx     before/after Agentic RAG architecture
   │     ├─ pillars/               six looping micro-diagrams
   │     └─ projects/              per-project visuals + video fallback logic
   ├─ hooks/                   media queries, scroll-spy, hotkeys, local time, spotlight
   ├─ providers/SmoothScroll   native smooth scrolling to sections + scroll lock for dialogs
   ├─ lib/                     utils, toast store, contact-form delivery
   └─ styles/globals.css       design tokens (@theme), base styles, utilities
```

---

## Common edits

| I want to… | Edit |
| --- | --- |
| Change email, socials, availability text | `src/config/site.ts` |
| Add / reorder a project | `src/data/projects.ts` (`size: 'lg'` = full-width feature card) |
| Hide a project without deleting it | set `hidden: true` on it in `src/data/projects.ts` (CreditSea is hidden this way) |
| Update numbers in the metrics strip | `src/data/metrics.ts` |
| Add a job, achievement or skill | `src/data/journey.ts` |
| Change services or pricing language | `src/data/services.ts`, `src/sections/Services.tsx` |
| Tweak colours or fonts | `@theme` block in `src/styles/globals.css` |

### Adding the demo videos

Project cards look for a clip and fall back to the generative visual if it's missing:

| Project | Expected file |
| --- | --- |
| RAG Topic Graph Visualizer | `public/media/rag-topic-graph.mp4` |
| Face Recognition Attendance | `public/media/face-recognition.mp4` |

Tips: export **muted, 720p, H.264 MP4, under ~5 MB, 10–20 s**. The clip autoplays and loops inside the card, and it only loads once the card is near the viewport.
To add a video to any other project, set `video: '/media/<file>.mp4'` in `projects.ts`.

### Contact form

Submissions go straight to your inbox through [FormSubmit](https://formsubmit.co). No backend, no API key.

**One-time activation (do this once after deploying):** submit the form yourself. FormSubmit emails
`savitraj81597@gmail.com` an **"Activate Form"** link. Click it, and every later submission is delivered.
Until then, visitors see a friendly note and one-click Gmail/Outlook drafts, so no inquiry is lost.

Optional:

- **Hide your address from network requests:** the activation email includes a random-string alias.
  Set `VITE_FORMSUBMIT_ID=<alias>` in `.env.local` and in Vercel (**Project → Settings → Environment Variables**).
- **Use Web3Forms instead:** set `VITE_WEB3FORMS_ACCESS_KEY` (free at [web3forms.com](https://web3forms.com)). It takes priority when present.

Nothing on the site uses `mailto:` links. They depend on the visitor's computer having a mail app registered;
when a browser is registered instead, you get a blank window. Email actions copy the address or open a
Gmail/Outlook web draft. A honeypot field silently drops bot submissions.

### Résumé download

Set `resumeUrl` in `src/config/site.ts` (for example `'/Savit_Raj_Resume.pdf'`) and put the PDF in `public/`.
Use a version **without phone number / date of birth**: everything in `public/` is world-readable.

### Social preview image

`public/og-image.png` is rendered from `scripts/og/og-image.html`. To regenerate it after editing the template:

```bash
npm i -D puppeteer
node scripts/og/render.mjs
```

---

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → import the repo**. It auto-detects Vite (`vercel.json` pins the build).
3. Once you know the final domain, replace `savitraj.vercel.app` in:
   `index.html` (canonical, og:url, og:image, JSON-LD), `public/robots.txt`, `public/sitemap.xml`, `src/config/site.ts`.

---

## Engineering notes

- **Performance**
  - Scrolling is native, so the browser scrolls on the compositor thread and stays smooth while animations run. No JS scroll-jacking.
  - Canvas loops pause when off-screen (IntersectionObserver) and in background tabs.
  - Looping SVG visuals only mount while near the viewport, and demo videos pause off-screen.
  - Canvas renders at full Retina resolution (DPR capped at 2), and glow sprites are pre-rendered instead of using `shadowBlur`.
  - The canvas watches its own frame pacing: on slow, software-rendered devices it freezes during scroll; GPU machines (M1 etc.) keep animating.
  - Per-frame animation writes straight to the DOM instead of re-rendering React.
  - No `mix-blend-mode` or backdrop blur over animated regions: both force re-compositing on every frame.
  - Fonts are self-hosted via Fontsource, and Motion ships as its own long-cached chunk.
- **Accessibility**
  - Semantic landmarks, a skip link, visible focus rings, and ARIA tabs for the architecture toggle and playbook.
  - The command palette is a combobox/listbox dialog.
  - Decorative visuals are `aria-hidden`; meaningful diagrams carry a text alternative.
- **Reduced motion**
  - With `prefers-reduced-motion`, smooth section jumps, the custom cursor, auto-advance and looping animations are switched off.
  - Canvases render a single static frame and the agent trace shows its full run.
- **Keyboard**
  - `⌘K` / `Ctrl K` opens the command palette to jump to any section, copy the email, or open links.
