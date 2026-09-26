import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useRef } from 'react'
import { nav, site } from '@/config/site'
import { useSmoothScroll } from '@/providers/SmoothScroll'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1])

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      <div className="container-page flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-serif text-2xl italic text-fog-200">Code — Coffee — Continue.</p>
          <p className="mt-3 text-sm text-fog-500">
            Designed and engineered by {site.name}. Built with React, TypeScript, Tailwind and Motion.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(`#${n.id}`)
              }}
              className="text-fog-500 transition-colors hover:text-fog-50"
            >
              {n.label}
            </a>
          ))}
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" className="text-fog-500 transition-colors hover:text-fog-50">
              {s.label} ↗
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="group inline-flex items-center gap-3 self-start font-mono text-xs uppercase tracking-[0.14em] text-fog-500 transition-colors hover:text-fog-50"
        >
          Back to top
          <span className="grid size-10 place-items-center rounded-full border border-white/10 transition-colors group-hover:border-signal group-hover:text-signal">
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </span>
        </button>
      </div>

      <motion.p
        aria-hidden
        style={{ y, opacity }}
        className="mt-16 select-none whitespace-nowrap pb-[0.07em] text-center text-[clamp(3.5rem,16vw,15rem)] font-semibold leading-[0.82] tracking-[0.02em] text-stroke"
      >
        SAVIT RAJ
      </motion.p>

      <div className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] py-6 font-mono text-[11px] text-fog-600">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>
          {site.role} · {site.location}
        </span>
      </div>
    </footer>
  )
}
