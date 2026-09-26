import { motion } from 'motion/react'
import { Counter } from '@/components/ui/Counter'
import { metrics } from '@/data/metrics'

export function Metrics() {
  return (
    <section aria-label="Results in numbers" className="relative border-y border-white/[0.06] bg-ink-900/40">
      <div className="container-page grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border-white/[0.06] py-10 pr-4 max-lg:[&:nth-child(odd)]:border-r lg:border-r lg:px-8 lg:py-14 lg:first:pl-0 lg:last:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b max-lg:[&:nth-child(even)]:pl-5"
          >
            <p className="flex items-baseline text-[clamp(2.75rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
              {m.prefix && <span className="text-fog-500">{m.prefix}</span>}
              <Counter to={m.value} />
              {m.suffix && <span className="text-signal">{m.suffix}</span>}
            </p>
            <p className="mt-4 text-sm text-fog-200 md:text-[15px]">{m.label}</p>
            <p className="mt-2 max-w-[28ch] font-mono text-[11px] leading-relaxed text-fog-600 transition-colors duration-500 group-hover:text-fog-400">
              {m.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
