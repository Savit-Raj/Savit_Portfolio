import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Accent, Eyebrow } from '@/components/ui/SectionHeader'
import { RevealLines } from '@/components/ui/Reveal'
import { processSteps } from '@/data/services'

export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="process" className="relative border-t border-white/[0.06] py-28 md:py-40">
      <div className="container-page grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow index="05" label="Process" className="mb-6" />
            <h2 className="text-balance text-[clamp(2.25rem,5.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]">
              <RevealLines lines={['From first call', <>to <Accent>production.</Accent></>]} />
            </h2>
            <p className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-fog-400">
              A process built to avoid AI’s usual failure mode: impressive demos that never reach production. You
              see working software early and measurable results at the end.
            </p>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7">
          {/* rail */}
          <div className="absolute bottom-3 left-[19px] top-3 w-px bg-white/[0.08]" aria-hidden>
            <motion.div className="h-full w-full origin-top bg-signal" style={{ scaleY: progress }} />
          </div>

          {processSteps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative grid grid-cols-[40px_1fr] gap-6 pb-14 last:pb-0"
              initial="idle"
              whileInView="active"
              viewport={{ margin: '0px 0px -50% 0px' }}
            >
              <motion.span
                className="relative z-10 grid size-10 place-items-center rounded-full border font-mono text-xs"
                variants={{
                  idle: { borderColor: 'rgba(255,255,255,0.12)', backgroundColor: '#0a0b0d', color: '#85847e' },
                  active: { borderColor: 'rgba(200,255,61,1)', backgroundColor: '#c8ff3d', color: '#060708' },
                }}
                transition={{ duration: 0.4 }}
              >
                0{i + 1}
              </motion.span>
              <div className="pt-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{s.title}</h3>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10.5px] text-fog-400">
                    → {s.output}
                  </span>
                </div>
                <p className="mt-3 max-w-lg text-pretty leading-relaxed text-fog-400">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
