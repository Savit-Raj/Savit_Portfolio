import { useCallback } from 'react'
import type { PointerEvent } from 'react'

/** Writes pointer position into --mx / --my on the target so CSS can paint a spotlight. No re-renders. */
export function useSpotlight<T extends HTMLElement>() {
  return useCallback((e: PointerEvent<T>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])
}
