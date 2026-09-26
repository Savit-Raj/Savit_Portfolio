import { motion } from 'motion/react'
import { PathPacket } from '../PathPacket'

const tools = ['assign_vehicle', 'get_trip_status', 'create_stop', 'create_path', 'list_stops', 'remove_vehicle', 'route_info', 'unassigned_count']

/** Movi's LangGraph: agent → consequence check → human gate → tools. */
export function MoviVisual() {
  const route = 'M60 150 L290 150 L290 70 L410 70 L410 150 L520 150'
  return (
    <svg viewBox="0 0 580 300" className="h-full w-full" aria-hidden>
      <defs>
        <pattern id="movi-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
        </pattern>
      </defs>
      <rect width="580" height="300" fill="url(#movi-dots)" />

      {/* edges */}
      <path d="M102 150 L128 150 M212 150 L260 150" stroke="rgba(255,255,255,0.18)" />
      <path d="M290 122 L290 92 M326 70 L410 70 L410 128 M452 150 L478 150" fill="none" stroke="#c8ff3d" strokeOpacity="0.5" />
      <path d="M318 150 L368 150" stroke="rgba(255,255,255,0.18)" strokeDasharray="3 4" />
      <text x="343" y="166" textAnchor="middle" className="fill-fog-600 font-mono text-[8.5px]">safe</text>

      {/* nodes */}
      {[
        { x: 60, y: 150, label: 'input', sub: 'voice/text/img' },
        { x: 170, y: 150, label: 'agent', sub: 'llama 3.1' },
        { x: 410, y: 150, label: 'execute', sub: '15+ tools' },
        { x: 520, y: 150, label: 'reply', sub: 'text + tts' },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x - 42} y={n.y - 22} width="84" height="44" rx="10" fill="#131519" stroke="rgba(255,255,255,0.14)" />
          <text x={n.x} y={n.y - 2} textAnchor="middle" className="fill-fog-50 text-[11px] font-medium">{n.label}</text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" className="fill-fog-500 font-mono text-[8.5px]">{n.sub}</text>
        </g>
      ))}

      {/* consequence diamond */}
      <g>
        <rect x="270" y="130" width="40" height="40" rx="6" fill="#131519" stroke="#ff7a45" transform="rotate(45 290 150)" />
        <text x="290" y="153" textAnchor="middle" className="fill-ember font-mono text-[9px]">risk?</text>
        <text x="290" y="196" textAnchor="middle" className="fill-fog-500 font-mono text-[8.5px]">consequence check</text>
      </g>

      {/* human gate */}
      <g>
        <rect x="254" y="48" width="72" height="44" rx="22" fill="#1e2a14" stroke="#c8ff3d" />
        <circle cx="274" cy="64" r="4" fill="#c8ff3d" />
        <path d="M266 80 C266 72 282 72 282 80" fill="#c8ff3d" />
        <text x="306" y="74" textAnchor="middle" className="fill-signal font-mono text-[9.5px] font-medium">HITL</text>
      </g>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, times: [0, 0.34, 0.4, 0.62, 0.68] }}
      >
        <rect x="120" y="14" width="206" height="26" rx="8" fill="#1c1f24" stroke="rgba(255,255,255,0.12)" />
        <text x="130" y="31" className="fill-fog-200 font-mono text-[9px]">
          ⚠ trip 25% booked — proceed? <tspan className="fill-signal">yes</tspan>
        </text>
      </motion.g>

      {/* tool chips */}
      {tools.map((t, i) => (
        <motion.g
          key={t}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: [0.35, 0.35, 1, 0.35] }}
          transition={{ duration: 5.2, repeat: Infinity, times: [0, 0.7 + i * 0.015, 0.76 + i * 0.015, 0.95] }}
        >
          <rect x={340 + (i % 2) * 118} y={196 + Math.floor(i / 2) * 22} width="112" height="17" rx="8.5" fill="#131519" stroke="rgba(255,255,255,0.1)" />
          <text x={396 + (i % 2) * 118} y={208 + Math.floor(i / 2) * 22} textAnchor="middle" className="fill-fog-400 font-mono text-[8.5px]">
            {t}()
          </text>
        </motion.g>
      ))}
      <path d="M410 172 L410 190" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 3" />

      <PathPacket d={route} duration={4600} rest={600} />
    </svg>
  )
}
