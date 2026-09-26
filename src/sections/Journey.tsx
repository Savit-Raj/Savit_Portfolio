import { motion } from 'motion/react'
import { ArrowUpRight, Award, GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Accent, SectionHeader } from '@/components/ui/SectionHeader'
import { StatusDot } from '@/components/ui/Tag'
import { achievements, education, roles } from '@/data/journey'
import { cn } from '@/lib/utils'

export function Journey() {
  return (
    <section id="journey" className="relative border-t border-white/[0.06] py-28 md:py-40">
      <div className="container-page">
        <SectionHeader
          index="06"
          label="About"
          title={['Intern to full-time', <>in <Accent>six months.</Accent></>]}
          intro={
            <>
              I’m Savit, an Agentic AI engineer at EY in Pune and a B.Tech graduate in AI &amp; ML from BIT Mesra. I
              care about the <span className="text-fog-50">why</span> behind an architecture as much as the how, and I
              spend a lot of time with domain experts, because that’s where good agents come from.
            </>
          }
        />

        {/* experience */}
        <ol className="mt-16 border-t border-white/[0.08] lg:mt-24">
          {roles.map((r, i) => (
            <motion.li
              key={r.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative grid gap-4 border-b border-white/[0.08] py-10 md:grid-cols-12 md:gap-8"
            >
              <div className="pointer-events-none absolute inset-y-0 -left-4 -right-4 -z-10 rounded-2xl bg-white/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="md:col-span-3">
                <p className="font-mono text-xs text-fog-500">{r.period}</p>
                <p className="mt-1 font-mono text-xs text-fog-600">{r.location}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="flex flex-wrap items-center gap-3 text-2xl font-medium tracking-tight md:text-3xl">
                  {r.company}
                  {r.current && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-signal">
                      <StatusDot className="size-1.5" /> Now
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-fog-200">{r.role}</p>
                {r.note && <p className="mt-1 font-serif text-lg italic text-fog-400">{r.note}</p>}
                {r.certificate && (
                  <a
                    href={r.certificate}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fog-500 transition-colors hover:text-signal"
                  >
                    Certificate <ArrowUpRight className="size-3" />
                  </a>
                )}
              </div>
              <ul className="flex flex-col gap-3 md:col-span-5">
                {r.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-pretty leading-relaxed text-fog-400">
                    <span className="mt-[11px] h-px w-3 shrink-0 bg-fog-600" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>

        {/* education + achievements */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-8">
            <GraduationCap className="size-6 text-signal" strokeWidth={1.5} />
            <p className="mt-8 font-mono text-xs text-fog-500">{education.period}</p>
            <h3 className="mt-2 text-2xl font-medium tracking-tight">{education.school}</h3>
            <p className="mt-2 text-fog-400">{education.degree}</p>
            <p className="mt-8 inline-flex items-baseline gap-2">
              <span className="text-5xl font-medium tracking-tight">8.5</span>
              <span className="font-mono text-xs uppercase tracking-wider text-fog-500">CGPA</span>
            </p>
            <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 bg-[radial-gradient(closest-side,rgb(200_255_61/0.12),transparent)]" aria-hidden />
          </Reveal>

          <Reveal delay={0.08} className="rounded-3xl border border-white/10 bg-ink-900/60 p-8">
            <Award className="size-6 text-signal" strokeWidth={1.5} />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-fog-500">Beyond the code</p>
            <ul className="mt-4 flex flex-col">
              {achievements.map((a, i) => (
                <li
                  key={a}
                  className={cn('flex items-baseline gap-4 py-3 text-fog-200', i > 0 && 'border-t border-white/[0.07]')}
                >
                  <span className="font-mono text-[11px] text-fog-600">0{i + 1}</span>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
