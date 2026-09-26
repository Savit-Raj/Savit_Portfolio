import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Magnetic } from './Magnetic'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  magnetic?: boolean
  children: ReactNode
  className?: string
}

type AnchorProps = BaseProps & { href: string; external?: boolean } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'children' | 'className' | 'href'
  >
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'children' | 'className'
  >

const variants: Record<Variant, string> = {
  primary:
    'bg-signal text-ink-950 hover:shadow-[0_0_0_6px_rgb(200_255_61/0.14),0_18px_50px_-12px_rgb(200_255_61/0.55)]',
  ghost: 'bg-white/[0.04] text-fog-50 ring-1 ring-inset ring-white/10 hover:bg-white/[0.08] hover:ring-white/20',
  outline: 'text-fog-50 ring-1 ring-inset ring-white/15 hover:ring-signal/60 hover:text-signal',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px] gap-2',
  md: 'h-11 px-5 text-sm gap-2.5',
  lg: 'h-14 px-7 text-[15px] gap-3',
}

/** Label that rolls to a duplicate of itself on hover. */
function RollingLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', icon, magnetic = false, children, className } = props

  const classes = cn(
    'group relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium tracking-tight',
    'transition-[background-color,box-shadow,color] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      <RollingLabel>{children}</RollingLabel>
      {icon && (
        <span className="grid place-items-center transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-rotate-12">
          {icon}
        </span>
      )}
    </>
  )

  let el: ReactNode
  if (props.href !== undefined) {
    const { variant: _v, size: _s, icon: _i, magnetic: _m, children: _c, className: _cn, external, ...anchor } =
      props as AnchorProps
    el = (
      <a className={classes} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...anchor}>
        {content}
      </a>
    )
  } else {
    const { variant: _v, size: _s, icon: _i, magnetic: _m, children: _c, className: _cn, ...button } =
      props as NativeButtonProps
    el = (
      <button type="button" className={classes} {...button}>
        {content}
      </button>
    )
  }

  return magnetic ? <Magnetic className="inline-block">{el}</Magnetic> : el
}
