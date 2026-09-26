import { createContext, useContext, type ReactNode } from 'react'

type ScrollTarget = string | number | HTMLElement

interface SmoothScrollApi {
  /** Smoothly scroll to a selector, element or Y offset (instant for reduced-motion users). */
  scrollTo: (target: ScrollTarget) => void
  /** Lock page scroll while a menu or dialog is open. Reference-counted, so locks nest safely. */
  stop: () => void
  start: () => void
}

/*
 * Scrolling is deliberately native. The browser scrolls on the compositor thread, so it
 * stays smooth even while canvases and animations keep the main thread busy — JS-driven
 * smooth-scroll libraries can't offer that. Header offset comes from CSS scroll-padding-top.
 */

const behavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

let locks = 0

const api: SmoothScrollApi = {
  scrollTo(target) {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: behavior() })
      return
    }
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    el?.scrollIntoView({ behavior: behavior(), block: 'start' })
  },
  stop() {
    if (locks++ === 0) document.documentElement.style.overflow = 'hidden'
  },
  start() {
    if (locks === 0) return
    if (--locks === 0) document.documentElement.style.overflow = ''
  },
}

const SmoothScrollContext = createContext<SmoothScrollApi>(api)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}
