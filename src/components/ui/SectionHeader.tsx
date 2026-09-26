import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal, RevealLines } from './Reveal'
import { ScrambleText } from './ScrambleText'

interface SectionHeaderProps {
  index: string
  label: string
  title: ReactNode[]
  intro?: ReactNode
  aside?: ReactNode
  className?: string
}

/** Numbered section heading: mono eyebrow, masked display title, optional intro + aside. */
export function SectionHeader({ index, label, title, intro, aside, className }: SectionHeaderProps) {
  return (
    <header className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-8">
        <Eyebrow index={index} label={label} className="mb-6" />
        <h2 className="text-balance text-[clamp(2.25rem,5.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]">
          <RevealLines lines={title} />
        </h2>
      </div>
      {(intro || aside) && (
        <Reveal delay={0.15} className="lg:col-span-4 lg:pb-2">
          {intro && <p className="text-pretty text-base leading-relaxed text-fog-400 md:text-lg">{intro}</p>}
          {aside}
        </Reveal>
      )}
    </header>
  )
}

export function Eyebrow({ index, label, className }: { index?: string; label: string; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fog-500', className)}>
      {index && (
        <>
          <span className="text-signal">{index}</span>
          <span className="h-px w-8 bg-white/15" />
        </>
      )}
      <ScrambleText text={label} />
    </p>
  )
}

/** Serif italic accent used inside display headings. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <em className={cn('pr-[0.06em] font-serif font-normal italic tracking-[-0.01em] text-signal', className)}>
      {children}
    </em>
  )
}
