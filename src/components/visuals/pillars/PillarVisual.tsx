import { AnimatePresence, motion, useInView, type Transition } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { PillarId } from '@/types/content'

/* Six tiny looping diagrams, one per pillar. Pure SVG + motion keyframes. */

const C = {
  signal: '#c8ff3d',
  cyan: '#5ce1ff',
  violet: '#a58bff',
  ember: '#ff7a45',
  rose: '#ff5d8f',
  fog: '#85847e',
  line: 'rgba(255,255,255,0.14)',
  box: '#131519',
}

const loop = (duration: number, delay = 0, extra: Transition = {}): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  ease: 'easeInOut',
  ...extra,
})

function Box({ x, y, w = 84, h = 40, label, sub, color = C.line }: { x: number; y: number; w?: number; h?: number; label: string; sub?: string; color?: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="10" fill={C.box} stroke={color} />
      <text x={x} y={sub ? y - 2 : y + 4} textAnchor="middle" className="fill-fog-50 text-[11.5px] font-medium">
        {label}
      </text>
      {sub && (
        <text x={x} y={y + 12} textAnchor="middle" className="fill-fog-500 font-mono text-[9px]">
          {sub}
        </text>
      )}
    </g>
  )
}

function Retrieval() {
  const stages = [
    { x: 105, label: 'retrieve', sub: 'k = 12' },
    { x: 215, label: 'rerank', sub: 'top 6' },
    { x: 325, label: 'filter', sub: 'top 3' },
  ]
  const cycle = 4.2
  return (
    <>
      <line x1="20" y1="130" x2="390" y2="130" stroke={C.line} strokeDasharray="3 5" />
      {Array.from({ length: 12 }, (_, i) => {
        const endX = i < 6 ? 215 : i < 9 ? 325 : 395
        const d = (endX - 20) / 150
        const y = 130 + ((i % 4) - 1.5) * 6
        return (
          <motion.circle
            key={i}
            r="3.2"
            cy={y}
            fill={i >= 9 ? C.signal : C.cyan}
            initial={{ cx: 20, opacity: 0 }}
            animate={{ cx: [20, endX], opacity: [0, 1, 1, 0] }}
            // per-value transitions: `times` must match each value's keyframe count
            transition={{
              cx: loop(d, i * 0.16, { ease: 'linear', repeatDelay: cycle - d }),
              opacity: loop(d, i * 0.16, { ease: 'linear', repeatDelay: cycle - d, times: [0, 0.08, 0.88, 1] }),
            }}
          />
        )
      })}
      {stages.map((s) => (
        <Box key={s.label} x={s.x} y={130} label={s.label} sub={s.sub} />
      ))}
      <text x="200" y="215" textAnchor="middle" className="fill-fog-500 font-mono text-[10px]">
        each stage swappable · each stage measurable
      </text>
    </>
  )
}

function Query() {
  const subs = [
    { y: 62, text: 'q1 · 2026 rules' },
    { y: 130, text: 'q2 · 2025 rules' },
    { y: 198, text: 'q3 · what changed' },
  ]
  return (
    <>
      <rect x="18" y="108" width="140" height="44" rx="22" fill={C.box} stroke={C.line} />
      <text x="88" y="134" textAnchor="middle" className="fill-fog-200 text-[11px]">
        “what changed & why?”
      </text>
      {subs.map((s, i) => (
        <g key={s.text}>
          <motion.path
            d={`M158 130 C 200 130, 205 ${s.y}, 250 ${s.y}`}
            fill="none"
            stroke={C.violet}
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={loop(4, i * 0.15, { times: [0, 0.25, 0.85, 1] })}
          />
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={loop(4, i * 0.15, { times: [0, 0.22, 0.32, 0.85, 1] })}
          >
            <rect x="250" y={s.y - 17} width="132" height="34" rx="17" fill={C.box} stroke={C.violet} strokeOpacity="0.6" />
            <text x="316" y={s.y + 4} textAnchor="middle" className="fill-fog-50 font-mono text-[10.5px]">
              {s.text}
            </text>
          </motion.g>
        </g>
      ))}
    </>
  )
}

function Orchestration() {
  const cx = 200
  const cy = 130
  const r = 82
  const start = -150
  const pts = Array.from({ length: 37 }, (_, i) => {
    const a = ((start + i * 10) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
  const nodes = [
    { a: -90, label: 'Reason', t: 60 / 360 },
    { a: 30, label: 'Act', t: 180 / 360 },
    { a: 150, label: 'Observe', t: 300 / 360 },
  ]
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeDasharray="3 5" />
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-fog-400 font-mono text-[10px]">
        loop until
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" className="fill-fog-400 font-mono text-[10px]">
        enough context
      </text>
      {nodes.map((n) => {
        const a = (n.a * Math.PI) / 180
        const x = cx + r * Math.cos(a)
        const y = cy + r * Math.sin(a)
        return (
          <g key={n.label}>
            <motion.circle
              cx={x}
              cy={y}
              r="30"
              fill={C.box}
              stroke={C.signal}
              initial={{ strokeOpacity: 0.2 }}
              animate={{ strokeOpacity: [0.2, 0.2, 1, 0.2, 0.2] }}
              transition={loop(4.8, 0, { ease: 'linear', times: [0, n.t - 0.06, n.t, n.t + 0.12, 1] })}
            />
            <text x={x} y={y + 4} textAnchor="middle" className="fill-fog-50 text-[11px] font-medium">
              {n.label}
            </text>
          </g>
        )
      })}
      <motion.circle
        r="5"
        fill={C.signal}
        initial={{ cx: pts[0][0], cy: pts[0][1] }}
        animate={{ cx: pts.map((p) => p[0]), cy: pts.map((p) => p[1]) }}
        transition={loop(4.8, 0, { ease: 'linear' })}
      />
    </>
  )
}

/*
 * Memory: turns roll through a 4-slot context window. Once it's full, the oldest turn is
 * compressed into a summary that flies into the long-term store (whose level rises), and
 * every few turns a stored memory is recalled back into the window. State-driven rather
 * than keyframed, so every element stays in sync however long it runs.
 */
const MEM_STEP_MS = 2000
const SLOTS = 4
const RECALL_EVERY = 3
const RECALL_LANDS_S = 1.9 // recall chip: 1s delay + 0.9s flight
const slotY = (i: number) => 58 + i * 38
const CYL = { x: 262, w: 120, top: 70, bottom: 196, rx: 60, ry: 11 }
const CYL_CX = CYL.x + CYL.w / 2
const CYL_BODY = `M${CYL.x} ${CYL.top} L${CYL.x} ${CYL.bottom} A${CYL.rx} ${CYL.ry} 0 0 0 ${CYL.x + CYL.w} ${CYL.bottom} L${CYL.x + CYL.w} ${CYL.top} Z`
const SETTLE = { duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] } as const

function Memory() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => s + 1), MEM_STEP_MS)
    return () => window.clearInterval(id)
  }, [])

  const newest = step + SLOTS // the window holds turns newest-3 … newest
  const turns = Array.from({ length: SLOTS }, (_, i) => newest - (SLOTS - 1) + i)
  const stored = 17 + step
  // fills quickly at first, then eases toward (but never reaches) the top
  const level = 0.18 + 0.64 * (1 - Math.pow(0.8, step))
  const surfaceY = CYL.bottom - level * (CYL.bottom - CYL.top)
  const recalling = step > 0 && step % RECALL_EVERY === 0
  // the turn that received the latest recalled memory keeps its outline as it scrolls up
  const lastRecall = Math.floor(step / RECALL_EVERY) * RECALL_EVERY
  const recalledTurn = lastRecall > 0 ? lastRecall + SLOTS : -1

  return (
    <>
      <defs>
        <clipPath id="mem-cyl">
          <path d={CYL_BODY} />
        </clipPath>
      </defs>

      {/* context window */}
      <text x="104" y="32" textAnchor="middle" className="fill-fog-500 font-mono text-[10px]">
        short-term · context window
      </text>
      <rect x="24" y="44" width="160" height="164" rx="14" fill={C.box} stroke={C.line} />
      <AnimatePresence initial={false}>
        {turns.map((turn, i) => {
          const agent = turn % 2 === 0
          const enriched = turn === recalledTurn
          return (
            <motion.g
              key={turn}
              initial={{ x: 0, y: slotY(SLOTS), opacity: 0 }}
              animate={{ x: 0, y: slotY(i), opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.rect
                x={agent ? 50 : 36}
                width="120"
                height="28"
                rx="9"
                fill={agent ? '#1e2a14' : '#1c1f24'}
                initial={{ stroke: 'rgba(92,225,255,0)' }}
                animate={{ stroke: enriched ? 'rgba(92,225,255,1)' : 'rgba(92,225,255,0)' }}
                // light up the moment the recall chip lands, not before
                transition={{ duration: 0.3, delay: enriched && recalling ? RECALL_LANDS_S : 0 }}
              />
              <text x={agent ? 60 : 46} y="12" className={agent ? 'fill-signal font-mono text-[8px]' : 'fill-fog-400 font-mono text-[8px]'}>
                {agent ? 'agent' : 'user'} · turn {turn}
              </text>
              <rect x={agent ? 60 : 46} y="17" width={agent ? 72 : 88} height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
            </motion.g>
          )
        })}
      </AnimatePresence>
      <text x="104" y="226" textAnchor="middle" className="fill-fog-600 font-mono text-[9px]">
        {SLOTS}/{SLOTS} turns · oldest is summarised
      </text>

      {/* long-term store */}
      <text x={CYL_CX} y="32" textAnchor="middle" className="fill-fog-500 font-mono text-[10px]">
        long-term · persistent
      </text>
      <path d={CYL_BODY} fill={C.box} stroke={C.line} />
      <g clipPath="url(#mem-cyl)">
        <motion.rect
          x={CYL.x}
          width={CYL.w}
          initial={false}
          animate={{ y: surfaceY, height: CYL.bottom + CYL.ry - surfaceY }}
          transition={SETTLE}
          fill={C.violet}
          fillOpacity="0.18"
        />
        <motion.ellipse
          cx={CYL_CX}
          rx={CYL.rx}
          ry={CYL.ry}
          initial={false}
          animate={{ cy: surfaceY }}
          transition={SETTLE}
          fill={C.violet}
          fillOpacity="0.32"
        />
      </g>
      <ellipse cx={CYL_CX} cy={CYL.top} rx={CYL.rx} ry={CYL.ry} fill="#1c1f24" stroke={C.line} />
      <text x={CYL_CX} y="226" textAnchor="middle" className="fill-violet font-mono text-[9.5px]">
        {stored} memories
      </text>

      {/* write: oldest turn → summary → store (drawn last so it flies over everything) */}
      {step > 0 && (
        <motion.g
          key={`write-${step}`}
          initial={{ x: 104, y: slotY(0) + 14, scale: 1, opacity: 0 }}
          // arcs through the gap between the two boxes (below the titles) into the store's mouth
          animate={{
            x: [104, 223, CYL_CX],
            y: [slotY(0) + 14, 52, CYL.top + 6],
            scale: [1, 0.9, 0.55],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, times: [0, 0.5, 1], ease: 'easeInOut' }}
        >
          <rect x="-32" y="-10" width="64" height="20" rx="10" fill={C.violet} />
          <text y="3.5" textAnchor="middle" className="fill-ink-950 font-mono text-[9px] font-medium">
            summary
          </text>
        </motion.g>
      )}

      {/* read: every few turns a stored memory is recalled into the newest turn */}
      {recalling && (
        <motion.g
          key={`recall-${step}`}
          initial={{ x: CYL_CX, y: CYL.top + 8, opacity: 0 }}
          animate={{
            x: [CYL_CX, 223, 150],
            y: [CYL.top + 8, 150, slotY(SLOTS - 1) + 14],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: RECALL_LANDS_S - 1, delay: 1, times: [0, 0.5, 1], ease: 'easeInOut' }}
        >
          <rect x="-26" y="-10" width="52" height="20" rx="10" fill={C.cyan} />
          <text y="3.5" textAnchor="middle" className="fill-ink-950 font-mono text-[9px] font-medium">
            recall
          </text>
        </motion.g>
      )}
    </>
  )
}

function Reliability() {
  const times = [0, 0.2, 0.28, 0.36, 0.44, 0.5, 0.7, 0.9, 1]
  const cx = [60, 200, 200, 130, 60, 60, 200, 340, 340]
  const cy = [120, 120, 170, 200, 170, 120, 120, 120, 120]
  const fill = [C.cyan, C.ember, C.ember, C.ember, C.ember, C.cyan, C.signal, C.signal, C.signal]
  const t = loop(5.4, 0, { ease: 'linear', times })
  return (
    <>
      <path d="M102 120 L168 120 M232 120 L298 120" stroke={C.line} />
      <path d="M200 152 C 200 214, 60 214, 60 142" fill="none" stroke={C.ember} strokeOpacity="0.55" strokeDasharray="4 4" />
      <text x="130" y="232" textAnchor="middle" className="fill-ember font-mono text-[10px]">
        refine & retry
      </text>
      <Box x={60} y={120} label="retrieve" />
      <Box x={340} y={120} label="answer" />
      <motion.rect
        x="178"
        y="98"
        width="44"
        height="44"
        rx="6"
        fill={C.box}
        transform="rotate(45 200 120)"
        initial={{ stroke: C.line }}
        animate={{ stroke: [C.line, C.ember, C.ember, C.line, C.line, C.signal, C.signal, C.line, C.line] }}
        transition={loop(5.4, 0, { ease: 'linear', times: [0, 0.2, 0.3, 0.36, 0.66, 0.7, 0.8, 0.9, 1] })}
      />
      <text x="200" y="124" textAnchor="middle" className="fill-fog-50 font-mono text-[9.5px]">
        eval
      </text>
      <motion.text
        x="200"
        y="78"
        textAnchor="middle"
        className="fill-ember font-mono text-[10.5px]"
        animate={{ opacity: [0, 1, 1, 0, 0] }}
        transition={loop(5.4, 0, { ease: 'linear', times: [0, 0.2, 0.4, 0.46, 1] })}
      >
        ✗ weak evidence
      </motion.text>
      <motion.text
        x="200"
        y="78"
        textAnchor="middle"
        className="fill-signal font-mono text-[10.5px]"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={loop(5.4, 0, { ease: 'linear', times: [0, 0.68, 0.7, 0.95, 1] })}
      >
        ✓ grounded
      </motion.text>
      <motion.circle r="6" initial={{ cx: 60, cy: 120 }} animate={{ cx, cy, fill }} transition={t} />
    </>
  )
}

function Indexing() {
  const sections = [70, 130, 190]
  const chunks = [48, 84, 114, 146, 176, 212]
  const dense = [0.7, 0.4, 0.85, 0.55, 0.3, 0.75, 0.5, 0.65]
  const sparse = [0.08, 0.9, 0.06, 0.05, 0.7, 0.07, 0.06, 0.1]
  const draw = (i: number) => loop(4.5, i * 0.08, { times: [0, 0.3, 0.85, 1] })
  return (
    <>
      <Box x={48} y={130} w={56} h={34} label="doc" />
      {sections.map((y, i) => (
        <g key={y}>
          <motion.path d={`M76 130 C 100 130, 100 ${y}, 118 ${y}`} fill="none" stroke={C.cyan} strokeOpacity="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={draw(i)} />
          <rect x="118" y={y - 11} width="40" height="22" rx="6" fill={C.box} stroke={C.line} />
          <text x="138" y={y + 3.5} textAnchor="middle" className="fill-fog-400 font-mono text-[9px]">§{i + 1}</text>
          {[0, 1].map((j) => {
            const cy = chunks[i * 2 + j]
            return (
              <g key={j}>
                <motion.path d={`M158 ${y} C 172 ${y}, 172 ${cy}, 186 ${cy}`} fill="none" stroke={C.cyan} strokeOpacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={draw(i + 3 + j)} />
                <rect x="186" y={cy - 7} width="34" height="14" rx="4" fill="#12303a" />
              </g>
            )
          })}
        </g>
      ))}
      {[
        { label: 'dense', values: dense, y: 100, color: C.cyan },
        { label: 'sparse', values: sparse, y: 188, color: C.ember },
      ].map((row) => (
        <g key={row.label}>
          <text x="252" y={row.y - 48} className="fill-fog-500 font-mono text-[9.5px]">
            {row.label}
          </text>
          {row.values.map((v, i) => (
            // Grow from the baseline via y/height: Motion overrides CSS transform-origin on SVG,
            // so a scaleY animation would grow from the middle.
            <motion.rect
              key={i}
              x={252 + i * 17}
              width="10"
              rx="2"
              fill={row.color}
              fillOpacity="0.8"
              initial={{ y: row.y, height: 0 }}
              animate={{ y: [row.y, row.y - 40 * v, row.y - 40 * v, row.y], height: [0, 40 * v, 40 * v, 0] }}
              transition={loop(4.5, 0.5 + i * 0.05, { times: [0, 0.3, 0.85, 1] })}
            />
          ))}
        </g>
      ))}
      <text x="318" y="222" textAnchor="middle" className="fill-signal font-mono text-[10px]">
        hybrid = dense ⊕ sparse
      </text>
    </>
  )
}

const VISUALS: Record<PillarId, () => React.JSX.Element> = {
  retrieval: Retrieval,
  query: Query,
  orchestration: Orchestration,
  memory: Memory,
  reliability: Reliability,
  indexing: Indexing,
}

export function PillarVisual({ id }: { id: PillarId }) {
  const ref = useRef<SVGSVGElement>(null)
  // The <svg> keeps its size from the viewBox; its looping content only exists while visible.
  const inView = useInView(ref, { margin: '100px 0px' })
  const Visual = VISUALS[id]
  return (
    <svg ref={ref} viewBox="0 0 400 260" className="h-auto w-full" aria-hidden>
      {inView && <Visual />}
    </svg>
  )
}
