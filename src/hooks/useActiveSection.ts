import { useEffect, useState } from 'react'

/**
 * Scroll-spy: returns the id of the tracked section crossing the viewport's reading line,
 * or null when the reader is between tracked sections (e.g. in the hero).
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!els.length) return
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        // Sections don't overlap the reading line, but keep document order as a tiebreaker.
        setActive(ids.find((id) => visible.has(id)) ?? null)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}
