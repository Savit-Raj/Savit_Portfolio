import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { CursorFollower } from '@/components/layout/CursorFollower'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Toaster } from '@/components/layout/Toaster'
import { useModHotkey } from '@/hooks/useHotkey'
import { SmoothScrollProvider } from '@/providers/SmoothScroll'
import { CaseStudy } from '@/sections/CaseStudy'
import { Contact } from '@/sections/Contact'
import { Hero } from '@/sections/Hero'
import { Journey } from '@/sections/Journey'
import { Metrics } from '@/sections/Metrics'
import { Playbook } from '@/sections/Playbook'
import { Process } from '@/sections/Process'
import { Services } from '@/sections/Services'
import { Stack } from '@/sections/Stack'
import { Work } from '@/sections/Work'

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  useModHotkey('k', () => setPaletteOpen((v) => !v))

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main">
          <Hero />
          <Metrics />
          <CaseStudy />
          <Playbook />
          <Work />
          <Services />
          <Process />
          <Journey />
          <Stack />
          <Contact />
        </main>

        <Footer />

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <Toaster />
        <CursorFollower />
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] bg-grain opacity-[0.025]" />
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
