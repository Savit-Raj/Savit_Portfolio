import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Search } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSmoothScroll } from '@/providers/SmoothScroll'
import { useCommands, type Command } from './useCommands'

interface Props {
  open: boolean
  onClose: () => void
}

const score = (c: Command, q: string) => {
  if (!q) return 1
  const hay = `${c.label} ${c.keywords ?? ''} ${c.group}`.toLowerCase()
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  return terms.every((t) => hay.includes(t)) ? (c.label.toLowerCase().startsWith(terms[0]) ? 2 : 1) : 0
}

/** ⌘K palette: fuzzy-ish filter, arrow-key navigation, Enter to run, Esc to close. */
export function CommandPalette({ open, onClose }: Props) {
  const commands = useCommands()
  const { stop, start } = useSmoothScroll()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const results = useMemo(
    () =>
      commands
        .map((c) => ({ c, s: score(c, query) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.c),
    [commands, query],
  )

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    stop()
    const prev = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      start()
      prev?.focus?.({ preventScroll: true })
    }
  }, [open, stop, start])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (c: Command | undefined) => {
    if (!c) return
    onClose()
    // let the dialog unmount and scrolling resume before navigating
    requestAnimationFrame(() => c.run())
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault() // keep focus inside the dialog
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-850/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <Search className="size-4 text-fog-500" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, open a link, copy my email…"
                className="h-14 w-full bg-transparent text-[15px] text-fog-50 outline-none placeholder:text-fog-600"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
                aria-autocomplete="list"
              />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-fog-500">ESC</kbd>
            </div>

            <ul ref={listRef} id={listId} role="listbox" className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 && (
                <li className="px-3 py-10 text-center font-mono text-xs text-fog-500">No matches for “{query}”</li>
              )}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null
                lastGroup = c.group
                return (
                  <li key={c.id} role="presentation">
                    {header && (
                      <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-fog-600">
                        {header}
                      </p>
                    )}
                    <div
                      id={`${listId}-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onPointerMove={() => setActive(i)}
                      onClick={() => run(c)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                        i === active ? 'bg-white/[0.07] text-fog-50' : 'text-fog-400',
                      )}
                    >
                      <span className={cn('grid size-8 place-items-center rounded-lg border border-white/[0.07]', i === active && 'border-signal/40 text-signal')}>
                        {c.icon}
                      </span>
                      <span className="flex-1">{c.label}</span>
                      {c.hint && <span className="hidden font-mono text-[11px] text-fog-600 sm:block">{c.hint}</span>}
                      {i === active && <CornerDownLeft className="size-3.5 text-fog-500" aria-hidden />}
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 font-mono text-[10px] text-fog-600">
              <span>↑↓ navigate · ↵ select</span>
              <span>savit.raj / command</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
