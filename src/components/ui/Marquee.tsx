import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  duration?: number
  className?: string
}

/** Seamless CSS marquee: content is rendered twice and the track slides by 50%. Pauses on hover. */
export function Marquee({ children, reverse, duration = 40, className }: MarqueeProps) {
  return (
    <div className={cn('group flex overflow-hidden mask-fade-x', className)}>
      <div
        className={cn(
          'flex w-max shrink-0 group-hover:[animation-play-state:paused]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
