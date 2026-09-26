import { motion, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useFinePointer } from '@/hooks/useMediaQuery'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

const spring = { stiffness: 220, damping: 18, mass: 0.4 }

/** Pulls its child toward the pointer. Inert on touch devices. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  if (!fine) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
