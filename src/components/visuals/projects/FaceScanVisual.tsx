import { motion } from 'motion/react'

type Pt = [number, number]

const CX = 128
const CY = 128

const arc = (n: number, fn: (t: number) => Pt): Pt[] => Array.from({ length: n }, (_, i) => fn(n === 1 ? 0 : i / (n - 1)))

// A 68-point-style landmark layout, generated rather than hand-typed.
const JAW = arc(17, (t) => {
  const a = Math.PI - t * Math.PI
  return [CX + 64 * Math.cos(a), CY - 8 + 84 * Math.sin(a) * (0.55 + 0.45 * Math.sin(t * Math.PI))]
})
const BROW_L = arc(5, (t) => [CX - 46 + t * 34, CY - 38 - Math.sin(t * Math.PI) * 7])
const BROW_R = arc(5, (t) => [CX + 12 + t * 34, CY - 38 - Math.sin(t * Math.PI) * 7])
const eye = (ex: number): Pt[] => arc(7, (t) => [ex + 12 * Math.cos(t * Math.PI * 2), CY - 20 + 5 * Math.sin(t * Math.PI * 2)])
const EYE_L = eye(CX - 27)
const EYE_R = eye(CX + 27)
const NOSE = arc(4, (t) => [CX, CY - 18 + t * 28])
const NOSE_BASE = arc(5, (t) => [CX - 12 + t * 24, CY + 14 + Math.sin(t * Math.PI) * 4])
const MOUTH = arc(13, (t) => [CX + 22 * Math.cos(t * Math.PI * 2), CY + 40 + 8 * Math.sin(t * Math.PI * 2)])

const GROUPS = [JAW, BROW_L, BROW_R, EYE_L, EYE_R, NOSE, NOSE_BASE, MOUTH]
const LANDMARKS = GROUPS.flat()
const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

const CYCLE = 6
const LOG = [
  { time: '09:02:11', name: 'A. Kumar', ok: true },
  { time: '09:02:14', name: 'P. Singh', ok: true },
  { time: '09:02:19', name: 'UNKNOWN', ok: false },
  { time: '09:02:23', name: 'R. Verma', ok: true },
]

/** Face-recognition attendance: landmark mesh, scan line, match → CSV log. */
export function FaceScanVisual() {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden>
      {/* bounding box corners */}
      <motion.g
        stroke="#ff5d8f"
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0.4, scale: 1.08 }}
        animate={{ opacity: [0.4, 1, 1, 0.4], scale: [1.08, 1, 1, 1.08] }}
        transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.25, 0.85, 1] }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <path d="M52 40 L52 28 L64 28 M192 28 L204 28 L204 40 M204 206 L204 218 L192 218 M64 218 L52 218 L52 206" />
      </motion.g>

      {/* mesh: dim base layer + a bright copy revealed by one animated clip rect that
          tracks the scan line (1 animated element instead of one per landmark) */}
      <defs>
        <clipPath id="face-scan-clip">
          <motion.rect
            x="40"
            y="20"
            width="180"
            initial={{ height: 0 }}
            animate={{ height: [0, 200, 200, 0] }}
            transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.45, 0.9, 1], ease: 'easeInOut' }}
          />
        </clipPath>
      </defs>
      <g opacity="0.3">
        {GROUPS.map((g, i) => (
          <path key={i} d={toPath(g)} fill="none" stroke="#ff5d8f" strokeWidth="0.8" />
        ))}
        {LANDMARKS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#ff5d8f" />
        ))}
      </g>
      <g clipPath="url(#face-scan-clip)">
        {GROUPS.map((g, i) => (
          <path key={i} d={toPath(g)} fill="none" stroke="#ff5d8f" strokeOpacity="0.5" strokeWidth="0.8" />
        ))}
        {LANDMARKS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.7" fill="#ff5d8f" />
        ))}
      </g>

      {/* scan line */}
      <motion.g
        initial={{ y: 28 }}
        animate={{ y: [28, 218, 218] }}
        transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.45, 1], ease: 'easeInOut' }}
      >
        <rect x="52" y="-10" width="152" height="10" fill="url(#scan-grad)" />
        <line x1="52" x2="204" y1="0" y2="0" stroke="#ff5d8f" strokeOpacity="0.9" />
      </motion.g>
      <defs>
        <linearGradient id="scan-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff5d8f" stopOpacity="0" />
          <stop offset="1" stopColor="#ff5d8f" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* verdict */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.45, 0.5, 0.9, 1] }}
      >
        <rect x="52" y="226" width="152" height="22" rx="6" fill="#ff5d8f" />
        <text x="128" y="241" textAnchor="middle" className="fill-ink-950 font-mono text-[9.5px] font-medium">
          MATCH · 0.38 · stable ✓
        </text>
      </motion.g>

      {/* attendance log */}
      <g>
        <text x="232" y="44" className="fill-fog-500 font-mono text-[9px] uppercase tracking-wider">attendance.csv</text>
        <line x1="232" x2="388" y1="52" y2="52" stroke="rgba(255,255,255,0.1)" />
        {LOG.map((row, i) => (
          <motion.g
            key={row.time}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.2, 1, 1, 0.2] }}
            transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.48 + i * 0.08, 0.52 + i * 0.08, 0.92, 1] }}
          >
            <text x="232" y={74 + i * 22} className="fill-fog-600 font-mono text-[9px]">{row.time}</text>
            <text x="286" y={74 + i * 22} className={row.ok ? 'fill-fog-200 text-[10px]' : 'fill-rose text-[10px]'}>
              {row.name}
            </text>
            <text x="388" y={74 + i * 22} textAnchor="end" className={row.ok ? 'fill-fog-500 font-mono text-[9px]' : 'fill-rose/80 font-mono text-[9px]'}>
              {row.ok ? 'present' : 'skipped'}
            </text>
          </motion.g>
        ))}
        <text x="232" y="180" className="fill-fog-600 font-mono text-[8.5px]">HOG · 128-d encoding · linear SVM</text>
        <text x="232" y="194" className="fill-fog-600 font-mono text-[8.5px]">re-stamp only after 24h</text>
      </g>
    </svg>
  )
}
