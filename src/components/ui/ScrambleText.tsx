import { useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ'

interface ScrambleTextProps {
  text: string
  className?: string
  /** ms between each character locking in */
  speed?: number
  /** Start when scrolled into view (default) or immediately. */
  trigger?: 'view' | 'mount'
  delay?: number
}

/**
 * Decodes text from random glyphs, left to right. Writes straight to the DOM node
 * (no React re-render per frame) and re-runs whenever `text` changes.
 */
export function ScrambleText({ text, className, speed = 28, trigger = 'view', delay = 0 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = usePrefersReducedMotion()
  const armed = trigger === 'mount' || inView

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = text
      return
    }
    if (!armed) {
      el.textContent = text.replace(/\S/g, ' ')
      return
    }
    let raf = 0
    const start = performance.now() + delay
    const loop = (now: number) => {
      const elapsed = now - start
      let out = ''
      let done = true
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ' || elapsed >= i * speed + 180) out += ch
        else {
          done = false
          out += elapsed < 0 ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
      }
      el.textContent = out
      if (!done) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [text, armed, reduced, speed, delay])

  return (
    <span className={cn('relative inline-block', className)}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden className="whitespace-pre-wrap" />
    </span>
  )
}
