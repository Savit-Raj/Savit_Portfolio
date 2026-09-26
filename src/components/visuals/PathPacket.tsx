import { useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface PathPacketProps {
  /** SVG path the packet travels along. */
  d: string
  /** One full traversal, ms. */
  duration: number
  color?: string
  /** Pause at the end of each traversal, ms. */
  rest?: number
  /** Called every frame with the packet position; use it to light up nodes. */
  onMove?: (x: number, y: number, progress: number) => void
}

/**
 * A glowing packet that travels an SVG path via getPointAtLength.
 * Writes attributes directly (no re-render per frame) and only runs while visible.
 */
export function PathPacket({ d, duration, color = 'var(--color-signal)', rest = 700, onMove }: PathPacketProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const groupRef = useRef<SVGGElement>(null)
  const trailRefs = useRef<(SVGCircleElement | null)[]>([])
  const inView = useInView(pathRef, { margin: '-5% 0px' })
  const reduced = usePrefersReducedMotion()
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove

  useEffect(() => {
    const path = pathRef.current
    const group = groupRef.current
    if (!path || !group || reduced || !inView) return
    const len = path.getTotalLength()
    const cycle = duration + rest
    const t0 = performance.now()
    let raf = 0

    const frame = (now: number) => {
      const t = (now - t0) % cycle
      const k = Math.min(1, t / duration)
      const eased = k // constant speed reads as "data flow"
      const p = path.getPointAtLength(eased * len)
      group.setAttribute('transform', `translate(${p.x} ${p.y})`)
      group.style.opacity = t > duration ? '0' : '1'
      trailRefs.current.forEach((c, i) => {
        if (!c) return
        const q = path.getPointAtLength(Math.max(0, eased * len - (i + 1) * 7))
        c.setAttribute('cx', String(q.x - p.x))
        c.setAttribute('cy', String(q.y - p.y))
      })
      onMoveRef.current?.(p.x, p.y, t > duration ? -1 : k)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [d, duration, rest, reduced, inView])

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {!reduced && (
        <g ref={groupRef} style={{ opacity: 0 }}>
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el
              }}
              r={3 - i * 0.6}
              fill={color}
              opacity={0.5 - i * 0.11}
            />
          ))}
          <circle r="9" fill={color} opacity="0.18" />
          <circle r="4" fill={color} />
        </g>
      )}
    </>
  )
}
