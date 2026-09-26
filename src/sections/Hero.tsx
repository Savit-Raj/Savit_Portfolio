import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { RevealLines } from '@/components/ui/Reveal'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { StatusDot } from '@/components/ui/Tag'
import { AgentGraphCanvas } from '@/components/visuals/AgentGraphCanvas'
import { AgentTrace } from '@/components/visuals/AgentTrace'
import { agentPreset } from '@/components/visuals/graphPresets'
import { site } from '@/config/site'
import { useLocalTime } from '@/hooks/useLocalTime'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { useSmoothScroll } from '@/providers/SmoothScroll'

const VERBS = ['reason.', 'retrieve.', 'self-correct.', 'ask first.', 'ship.']
const EASE = [0.16, 1, 0.3, 1] as const

function RotatingVerb() {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const reduced = usePrefersReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced || !inView) return
    const id = window.setInterval(() => setI((v) => (v + 1) % VERBS.length), 2400)
    return () => window.clearInterval(id)
  }, [reduced, inView])

  return (
    <span ref={ref} className="relative inline-grid align-baseline">
      <span className="sr-only">{VERBS.join(' ')}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.em
          key={VERBS[i]}
          aria-hidden
          className="col-start-1 row-start-1 whitespace-nowrap pr-[0.08em] font-serif font-normal italic text-signal"
          initial={{ y: '70%', opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-70%', opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {VERBS[i]}
        </motion.em>
      </AnimatePresence>
    </span>
  )
}

export function Hero() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const time = useLocalTime(site.timeZone)
  const { scrollTo } = useSmoothScroll()

  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* ---------- backdrop ---------- */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_40%,black,transparent)]" />
        <div className="absolute -left-[280px] top-[calc(33%-120px)] size-[760px] bg-[radial-gradient(closest-side,rgb(200_255_61/0.08),transparent)]" />
        <div className="absolute -right-[140px] -top-[140px] size-[900px] bg-[radial-gradient(closest-side,rgb(92_225_255/0.07),transparent)]" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: EASE }}
        >
          <AgentGraphCanvas
            preset={agentPreset}
            centerX={desktop ? 0.74 : 0.5}
            centerY={desktop ? 0.36 : 0.3}
            scale={desktop ? 0.3 : 0.46}
            labels={desktop}
            className={desktop ? '' : 'opacity-35'}
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-page relative grid min-h-[100svh] grid-cols-12 content-center gap-x-8 gap-y-12 pb-28 pt-[calc(var(--header-h)+3rem)] lg:pb-24">
        {/* ---------- copy ---------- */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-ink-900/80 py-1.5 pl-3 pr-4"
          >
            <StatusDot />
            <span className="text-[13px] text-fog-200">{site.availability.label}</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="hidden font-mono text-[11px] text-fog-500 sm:block">{site.availability.responseTime}</span>
          </motion.div>

          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-fog-500">
            <ScrambleText text={`${site.role} @ ${site.company} — ${site.location}`} trigger="mount" delay={300} speed={18} />
          </p>

          <h1 className="text-[clamp(2.4rem,10.4vw,4rem)] font-medium leading-[0.98] tracking-[-0.045em] lg:text-[clamp(3rem,5.9vw,5.6rem)]">
            <RevealLines
              immediate
              delay={0.25}
              stagger={0.09}
              lines={[
                'I turn workflows',
                'into AI agents',
                <>
                  that <RotatingVerb />
                </>,
              ]}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: EASE }}
            className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-fog-400 md:text-xl"
          >
            I'm <span className="text-fog-50">Savit</span>, an Agentic AI engineer at EY. I build end-to-end,
            domain-specific AI automation, from messy PDFs to production Agentic RAG that runs{' '}
            <span className="text-fog-50">~5× cheaper</span>. Now taking on freelance builds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button href="#contact" size="lg" magnetic onClick={jump('contact')} icon={<ArrowUpRight className="size-4" />}>
              Start a project
            </Button>
            <Button href="#work" size="lg" variant="ghost" onClick={jump('work')}>
              See selected work
            </Button>
          </motion.div>
        </div>

        {/* ---------- live agent trace ---------- */}
        <motion.div
          className="col-span-12 lg:col-span-5 lg:self-end xl:col-span-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1, ease: EASE }}
        >
          <AgentTrace className="lg:translate-y-6" />
          <p className="mt-3 text-right font-mono text-[10px] lg:mt-9 uppercase tracking-[0.18em] text-fog-600">
            illustrative run · the patterns I ship
          </p>
        </motion.div>
      </div>

      {/* ---------- footer rail ---------- */}
      <div className="container-page absolute inset-x-0 bottom-0 flex items-center justify-between pb-7 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">
        <a href="#flagship" onClick={jump('flagship')} className="group flex items-center gap-3 transition-colors hover:text-fog-50">
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-full border border-white/10">
            <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
          </span>
          Scroll
        </a>
        <span className="hidden md:block">Shipped at EY · PiTrade (NY) · ASKAI</span>
        <span className="flex items-center gap-2">
          {site.location.split(',')[0]} <span className="text-fog-50">{time}</span> {site.timeZoneLabel}
        </span>
      </div>
    </section>
  )
}
