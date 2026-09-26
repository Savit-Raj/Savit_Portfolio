import { motion } from 'motion/react'

const XML = [
  '<INProfileResponse>',
  '  <SCORE>',
  '    <BureauScore>742</BureauScore>',
  '  </SCORE>',
  '  <CAIS_Account>',
  '    <Account_Type>10</Account_Type>',
  '    <Current_Balance>45000</Current_Balance>',
  '    <Amount_Past_Due>0</Amount_Past_Due>',
  '  </CAIS_Account>',
  '</INProfileResponse>',
]

const FIELDS = [
  { k: 'credit_score', v: '742', accent: true },
  { k: 'active_accounts', v: '4' },
  { k: 'current_balance', v: '₹45,000' },
  { k: 'overdue', v: '₹0' },
]

const CYCLE = 5

/** CreditSea: nested XML scanned on the left, typed report fields fill in on the right. */
export function XmlVisual() {
  return (
    <div className="grid h-full grid-cols-[1.25fr_1fr] gap-3 p-4" aria-hidden>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-ink-950/70 p-3 font-mono text-[8.5px] leading-[1.6] [mask-image:linear-gradient(to_right,black_80%,transparent)]">
        {XML.map((line, i) => (
          <div key={i} className="whitespace-pre text-fog-600">
            {line.split(/(<\/?[A-Za-z_]+>)/g).map((part, j) =>
              part.startsWith('<') ? (
                <span key={j} className="text-ember/80">{part}</span>
              ) : (
                <span key={j} className="text-fog-200">{part}</span>
              ),
            )}
          </div>
        ))}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-ember/20 to-transparent"
          initial={{ top: '0%' }}
          animate={{ top: ['0%', '92%'] }}
          transition={{ duration: CYCLE * 0.6, repeat: Infinity, repeatDelay: CYCLE * 0.4, ease: 'linear' }}
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-ember" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-fog-500">report.json</span>
        </div>
        {FIELDS.map((f, i) => (
          <motion.div
            key={f.k}
            className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-ink-800 px-2.5 py-1.5"
            initial={{ opacity: 0.15, x: -6 }}
            animate={{ opacity: [0.15, 0.15, 1, 1, 0.15], x: [-6, -6, 0, 0, -6] }}
            transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.15 + i * 0.12, 0.22 + i * 0.12, 0.92, 1] }}
          >
            <span className="font-mono text-[9px] text-fog-500">{f.k}</span>
            <span className={f.accent ? 'text-[11px] font-medium text-ember' : 'text-[10px] text-fog-50'}>{f.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
