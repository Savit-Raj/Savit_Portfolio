import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  y?: number
}

/** Fade + rise once the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

interface RevealLinesProps {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** Animate on mount instead of on scroll. */
  immediate?: boolean
}

const lineVariants = {
  hidden: { y: '110%', rotate: 2.5 },
  shown: (i: number) => ({ y: '0%', rotate: 0, transition: { duration: 1.1, delay: i, ease: EASE } }),
}

/**
 * Masked, line-by-line rise used for display headings.
 * The in-view trigger lives on the wrapper: each line starts fully outside its
 * overflow mask, so observing the lines themselves would never fire.
 */
export function RevealLines({
  lines,
  className,
  lineClassName = 'block',
  delay = 0,
  stagger = 0.08,
  immediate,
}: RevealLinesProps) {
  return (
    <motion.span
      className={className ?? 'block'}
      initial="hidden"
      {...(immediate
        ? { animate: 'shown' }
        : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -8% 0px' } })}
    >
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <motion.span
            className={lineClassName}
            variants={lineVariants}
            custom={delay + i * stagger}
            style={{ transformOrigin: '0% 100%' }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
