import { useEffect, useRef } from 'react'

/** Bind ⌘/Ctrl + key. Handler ref is kept fresh without re-binding listeners. */
export function useModHotkey(key: string, handler: (e: KeyboardEvent) => void) {
  const saved = useRef(handler)
  saved.current = handler

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        saved.current(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key])
}

export const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
