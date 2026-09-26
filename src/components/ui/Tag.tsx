import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] leading-none tracking-tight text-fog-400',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Pulsing "live" indicator. */
export function StatusDot({ className, color = 'bg-signal' }: { className?: string; color?: string }) {
  return (
    <span className={cn('relative inline-flex size-2', className)} aria-hidden>
      <span className={cn('absolute inset-0 animate-pulse-ring rounded-full', color)} />
      <span className={cn('relative inline-flex size-2 rounded-full', color)} />
    </span>
  )
}
