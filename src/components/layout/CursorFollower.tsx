import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

/**
 * A trailing ring that complements (never replaces) the native cursor.
 * Grows over interactive elements; shows a label for elements with data-cursor="Label".
 */
export function CursorFollower() {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  const [mode, setMode] = useState<'idle' | 'hover' | 'label'>('idle')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE)
      const text = target?.getAttribute('data-cursor')
      if (text) {
        setMode('label')
        setLabel(text)
      } else setMode(target ? 'hover' : 'idle')
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = mode === 'label' ? 84 : mode === 'hover' ? 44 : 22

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] grid place-items-center rounded-full border border-solid"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        backgroundColor: mode === 'label' ? 'rgba(200,255,61,1)' : mode === 'hover' ? 'rgba(200,255,61,0.08)' : 'rgba(200,255,61,0)',
        borderColor: mode === 'label' ? 'rgba(200,255,61,0)' : 'rgba(200,255,61,0.55)',
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      <AnimatePresence>
        {mode === 'label' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-950"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
