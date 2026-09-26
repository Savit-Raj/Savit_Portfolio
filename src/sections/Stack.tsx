import { Marquee } from '@/components/ui/Marquee'
import { Reveal } from '@/components/ui/Reveal'
import { Accent, SectionHeader } from '@/components/ui/SectionHeader'
import { stack } from '@/data/journey'

const dots = ['bg-signal', 'bg-cyan', 'bg-ember', 'bg-violet']

export function Stack() {
  const all = stack.flatMap((g, gi) => g.items.map((item) => ({ item, dot: dots[gi % dots.length] })))
  const half = Math.ceil(all.length / 2)

  return (
    <section id="stack" aria-label="Toolbox" className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-32">
      <div className="container-page mb-14 md:mb-20">
        <SectionHeader
          index="07"
          label="Toolbox"
          title={[<>Tools I <Accent>reach for.</Accent></>]}
          intro="Chosen for the problem at hand, not the hype."
        />
      </div>

      <div className="flex flex-col gap-4">
        {[all.slice(0, half), all.slice(half)].map((row, r) => (
          <Marquee key={r} reverse={r === 1} duration={55}>
            {row.map(({ item, dot }) => (
              <span
                key={item}
                className="mx-2 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-white/[0.08] bg-ink-900/60 px-5 py-3 text-[clamp(1rem,1.6vw,1.25rem)] tracking-tight text-fog-200"
              >
                <span className={`size-1.5 rounded-full ${dot}`} />
                {item}
              </span>
            ))}
          </Marquee>
        ))}
      </div>

      <div className="container-page mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        {stack.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.06}>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fog-500">
              <span className={`size-1.5 rounded-full ${dots[i % dots.length]}`} />
              {g.label}
            </p>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-fog-400">
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
