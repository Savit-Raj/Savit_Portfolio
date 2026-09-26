import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Accent, SectionHeader } from '@/components/ui/SectionHeader'
import { Tag } from '@/components/ui/Tag'
import { PillarVisual } from '@/components/visuals/pillars/PillarVisual'
import { pillars } from '@/data/pillars'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import type { Pillar } from '@/types/content'

const AUTO_ADVANCE_MS = 6500
const EASE = [0.16, 1, 0.3, 1] as const

export function Playbook() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)
  const inView = useInView(panelRef, { margin: '-20% 0px' })
  const reduced = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  // Auto-touring reflows the stacked mobile layout under the reader's thumb, so desktop only.
  const touring = auto && inView && !reduced && desktop

  useEffect(() => {
    if (!touring) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % pillars.length), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(id)
  }, [active, touring])

  const select = (i: number) => {
    setAuto(false)
    setActive(i)
  }

  const pillar = pillars[active]

  return (
    <section id="playbook" className="relative border-t border-white/[0.06] py-28 md:py-40">
      <div className="container-page">
        <SectionHeader
          index="02"
          label="The playbook"
          title={['Six pillars behind', <>every agent <Accent>I ship.</Accent></>]}
          intro="Six months of production Agentic RAG, boiled down. This is the checklist I bring to every client build."
        />

        <div ref={panelRef} className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* index */}
          <ol className="flex flex-col lg:col-span-5" role="tablist" aria-label="Agentic RAG pillars" aria-orientation="vertical">
            {pillars.map((p, i) => {
              const isActive = i === active
              return (
                <li key={p.id} className="border-t border-white/[0.07] last:border-b">
                  <button
                    role="tab"
                    id={`pillar-tab-${p.id}`}
                    aria-selected={isActive}
                    aria-controls="pillar-panel"
                    onClick={() => select(i)}
                    className="group relative flex w-full items-baseline gap-5 py-5 text-left"
                  >
                    <span className={cn('font-mono text-xs transition-colors', isActive ? 'text-signal' : 'text-fog-600')}>
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          'block text-2xl font-medium tracking-tight transition-colors duration-300 md:text-[28px]',
                          isActive ? 'text-fog-50' : 'text-fog-500 group-hover:text-fog-200',
                        )}
                      >
                        {p.title}
                      </span>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.span
                            className="block overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                          >
                            <span className="block pt-2 font-serif text-lg italic text-fog-400">{p.tagline}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    {isActive && (
                      <span className="absolute inset-x-0 -top-px h-px overflow-hidden" aria-hidden>
                        <motion.span
                          key={`${active}-${touring}`}
                          className="block h-full origin-left bg-signal"
                          initial={{ scaleX: touring ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: touring ? AUTO_ADVANCE_MS / 1000 : 0, ease: 'linear' }}
                        />
                      </span>
                    )}
                  </button>

                  {/* mobile: the panel opens inline under its tab */}
                  <AnimatePresence initial={false}>
                    {isActive && !desktop && (
                      <motion.div
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        <div className="pb-6" id="pillar-panel" role="tabpanel" aria-labelledby={`pillar-tab-${p.id}`}>
                          <PillarCard pillar={p} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>

          {/* desktop: sticky panel */}
          {desktop && (
            <div className="lg:col-span-7">
              <div id="pillar-panel" role="tabpanel" aria-labelledby={`pillar-tab-${pillar.id}`} className="lg:sticky lg:top-28">
                <PillarCard pillar={pillar} animated />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function PillarCard({ pillar, animated }: { pillar: Pillar; animated?: boolean }) {
  const swap = animated
    ? {
        initial: { opacity: 0, scale: 0.97, filter: 'blur(6px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.02, filter: 'blur(6px)' },
        transition: { duration: 0.45, ease: EASE },
      }
    : {}

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60">
      <div className="relative border-b border-white/[0.07] bg-grid px-4 py-6 md:px-10 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(200_255_61/0.06),transparent_70%)]" />
        <AnimatePresence mode="wait">
          <motion.div key={pillar.id} {...swap} className="relative mx-auto max-w-[560px]">
            <PillarVisual id={pillar.id} />
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={pillar.id}
          {...(animated
            ? {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -6 },
                transition: { duration: 0.4, ease: EASE },
              }
            : {})}
          className="px-5 py-6 md:px-10 md:py-8"
        >
          <p className="text-pretty leading-relaxed text-fog-200 md:text-[17px]">{pillar.body}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {pillar.techniques.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
