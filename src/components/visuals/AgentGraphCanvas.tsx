import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn, gaussian, lerp, mulberry32 } from '@/lib/utils'

/* ----------------------------------------------------------------------------
 * A dependency-free, pseudo-3D force-graph renderer on <canvas>.
 * ~80 nodes, perspective projection, depth fog, travelling "message" pulses,
 * pointer parallax and nearest-node hover. Pauses off-screen and in hidden tabs.
 * ------------------------------------------------------------------------- */

export interface GraphCluster {
  label: string
  color: string // hex
}

export interface GraphPreset {
  seed: number
  clusters: GraphCluster[]
  perCluster: number
  /** Gaussian spread of a cluster, in unit-sphere radii. */
  spread?: number
  /** Label for a central hub node wired to every cluster. */
  hub?: string
  bridges?: number
  speed?: number
  /** Show a hover label for ordinary nodes, e.g. "chunk". */
  nodeNoun?: string
}

interface Props {
  preset: GraphPreset
  className?: string
  /** Graph centre, as a fraction of the canvas box. */
  centerX?: number
  centerY?: number
  /** Graph radius as a fraction of min(width, height). */
  scale?: number
  paused?: boolean
  labels?: boolean
}

interface GNode {
  x: number
  y: number
  z: number
  cluster: number
  size: number
  label?: string
  hub?: boolean
}

interface Pulse {
  edge: number
  start: number
  duration: number
  reverse: boolean
}

type RGB = [number, number, number]

/**
 * If the animation can't hold ~45 fps on its own (typical of software-rendered canvas,
 * e.g. VMs without a GPU), the graph freezes while the page scrolls. GPU-backed machines
 * (60/120 Hz → 16.7/8.3 ms) stay well below it and keep animating through scrolls.
 * Canvas rasterisation happens off the main thread, so frame pacing is the honest signal.
 */
const SLOW_FRAME_MS = 22

const HUB_COLOR = '#f6f5f0'

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function buildGraph(p: GraphPreset) {
  const rand = mulberry32(p.seed)
  const spread = p.spread ?? 0.2
  const nodes: GNode[] = []
  const edges: [number, number][] = []
  const seen = new Set<number>()
  const addEdge = (a: number, b: number) => {
    if (a === b) return
    const key = a < b ? a * 10_000 + b : b * 10_000 + a
    if (seen.has(key)) return
    seen.add(key)
    edges.push([a, b])
  }

  const hubIndex = p.hub ? nodes.push({ x: 0, y: 0, z: 0, cluster: -1, size: 5, label: p.hub, hub: true }) - 1 : -1

  const k = p.clusters.length
  const golden = Math.PI * (3 - Math.sqrt(5))
  const clusterStarts: number[] = []

  p.clusters.forEach((c, ci) => {
    // Fibonacci sphere keeps cluster centres evenly spaced.
    const fy = 1 - ((ci + 0.5) / k) * 2
    const r = Math.sqrt(1 - fy * fy)
    const theta = golden * ci
    const cx = Math.cos(theta) * r * 0.72
    const cy = fy * 0.62
    const cz = Math.sin(theta) * r * 0.72

    const start = nodes.length
    clusterStarts.push(start)
    nodes.push({ x: cx, y: cy, z: cz, cluster: ci, size: 3.6, label: c.label })
    for (let i = 1; i < p.perCluster; i++) {
      nodes.push({
        x: cx + gaussian(rand) * spread,
        y: cy + gaussian(rand) * spread * 0.8,
        z: cz + gaussian(rand) * spread,
        cluster: ci,
        size: 1.1 + rand() * 1.5,
      })
    }

    // k-nearest-neighbour wiring inside the cluster
    for (let i = start; i < nodes.length; i++) {
      const d: [number, number][] = []
      for (let j = start; j < nodes.length; j++) {
        if (i === j) continue
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dz = nodes[i].z - nodes[j].z
        d.push([dx * dx + dy * dy + dz * dz, j])
      }
      d.sort((a, b) => a[0] - b[0])
      addEdge(i, d[0][1])
      if (rand() < 0.55) addEdge(i, d[1][1])
    }
    // spokes from the cluster's label node
    for (let s = 0; s < 3; s++) addEdge(start, start + 1 + Math.floor(rand() * (p.perCluster - 1)))
    if (hubIndex >= 0) addEdge(hubIndex, start)
  })

  // cross-cluster bridges = the interesting relationships
  const bridges = p.bridges ?? k * 2
  for (let b = 0; b < bridges; b++) {
    const ca = Math.floor(rand() * k)
    const cb = (ca + 1 + Math.floor(rand() * (k - 1))) % k
    const a = clusterStarts[ca] + Math.floor(rand() * p.perCluster)
    const c = clusterStarts[cb] + Math.floor(rand() * p.perCluster)
    addEdge(a, c)
  }

  return { nodes, edges }
}

/** Pre-rendered radial glow sprite per colour — far cheaper than shadowBlur. */
function makeGlow([r, g, b]: RGB) {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grd.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grd.addColorStop(0.25, `rgba(${r},${g},${b},0.45)`)
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)
  return c
}

export function AgentGraphCanvas({
  preset,
  className,
  centerX = 0.5,
  centerY = 0.5,
  scale = 0.38,
  paused = false,
  labels = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  // Layout props live in a ref so changing them never restarts the render loop.
  const layout = useRef({ centerX, centerY, scale, paused })
  layout.current = { centerX, centerY, scale, paused }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const { nodes, edges } = buildGraph(preset)
    const colors = preset.clusters.map((c) => hexToRgb(c.color))
    const hubRgb = hexToRgb(HUB_COLOR)
    const colorOf = (n: GNode): RGB => (n.cluster < 0 ? hubRgb : colors[n.cluster])
    const glows = new Map<RGB, HTMLCanvasElement>()
    ;[...colors, hubRgb].forEach((c) => glows.set(c, makeGlow(c)))

    // adjacency for hover highlighting
    const adjacency: number[][] = nodes.map(() => [])
    edges.forEach(([a, b], i) => {
      adjacency[a].push(i)
      adjacency[b].push(i)
    })

    const proj = nodes.map(() => ({ x: 0, y: 0, s: 1, d: 0 }))
    const order = nodes.map((_, i) => i)
    const pulses: Pulse[] = []
    const speed = preset.speed ?? 1

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let scrolling = false
    let scrollTimer = 0
    // Animation runs on its own clock, so pausing (off-screen, hidden tab, mid-scroll)
    // resumes exactly where it left off instead of jumping ahead.
    let clock = 0
    let lastFrame = 0
    let frameGap = 1000 / 60 // moving average of rAF interval, ms
    let lastSpawn = 0
    let hovered = -1
    const pointer = { x: 0, y: 0, cx: -9999, cy: -9999 }
    const tilt = { x: 0, y: 0 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnPulse = (now: number) => {
      // Bias pulses toward hub spokes so the "agent" visibly dispatches work.
      const useHub = preset.hub && Math.random() < 0.35
      const pool = useHub ? adjacency[0] : null
      const edge = pool && pool.length ? pool[(Math.random() * pool.length) | 0] : (Math.random() * edges.length) | 0
      pulses.push({ edge, start: now, duration: 900 + Math.random() * 1400, reverse: Math.random() < 0.5 })
    }

    const draw = (now: number) => {
      const { centerX: cxF, centerY: cyF, scale: sc } = layout.current
      ctx.clearRect(0, 0, w, h)

      tilt.x = lerp(tilt.x, pointer.x, 0.035)
      tilt.y = lerp(tilt.y, pointer.y, 0.035)
      const t = reduced ? 0 : now * 0.00007 * speed
      const ry = 0.6 + t + tilt.x * 0.55
      const rx = -0.22 + tilt.y * 0.3
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const R = Math.min(w, h) * sc
      const cx = w * cxF
      const cy = h * cyF
      const D = 2.8

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const x1 = n.x * cosY - n.z * sinY
        const z1 = n.x * sinY + n.z * cosY
        const y1 = n.y * cosX - z1 * sinX
        const z2 = n.y * sinX + z1 * cosX
        const s = D / (D + z2)
        const p = proj[i]
        p.x = cx + x1 * R * s
        p.y = cy + y1 * R * s
        p.s = s
        p.d = Math.min(1, Math.max(0, (z2 + 1) / 2)) // 0 = near, 1 = far
      }

      // nearest node under the pointer
      hovered = -1
      let best = 26 * 26
      for (let i = 0; i < nodes.length; i++) {
        const dx = proj[i].x - pointer.cx
        const dy = proj[i].y - pointer.cy
        const dd = dx * dx + dy * dy
        if (dd < best) {
          best = dd
          hovered = i
        }
      }
      const hotEdges = hovered >= 0 ? new Set(adjacency[hovered]) : null

      // edges
      ctx.lineWidth = 1
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i]
        const pa = proj[a]
        const pb = proj[b]
        const fog = 1 - (pa.d + pb.d) * 0.5 * 0.8
        const hot = hotEdges?.has(i)
        const na = nodes[a]
        const nb = nodes[b]
        const same = na.cluster === nb.cluster && na.cluster >= 0
        const [r, g, bl] = hot ? colorOf(nodes[hovered]) : same ? colors[na.cluster] : [255, 255, 255]
        const alpha = hot ? 0.75 : fog * (same ? 0.2 : 0.09)
        ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
      }

      // pulses (additive)
      if (!reduced && !layout.current.paused) {
        if (now - lastSpawn > 110 && pulses.length < 22 && edges.length) {
          spawnPulse(now)
          lastSpawn = now
        }
      }
      ctx.globalCompositeOperation = 'lighter'
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        const k = (now - pulse.start) / pulse.duration
        if (k >= 1) {
          pulses.splice(i, 1)
          continue
        }
        const [a0, b0] = edges[pulse.edge]
        const [a, b] = pulse.reverse ? [b0, a0] : [a0, b0]
        const glow = glows.get(colorOf(nodes[b]))!
        for (let trail = 0; trail < 4; trail++) {
          const kk = k - trail * 0.035
          if (kk < 0) break
          const x = lerp(proj[a].x, proj[b].x, kk)
          const y = lerp(proj[a].y, proj[b].y, kk)
          const s = lerp(proj[a].s, proj[b].s, kk)
          const size = (14 - trail * 3) * s
          ctx.globalAlpha = (1 - trail * 0.25) * Math.sin(Math.PI * k) * (1 - proj[b].d * 0.6)
          ctx.drawImage(glow, x - size / 2, y - size / 2, size, size)
        }
      }
      ctx.globalAlpha = 1

      // nodes, far → near
      order.sort((a, b) => proj[b].d - proj[a].d)
      for (const i of order) {
        const n = nodes[i]
        const p = proj[i]
        const [r, g, b] = colorOf(n)
        const fog = 1 - p.d * 0.78
        const isHot = i === hovered
        const radius = n.size * p.s * (isHot ? 1.8 : 1)
        if (n.label || isHot) {
          const glow = glows.get(colorOf(n))!
          const gs = radius * (n.hub ? 12 : 8)
          ctx.globalAlpha = fog * (isHot ? 0.9 : 0.55)
          ctx.drawImage(glow, p.x - gs / 2, p.y - gs / 2, gs, gs)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, fog + (isHot ? 0.4 : 0))})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'lighter'
      }
      ctx.globalCompositeOperation = 'source-over'

      // hub orbit ring
      if (preset.hub) {
        const p = proj[0]
        ctx.strokeStyle = 'rgba(200,255,61,0.55)'
        ctx.lineWidth = 1
        ctx.beginPath()
        const rr = 16 * p.s
        const a0 = now * 0.0012
        ctx.arc(p.x, p.y, rr, a0, a0 + Math.PI * 1.2)
        ctx.stroke()
        ctx.strokeStyle = 'rgba(246,245,240,0.18)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, rr * 1.7, -a0 * 0.6, -a0 * 0.6 + Math.PI * 0.6)
        ctx.stroke()
      }

      // labels
      if (labels) {
        const compact = w < 520
        ctx.font = '500 10.5px "Geist Mono Variable", ui-monospace, monospace'
        ctx.textBaseline = 'middle'
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i]
          const isHot = i === hovered
          if (!n.label && !isHot) continue
          const p = proj[i]
          const [r, g, b] = colorOf(n)
          const fog = 1 - p.d * 0.85
          const text = n.label
            ? `${n.hub ? '◆' : '▸'} ${compact ? n.label.split(' · ').pop() : n.label}`
            : `${preset.nodeNoun ?? 'node'}_${String(i).padStart(3, '0')} · ${preset.clusters[n.cluster].label}`
          ctx.fillStyle = `rgba(${r},${g},${b},${isHot ? 1 : fog * 0.9})`
          ctx.fillText(text.toUpperCase(), p.x + 10 * p.s + 4, p.y - 1)
        }
      }
    }

    const running = () => !reduced && visible && !scrolling && !layout.current.paused

    const loop = (now: number) => {
      const dt = lastFrame ? now - lastFrame : 1000 / 60
      if (lastFrame && dt < 100) frameGap = frameGap * 0.95 + dt * 0.05
      clock += Math.min(dt, 50)
      lastFrame = now
      draw(clock)
      if (running()) raf = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      lastFrame = 0
      if (running()) raf = requestAnimationFrame(loop)
    }

    // On slow (software-rendered) devices only: freeze while the page is being scrolled so
    // the last frame scrolls as a cached layer and scrolling itself stays smooth.
    const onScroll = () => {
      if (frameGap < SLOW_FRAME_MS) return
      if (!scrolling) {
        scrolling = true
        cancelAnimationFrame(raf)
      }
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        scrolling = false
        start()
      }, 140)
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.cx = e.clientX - rect.left
      pointer.cy = e.clientY - rect.top
      if (reduced) draw(clock)
    }

    const ro = new ResizeObserver(() => {
      resize()
      draw(clock)
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else cancelAnimationFrame(raf)
    })
    io.observe(canvas)

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start()
      else cancelAnimationFrame(raf)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('resume', start)
    resize()
    start()

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(scrollTimer)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('resume', start)
    }
  }, [preset, reduced, labels])

  // Resume the loop when un-paused.
  useEffect(() => {
    if (!paused) canvasRef.current?.dispatchEvent(new Event('resume'))
  }, [paused])

  return <canvas ref={canvasRef} aria-hidden className={cn('block h-full w-full', className)} />
}
