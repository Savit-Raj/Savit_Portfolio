import { LayoutGroup, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

const STAGES = ['Applied', 'Screening', 'Technical', 'Offer']
const STATIC: Record<number, string[]> = {
  0: ['A. Mehta', 'R. Iyer', 'K. Das'],
  1: ['S. Gupta', 'P. Nair'],
  2: ['J. Rao'],
  3: [],
}

/** TalentFlow's pipeline: one candidate drags through the stages on a loop. */
export function KanbanVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const id = window.setInterval(() => setStage((s) => (s + 1) % STAGES.length), 1500)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  return (
    <div ref={ref} className="grid h-full grid-cols-4 gap-2 p-4" aria-hidden>
      <LayoutGroup>
        {STAGES.map((name, col) => (
          <div key={name} className="flex min-w-0 flex-col gap-1.5 rounded-xl bg-white/[0.025] p-1.5">
            <div className="flex items-center justify-between px-1 pb-1 pt-0.5">
              <span className="truncate font-mono text-[9px] uppercase tracking-wider text-fog-500">{name}</span>
              <span className="font-mono text-[9px] text-fog-600">{STATIC[col].length + (stage === col ? 1 : 0)}</span>
            </div>
            {stage === col && (
              <motion.div
                layoutId="moving-candidate"
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="rounded-lg border border-violet/60 bg-violet/15 px-2 py-1.5 shadow-[0_8px_24px_-8px_rgb(165_139_255/0.6)]"
              >
                <div className="truncate text-[10px] font-medium text-fog-50">N. Sharma</div>
                <div className="mt-1 h-1 w-3/4 rounded-full bg-violet/50" />
              </motion.div>
            )}
            {STATIC[col].map((n) => (
              <motion.div layout key={n} className="rounded-lg border border-white/[0.07] bg-ink-800 px-2 py-1.5">
                <div className="truncate text-[10px] text-fog-400">{n}</div>
                <div className="mt-1 h-1 w-1/2 rounded-full bg-white/10" />
              </motion.div>
            ))}
          </div>
        ))}
      </LayoutGroup>
    </div>
  )
}
