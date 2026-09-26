import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { traceScenarios } from '@/data/traces'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import type { TraceKind } from '@/types/content'

const KIND: Record<TraceKind, { label: string; className: string }> = {
  user: { label: 'user', className: 'text-fog-50' },
  plan: { label: 'plan', className: 'text-violet' },
  tool: { label: 'tool', className: 'text-cyan' },
  observe: { label: 'obs', className: 'text-fog-400' },
  grade: { label: 'grade', className: 'text-ember' },
  reflect: { label: 'reflect', className: 'text-rose' },
  hitl: { label: 'human', className: 'text-signal' },
  answer: { label: 'answer', className: 'text-signal' },
}

const TYPE_MS = 16
const LINE_PAUSE_MS = 420
const HITL_PAUSE_MS = 1500
const HOLD_MS = 3400

/**
 * A scripted "live" agent run: each step types out, spend and LLM-call counters tick,
 * then the next scenario starts. Only runs while visible.
 */
export function AgentTrace({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-5% 0px' })
  const reduced = usePrefersReducedMotion()

  const [scenario, setScenario] = useState(0)
  const [step, setStep] = useState(0) // index of the step currently typing
  const [chars, setChars] = useState(0)
  const [run, setRun] = useState(142)

  const current = traceScenarios[scenario]
  const steps = current.steps
  const finished = step >= steps.length
  const running = inView && !reduced

  useEffect(() => {
    if (!running) return
    let id: number
    if (finished) {
      id = window.setTimeout(() => {
        setScenario((s) => (s + 1) % traceScenarios.length)
        setStep(0)
        setChars(0)
        setRun((r) => r + 1)
      }, HOLD_MS)
    } else if (chars < steps[step].text.length) {
      id = window.setTimeout(() => setChars((c) => Math.min(c + 2, steps[step].text.length)), TYPE_MS)
    } else {
      const pause = steps[step].kind === 'hitl' ? HITL_PAUSE_MS : LINE_PAUSE_MS
      id = window.setTimeout(() => {
        setStep((s) => s + 1)
        setChars(0)
      }, pause)
    }
    return () => window.clearTimeout(id)
  }, [running, finished, chars, step, steps])

  const visibleCount = reduced ? steps.length : Math.min(step + 1, steps.length)
  const done = reduced ? steps.length : step

  const stats = useMemo(() => {
    const completed = steps.slice(0, done)
    return {
      calls: completed.filter((s) => s.llm).length,
      cost: completed.reduce((sum, s) => sum + (s.cost ?? 0), 0),
    }
  }, [steps, done])

  const awaitingHuman = !reduced && !finished && steps[step]?.kind === 'hitl'
  const status = finished || reduced ? 'done' : awaitingHuman ? 'awaiting human' : 'running'

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/75 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-lg',
        className,
      )}
      role="img"
      aria-label={`Simulated agent run: ${steps.map((s) => `${KIND[s.kind].label}: ${s.text}`).join('. ')}`}
    >
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <p className="font-mono text-[11px] text-fog-500">
          {current.agent}
          <span className="text-fog-600"> · run #{String(run).padStart(4, '0')}</span>
        </p>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
            status === 'awaiting human' ? 'bg-signal/15 text-signal' : 'bg-white/[0.06] text-fog-400',
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              status === 'done' ? 'bg-fog-500' : status === 'awaiting human' ? 'bg-signal animate-pulse' : 'bg-cyan animate-pulse',
            )}
          />
          {status}
        </span>
      </div>

      {/* log */}
      <div
        aria-hidden
        className="flex h-[272px] flex-col justify-end gap-2 overflow-hidden px-4 py-4 font-mono text-[12px] leading-[1.55] [mask-image:linear-gradient(to_bottom,transparent,black_22%)]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {steps.slice(0, visibleCount).map((s, i) => {
            const typing = !reduced && i === step && !finished
            const text = typing ? s.text.slice(0, chars) : s.text
            const meta = KIND[s.kind]
            return (
              <motion.div
                key={`${scenario}-${i}`}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-3"
              >
                <span className={cn('w-[52px] shrink-0 text-right', meta.className, 'opacity-80')}>{meta.label}</span>
                <span
                  className={cn(
                    'min-w-0 flex-1',
                    s.kind === 'user' ? 'text-fog-50' : s.kind === 'answer' ? 'text-fog-50' : 'text-fog-400',
                    s.kind === 'hitl' && 'text-signal',
                  )}
                >
                  {s.kind === 'user' && <span className="text-signal">› </span>}
                  {text}
                  {typing && <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-blink bg-signal" />}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* telemetry */}
      <div className="grid grid-cols-3 border-t border-white/[0.07] font-mono text-[11px]">
        <Stat label="steps" value={`${done}/${steps.length}`} />
        <Stat label="llm calls" value={String(stats.calls)} />
        <Stat label="cost" value={`$${stats.cost.toFixed(3)}`} accent />
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-r border-white/[0.07] px-4 py-2.5 last:border-r-0">
      <span className="text-fog-600">{label}</span>
      <span className={cn('tabular-nums', accent ? 'text-signal' : 'text-fog-200')}>{value}</span>
    </div>
  )
}
