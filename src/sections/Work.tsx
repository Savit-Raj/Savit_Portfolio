import { motion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { Accent, SectionHeader } from '@/components/ui/SectionHeader'
import { Tag } from '@/components/ui/Tag'
import { ProjectVisual } from '@/components/visuals/projects/ProjectVisual'
import { projects } from '@/data/projects'
import { useSpotlight } from '@/hooks/useSpotlight'
import { accentVar, cn } from '@/lib/utils'
import type { Project, ProjectLink } from '@/types/content'

const linkIcon: Record<ProjectLink['label'], React.ReactNode> = {
  GitHub: <GitHubIcon className="size-3.5" />,
  Live: <ArrowUpRight className="size-3.5" />,
  Demo: <Play className="size-3.5" />,
  Post: <LinkedInIcon className="size-3.5" />,
}

const linkLabel: Record<ProjectLink['label'], string> = {
  GitHub: 'Code',
  Live: 'Live site',
  Demo: 'Watch demo',
  Post: 'LinkedIn post',
}

export function Work() {
  const visible = projects.filter((p) => !p.hidden)
  const large = visible.filter((p) => p.size === 'lg')
  const medium = visible.filter((p) => p.size === 'md')

  return (
    <section id="work" className="relative border-t border-white/[0.06] py-28 md:py-40">
      <div className="container-page">
        <SectionHeader
          index="03"
          label="Selected work"
          title={['Things I’ve designed,', <>built <Accent>& shipped.</Accent></>]}
          intro="Agents, knowledge graphs, computer vision and full products. Each one taken from idea to working software."
        />

        <div className="mt-16 flex flex-col gap-6 lg:mt-24">
          {large.map((p) => (
            <ProjectCard key={p.slug} project={p} variant="feature" />
          ))}
          <div className={cn('grid gap-6 md:grid-cols-2', medium.length >= 3 && 'xl:grid-cols-3')}>
            {medium.map((p) => (
              <ProjectCard key={p.slug} project={p} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project: p, variant }: { project: Project; variant: 'feature' | 'compact' }) {
  const onPointerMove = useSpotlight<HTMLElement>()
  const feature = variant === 'feature'
  const primary = p.links[0]
  const accent = accentVar[p.accent]

  const heading = (
    <>
      <div className="mb-5 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
        <span style={{ color: accent }}>{p.kicker}</span>
        <span className="text-fog-600">{p.year}</span>
      </div>
      <h3 className={cn('text-balance font-medium tracking-[-0.03em]', feature ? 'text-3xl md:text-[42px] md:leading-[1.05]' : 'text-2xl')}>
        {p.title}
      </h3>
      {p.badges && (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.badges.map((b) => (
            <span
              key={b}
              className="rounded-full px-2.5 py-1 font-mono text-[10.5px]"
              style={{ color: accent, background: `color-mix(in oklab, ${accent} 12%, transparent)` }}
            >
              {b}
            </span>
          ))}
        </div>
      )}
      <p className={cn('mt-4 text-pretty leading-relaxed text-fog-400', feature && 'md:text-lg')}>{p.summary}</p>
    </>
  )

  const details = (
    <>
      {feature && p.pipeline && (
        <ol className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[10.5px] text-fog-400" aria-label="Pipeline">
          {p.pipeline.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1">{step}</span>
              {i < p.pipeline!.length - 1 && <span className="text-fog-600">→</span>}
            </li>
          ))}
        </ol>
      )}
      <ul className="flex flex-col gap-2.5 text-sm text-fog-200">
        {p.highlights.map((h) => (
          <li key={h} className="flex gap-3">
            <span className="mt-[9px] size-1 shrink-0 rounded-full" style={{ background: accent }} />
            <span className="text-pretty">{h}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>
    </>
  )

  const links = (
    <div className="flex flex-wrap gap-2">
      {p.links.map((l) => (
        <a
          key={l.href + l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-[13px] text-fog-200 transition-colors hover:border-white/25 hover:text-fog-50"
        >
          {linkIcon[l.label]}
          {linkLabel[l.label]}
        </a>
      ))}
    </div>
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={onPointerMove}
      style={{ '--spot': accent } as React.CSSProperties}
      className="group relative isolate flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/70 transition-colors duration-500 hover:border-white/20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 spotlight transition-opacity duration-500 group-hover:opacity-100" />

      {/* media */}
      <a
        href={primary?.href}
        target="_blank"
        rel="noreferrer noopener"
        data-cursor={primary ? linkLabel[primary.label].split(' ')[0] : undefined}
        aria-label={primary ? `${p.title}: ${linkLabel[primary.label]}` : p.title}
        className={cn(
          'relative block overflow-hidden border-b border-white/[0.07] bg-ink-950/60',
          feature ? 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2.35/1]' : 'aspect-[16/10]',
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]">
          <ProjectVisual kind={p.visual} video={p.video} title={p.title} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink-950/60 to-transparent" aria-hidden />
      </a>

      {/* copy */}
      {feature ? (
        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col lg:col-span-5">
            {heading}
            <div className="mt-8 hidden lg:block">{links}</div>
          </div>
          <div className="lg:col-span-7 lg:pt-10">
            {details}
            <div className="mt-8 lg:hidden">{links}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-6 md:p-8">
          {heading}
          <div className="mt-6">{details}</div>
          <div className="mt-auto pt-8">{links}</div>
        </div>
      )}
    </motion.article>
  )
}
