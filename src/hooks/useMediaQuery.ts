import { useSyncExternalStore } from 'react'

/** SSR-safe, tear-free media query subscription. */
export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
