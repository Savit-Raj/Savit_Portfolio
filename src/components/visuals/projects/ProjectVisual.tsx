import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProjectVisual as VisualKind } from '@/types/content'
import { AgentGraphCanvas } from '../AgentGraphCanvas'
import { topicPreset } from '../graphPresets'
import { FaceScanVisual } from './FaceScanVisual'
import { KanbanVisual } from './KanbanVisual'
import { MoviVisual } from './MoviVisual'
import { XmlVisual } from './XmlVisual'

function Generative({ kind, paused }: { kind: VisualKind; paused: boolean }) {
  switch (kind) {
    case 'topic-graph':
      return <AgentGraphCanvas preset={topicPreset} scale={0.46} paused={paused} />
    case 'movi':
      return <MoviVisual />
    case 'kanban':
      return <KanbanVisual />
    case 'xml':
      return <XmlVisual />
    case 'face-scan':
      return <FaceScanVisual />
  }
}

interface Props {
  kind: VisualKind
  video?: string
  title: string
  className?: string
}

/**
 * Shows the project's demo clip when one exists in /public/media, otherwise (or until it loads)
 * a generative visual.
 *
 * Performance: the generative visual is only mounted while the card is near the viewport, so
 * its looping SVG animations never run off-screen. The video mounts lazily and pauses off-screen.
 */
export function ProjectVisual({ kind, video, title, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const near = useInView(ref, { margin: '150px 0px' })
  const seen = useInView(ref, { once: true, margin: '300px 0px' })
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [covered, setCovered] = useState(false)
  const showVideo = !!video && seen && !videoFailed

  // Once the clip has faded in over the visual, drop the visual entirely.
  useEffect(() => {
    if (!videoReady) return
    const id = window.setTimeout(() => setCovered(true), 800)
    return () => window.clearTimeout(id)
  }, [videoReady])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !videoReady) return
    if (near) v.play().catch(() => {})
    else v.pause()
  }, [near, videoReady])

  return (
    <div ref={ref} className={cn('relative h-full w-full overflow-hidden', className)}>
      {near && !covered && (
        <div className={cn('absolute inset-0 transition-opacity duration-700', videoReady && 'opacity-0')}>
          <Generative kind={kind} paused={videoReady} />
        </div>
      )}
      {showVideo && (
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            videoReady ? 'opacity-100' : 'opacity-0',
          )}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} demo video`}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        />
      )}
      {videoReady && (
        <span className="absolute left-4 top-4 rounded-full bg-ink-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fog-200">
          ● demo
        </span>
      )}
    </div>
  )
}
