import { motion } from 'motion/react'
import { ArrowUpRight, Bot, FileSearch, Gauge, Layers, Mic, Workflow } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Accent, SectionHeader } from '@/components/ui/SectionHeader'
import { engagements, services } from '@/data/services'
import { useSpotlight } from '@/hooks/useSpotlight'
import { useSmoothScroll } from '@/providers/SmoothScroll'
import type { Service } from '@/types/content'

const icons: Record<Service['icon'], typeof Bot> = {
  bot: Bot,
  workflow: Workflow,
  file: FileSearch,
  gauge: Gauge,
  mic: Mic,
  layers: Layers,
}

export function Services() {
  const onPointerMove = useSpotlight<HTMLElement>()
  const { scrollTo } = useSmoothScroll()

  const toContact = (e: MouseEvent) => {
    e.preventDefault()
    scrollTo('#contact')
  }

  return (
    <section id="services" className="relative border-t border-white/[0.06] py-28 md:py-40">
      <div className="container-page">
        <SectionHeader
          index="04"
          label="Services"
          title={['What I can build', <><Accent>for you.</Accent></>]}
          intro="Freelance engagements for teams who want AI that does real work in production, not just a demo."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08 }}
                onPointerMove={onPointerMove}
                className="group relative isolate flex flex-col bg-ink-900 p-7 md:p-9"
              >
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 spotlight transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mb-10 flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-fog-200 transition-all duration-500 ease-out-expo group-hover:-rotate-6 group-hover:border-signal/50 group-hover:text-signal">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-xs text-fog-600">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-medium tracking-tight md:text-2xl">{s.title}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-fog-400">{s.body}</p>
                <ul className="mt-8 grid grid-cols-1 gap-2 border-t border-white/[0.07] pt-6 font-mono text-[11.5px] text-fog-500">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 transition-colors group-hover:text-fog-200">
                      <span className="text-signal">+</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </div>

        {/* engagement models */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-fog-500">Ways to work together</p>
            <p className="mt-4 max-w-sm text-pretty text-lg leading-relaxed text-fog-200">
              Start small and de-risk, or bring me in for the whole build. Pricing depends on scope, so let’s talk.
            </p>
            <a
              href="#contact"
              onClick={toContact}
              className="group mt-6 inline-flex items-center gap-2 text-signal"
            >
              <span className="border-b border-signal/40 pb-0.5 transition-colors group-hover:border-signal">Get a quote in 24h</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            {engagements.map((e, i) => (
              <Reveal
                key={e.name}
                delay={i * 0.08}
                className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{e.duration}</p>
                <h3 className="mt-3 text-lg font-medium tracking-tight">{e.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog-400">{e.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
