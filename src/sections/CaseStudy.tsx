import { motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Accent, SectionHeader } from '@/components/ui/SectionHeader'
import { Tag } from '@/components/ui/Tag'
import { RagFlowDiagram, type RagMode } from '@/components/visuals/RagFlowDiagram'
import { cn } from '@/lib/utils'

const story = [
  {
    label: 'The problem',
    body: 'A production tax-domain assistant built as classic retrieve-then-generate RAG. It worked, but every request fanned out into 25–30 LLM calls, and nothing checked the evidence before answering.',
  },
  {
    label: 'What I did',
    body: 'Led the migration to an agentic architecture on LangGraph + Milvus. The agent rewrites and decomposes queries, retrieves with hybrid search, grades its evidence, retries when it’s weak, and reflects before it answers.',
  },
  {
    label: 'The outcome',
    body: 'Far fewer LLM calls, ~5× lower cost per request, and answers that stay reliable at scale.',
  },
]

const comparisons = [
  { label: 'LLM calls / request', before: '25–30', after: '15–20', ratio: 17.5 / 27.5 },
  { label: 'Inference cost / request', before: '$0.30–0.40', after: '$0.07–0.08', ratio: 0.075 / 0.35 },
]

export function CaseStudy() {
  const [mode, setMode] = useState<RagMode>('after')

  return (
    <section id="flagship" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeader
          index="01"
          label="Flagship build · EY"
          title={['Rebuilding an enterprise', <>tax assistant as <Accent>Agentic RAG.</Accent></>]}
          intro="From a pipeline that retrieves once and hopes, to an agent that reasons, checks itself and corrects course."
        />

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* narrative */}
          <div className="flex flex-col gap-10 lg:col-span-4">
            {story.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="border-l border-white/10 pl-6">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">{s.label}</p>
                <p className="text-pretty leading-relaxed text-fog-200">{s.body}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2} className="flex flex-wrap gap-2 pl-6">
              {['LangGraph', 'Milvus', 'Hybrid search', 'Corrective RAG', 'Prompt optimisation', 'Python'].map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </Reveal>
          </div>

          {/* interactive diagram */}
          <Reveal delay={0.1} className="min-w-0 lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 md:px-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog-500">Architecture</p>
                <div role="tablist" aria-label="Architecture version" className="relative flex rounded-full border border-white/10 bg-ink-950/60 p-1">
                  {(['before', 'after'] as const).map((m) => (
                    <button
                      key={m}
                      role="tab"
                      aria-selected={mode === m}
                      onClick={() => setMode(m)}
                      className={cn(
                        'relative rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors',
                        mode === m ? (m === 'after' ? 'text-ink-950' : 'text-fog-50') : 'text-fog-500 hover:text-fog-200',
                      )}
                    >
                      {mode === m && (
                        <motion.span
                          layoutId="rag-toggle"
                          className={cn('absolute inset-0 -z-0 rounded-full', m === 'after' ? 'bg-signal' : 'bg-white/10')}
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">{m === 'before' ? 'Before · RAG' : 'After · Agentic'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto bg-grid px-3 py-6 md:px-8 md:py-10" role="tabpanel">
                <div className="min-w-[540px]">
                  <RagFlowDiagram mode={mode} />
                </div>
              </div>

              <div className="grid gap-px border-t border-white/[0.07] bg-white/[0.07] md:grid-cols-2">
                {comparisons.map((c) => (
                  <div key={c.label} className="bg-ink-900 px-5 py-5 md:px-7">
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">{c.label}</p>
                    <Bar label="before" value={c.before} ratio={1} dim={mode === 'after'} />
                    <Bar label="after" value={c.after} ratio={c.ratio} accent dim={mode === 'before'} />
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog-600">
              <span className="md:hidden">Swipe the diagram · </span>Architecture simplified · client data stays confidential
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Bar({ label, value, ratio, accent, dim }: { label: string; value: string; ratio: number; accent?: boolean; dim?: boolean }) {
  return (
    <div className={cn('mb-2 grid grid-cols-[52px_1fr_auto] items-center gap-3 transition-opacity duration-500 last:mb-0', dim && 'opacity-40')}>
      <span className="font-mono text-[10px] uppercase text-fog-500">{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          className={cn('h-full origin-left rounded-full', accent ? 'bg-signal' : 'bg-fog-500')}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: ratio }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: accent ? 0.4 : 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className={cn('min-w-[88px] text-right font-mono text-xs tabular-nums', accent ? 'text-signal' : 'text-fog-200')}>{value}</span>
    </div>
  )
}
