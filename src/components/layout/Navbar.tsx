import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUpRight, Command, Copy } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { socialIcon } from '@/components/ui/BrandIcons'
import { nav, site } from '@/config/site'
import { useActiveSection } from '@/hooks/useActiveSection'
import { isMac } from '@/hooks/useHotkey'
import { copyToClipboard } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useSmoothScroll } from '@/providers/SmoothScroll'

const ids = nav.map((n) => n.id)

export function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { scrollY } = useScroll()
  const { scrollTo, stop, start } = useSmoothScroll()
  const active = useActiveSection(ids)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mac, setMac] = useState(true)

  useEffect(() => setMac(isMac()), [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    // tuck away while reading downwards, reappear on any upward intent
    setHidden(y > 640 && y > prev + 4 && !menuOpen)
    if (y < prev - 4) setHidden(false)
  })

  // While the mobile menu is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!menuOpen) return
    stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      start()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, stop, start])

  const navigate = (e: MouseEvent, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    requestAnimationFrame(() => scrollTo(id === 'top' ? 0 : `#${id}`))
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            'absolute inset-0 -z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
            scrolled || menuOpen
              ? 'border-white/[0.06] bg-ink-950/85 backdrop-blur-md'
              : 'border-transparent bg-transparent',
          )}
        />
        <nav aria-label="Primary" className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
          <a href="#top" onClick={(e) => navigate(e, 'top')} className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <Logo />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[15px] font-medium tracking-tight">{site.name}</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog-500">{site.role}</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-ink-900/90 p-1 md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => navigate(e, item.id)}
                  className={cn(
                    'relative block rounded-full px-4 py-2 text-[13px] transition-colors duration-300',
                    active === item.id ? 'text-fog-50' : 'text-fog-400 hover:text-fog-50',
                  )}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-3 font-mono text-[11px] text-fog-400 transition-colors hover:border-white/20 hover:text-fog-50 lg:flex"
              aria-label="Open command palette"
            >
              <Command className="size-3.5" aria-hidden />
              <span>{mac ? '⌘' : 'Ctrl'} K</span>
            </button>
            <Button href="#contact" size="sm" onClick={(e) => navigate(e, 'contact')} icon={<ArrowUpRight className="size-3.5" />} className="hidden sm:inline-flex">
              Hire me
            </Button>
            <button
              type="button"
              className="relative grid size-10 place-items-center rounded-full border border-white/10 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={cn('absolute h-px w-4 bg-fog-50 transition-transform duration-500 ease-out-expo', menuOpen ? 'rotate-45' : '-translate-y-[3px]')} />
              <span className={cn('absolute h-px w-4 bg-fog-50 transition-transform duration-500 ease-out-expo', menuOpen ? '-rotate-45' : 'translate-y-[3px]')} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/95 px-4 pb-8 pt-[calc(var(--header-h)+2rem)] backdrop-blur-2xl md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => navigate(e, item.id)}
                    className="flex items-baseline gap-4 py-2 text-5xl font-medium tracking-tight"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="font-mono text-xs text-signal">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                onClick={() => copyToClipboard(site.email, 'Email copied')}
                className="flex items-center gap-2 self-start font-mono text-sm text-fog-200"
                aria-label={`Copy email address ${site.email}`}
              >
                {site.email}
                <Copy className="size-3.5 text-fog-500" aria-hidden />
              </button>
              <div className="flex gap-3">
                {site.socials.map((s) => {
                  const Icon = socialIcon[s.label as keyof typeof socialIcon]
                  return (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" className="grid size-11 place-items-center rounded-full border border-white/10" aria-label={s.label}>
                      <Icon className="size-4" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Monogram: an "S" traced by an agent graph — three nodes, one loop. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('relative grid size-10 place-items-center rounded-xl border border-white/10 bg-ink-900', className)}>
      <svg viewBox="0 0 32 32" className="size-6" aria-hidden>
        <path
          d="M22 9.5c-1.4-1.6-3.5-2.5-6-2.5-3.6 0-6 1.9-6 4.6 0 5.8 12 3.6 12 9.4 0 2.8-2.6 4.9-6.4 4.9-2.7 0-5-1-6.6-2.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="text-fog-200 transition-colors duration-500 group-hover:text-signal"
        />
        <circle cx="22" cy="9.5" r="2.4" className="fill-signal" />
        <circle cx="16" cy="16" r="1.8" className="fill-fog-50" />
        <circle cx="9" cy="23.1" r="2.4" className="fill-signal" />
      </svg>
    </span>
  )
}
