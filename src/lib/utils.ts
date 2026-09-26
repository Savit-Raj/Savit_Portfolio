import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Deterministic PRNG (mulberry32), so generative visuals look the same on every load. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box–Muller gaussian from a uniform source. */
export function gaussian(rand: () => number) {
  const u = 1 - rand()
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export const accentVar = {
  signal: 'var(--color-signal)',
  cyan: 'var(--color-cyan)',
  violet: 'var(--color-violet)',
  ember: 'var(--color-ember)',
  rose: 'var(--color-rose)',
} as const

export const accentHex = {
  signal: '#c8ff3d',
  cyan: '#5ce1ff',
  violet: '#a58bff',
  ember: '#ff7a45',
  rose: '#ff5d8f',
} as const
