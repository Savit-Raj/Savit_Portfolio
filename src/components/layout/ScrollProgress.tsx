import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal shadow-[0_0_12px_rgb(200_255_61/0.7)]"
      style={{ scaleX }}
    />
  )
}
