import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { PathPacket } from './PathPacket'

export type RagMode = 'before' | 'after'

interface FlowNode {
  id: string
  x: number
  y: number
  label: string
  sub: string
}

const W = 104
const H = 48

const BEFORE: FlowNode[] = [
  { id: 'q', x: 70, y: 180, label: 'Query', sub: 'as typed' },
  { id: 'rt', x: 220, y: 180, label: 'Retrieve', sub: 'top-k similarity' },
  { id: 'gen', x: 370, y: 180, label: 'Generate', sub: 'single pass' },
  { id: 'ans', x: 515, y: 180, label: 'Answer', sub: 'unverified' },
]

const AFTER: FlowNode[] = [
  { id: 'q', x: 70, y: 100, label: 'Query', sub: 'user intent' },
  { id: 'rw', x: 218, y: 100, label: 'Rewrite', sub: 'decompose' },
  { id: 'rt', x: 366, y: 100, label: 'Retrieve', sub: 'hybrid · milvus' },
  { id: 'gr', x: 514, y: 100, label: 'Grade', sub: 'relevance' },
  { id: 'gen', x: 514, y: 280, label: 'Generate', sub: 'grounded' },
  { id: 'rf', x: 366, y: 280, label: 'Reflect', sub: 'self-check' },
  { id: 'ans', x: 218, y: 280, label: 'Answer', sub: 'with citations' },
  { id: 'mem', x: 70, y: 280, label: 'Memory', sub: 'short + long' },
]

const AFTER_EDGES = [
  'M122 100 L166 100',
  'M270 100 L314 100',
  'M418 100 L462 100',
  'M514 124 L514 256',
  'M462 280 L418 280',
  'M314 280 L270 280',
]
const RETRY_EDGE = 'M514 76 C514 22 218 22 218 76'
const REFLECT_EDGE = 'M366 256 L366 124'
const MEMORY_EDGES = ['M166 280 L122 280', 'M92 256 C110 190 150 160 190 124']

// Packet route: q → rw → rt → gr ⟲ rw → rt → gr → gen → rf → ans
const AFTER_ROUTE =
  'M70 100 L514 100 L514 76 C514 22 218 22 218 76 L218 100 L514 100 L514 280 L218 280'
const BEFORE_ROUTE = 'M70 180 L515 180'

function Node({ n, active, tone }: { n: FlowNode; active: boolean; tone: 'muted' | 'live' }) {
  return (
    <g transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}>
      <rect
        width={W}
        height={H}
        rx="12"
        className={cn(
          'transition-[fill,stroke] duration-300',
          active ? 'fill-[#1a2410] stroke-signal' : tone === 'muted' ? 'fill-ink-850 stroke-white/10' : 'fill-ink-850 stroke-white/15',
        )}
        strokeWidth="1"
      />
      <text x={W / 2} y="21" textAnchor="middle" className={cn('text-[13px] font-medium', active ? 'fill-signal' : 'fill-fog-50')}>
        {n.label}
      </text>
      <text x={W / 2} y="36" textAnchor="middle" className="fill-fog-500 font-mono text-[9.5px]">
        {n.sub}
      </text>
    </g>
  )
}

export function RagFlowDiagram({ mode }: { mode: RagMode }) {
  const [active, setActive] = useState<string | null>(null)
  const [gradeVisits, setGradeVisits] = useState(0)
  const lastActive = useRef<string | null>(null)
  const nodes = mode === 'after' ? AFTER : BEFORE

  const onMove = useCallback(
    (x: number, y: number, k: number) => {
      if (k < 0) {
        if (lastActive.current !== null) {
          lastActive.current = null
          setActive(null)
          setGradeVisits(0)
        }
        return
      }
      let hit: string | null = null
      for (const n of nodes) if (Math.abs(n.x - x) < W / 2 && Math.abs(n.y - y) < H / 2) hit = n.id
      if (hit !== lastActive.current) {
        lastActive.current = hit
        setActive(hit)
        if (hit === 'gr') setGradeVisits((v) => v + 1)
      }
    },
    [nodes],
  )

  return (
    <svg viewBox="0 0 584 360" className="h-auto w-full" role="img" aria-labelledby="rag-diagram-title">
      <title id="rag-diagram-title">
        {mode === 'after'
          ? 'Agentic RAG: query is rewritten, retrieved with hybrid search, graded, retried if weak, generated, self-checked and answered with citations, with memory across turns.'
          : 'Traditional RAG: query, top-k retrieval, single-pass generation, unverified answer.'}
      </title>
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-fog-500" />
        </marker>
        <marker id="arrow-signal" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-signal" />
        </marker>
      </defs>

      <AnimatePresence mode="wait">
        <motion.g
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {mode === 'before' ? (
            <>
              {['M122 180 L168 180', 'M272 180 L318 180', 'M422 180 L463 180'].map((d) => (
                <path key={d} d={d} className="stroke-fog-600" strokeWidth="1" markerEnd="url(#arrow)" />
              ))}
              {BEFORE.map((n) => (
                <Node key={n.id} n={n} active={active === n.id} tone="muted" />
              ))}
              <text x="292" y="262" textAnchor="middle" className="fill-fog-600 font-mono text-[10.5px]">
                retrieve-then-generate · no evaluation · no retries
              </text>
              <PathPacket d={BEFORE_ROUTE} duration={2400} color="var(--color-fog-400)" onMove={onMove} />
            </>
          ) : (
            <>
              {AFTER_EDGES.map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  className="stroke-fog-500"
                  strokeWidth="1"
                  markerEnd="url(#arrow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                />
              ))}
              <motion.path
                d={RETRY_EDGE}
                fill="none"
                className="stroke-ember"
                strokeWidth="1"
                strokeDasharray="4 4"
                markerEnd="url(#arrow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              <text x="366" y="30" textAnchor="middle" className="fill-ember font-mono text-[10px]">
                weak evidence → refine & retry
              </text>
              <path d={REFLECT_EDGE} className="stroke-rose/60" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrow)" />
              <text x="376" y="194" className="fill-rose/80 font-mono text-[10px]">
                not grounded → re-retrieve
              </text>
              {MEMORY_EDGES.map((d) => (
                <path key={d} d={d} fill="none" className="stroke-violet/60" strokeWidth="1" strokeDasharray="2 4" markerEnd="url(#arrow)" />
              ))}

              {AFTER.map((n) => (
                <Node key={n.id} n={n} active={active === n.id} tone="live" />
              ))}

              {/* grader verdict badge */}
              <AnimatePresence>
                {active === 'gr' && (
                  <motion.g
                    key={gradeVisits}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <rect x="470" y="136" width="88" height="22" rx="11" className={gradeVisits > 1 ? 'fill-signal' : 'fill-ember'} />
                    <text x="514" y="151" textAnchor="middle" className="fill-ink-950 font-mono text-[10px] font-medium">
                      {gradeVisits > 1 ? '✓ 10/12 pass' : '✗ 4/12 retry'}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>

              <PathPacket d={AFTER_ROUTE} duration={6200} onMove={onMove} />
            </>
          )}
        </motion.g>
      </AnimatePresence>
    </svg>
  )
}
