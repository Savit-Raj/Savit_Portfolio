import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface CounterProps {
  to: number
  duration?: number
  decimals?: number
  className?: string
}

/** Counts up from zero when scrolled into view. */
export function Counter({ to, duration = 1.8, decimals = 0, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = to.toFixed(decimals)
      return
    }
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals)
      },
    })
    return () => controls.stop()
  }, [inView, to, duration, decimals, reduced])

  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals)}
    </span>
  )
}
