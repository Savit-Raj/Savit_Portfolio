import { site } from '@/config/site'
import { achievements, education, roles, stack } from '@/data/journey'
import { metrics } from '@/data/metrics'
import { pillars } from '@/data/pillars'
import { projects } from '@/data/projects'
import { engagements, processSteps, services } from '@/data/services'

/*
 * Machine-readable companions to the site, generated at build time from the same data the
 * page renders, so they can never drift out of date:
 *   /llms.txt       short Markdown index for AI agents (https://llmstxt.org)
 *   /llms-full.txt  the whole site as one Markdown document
 *   /robots.txt     crawl rules: everyone welcome, AI crawlers named explicitly
 *   /sitemap.xml
 */

const visibleProjects = projects.filter((p) => !p.hidden)
const metric = (m: (typeof metrics)[number]) => `${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`
const list = (items: readonly string[]) => items.map((i) => `- ${i}`).join('\n')

export function llmsTxt() {
  const u = site.url
  return `# ${site.name}

> ${site.description}

${site.name} is an ${site.role} at ${site.company}, based in ${site.location}. Freelance services: ${services
    .map((s) => s.title)
    .join(', ')}. Contact: ${site.email}.

## Profile

- [Full profile](${u}/llms-full.txt): experience, projects, services, skills and contact details in one Markdown file
- [Website](${u}/): portfolio and freelance services

## Projects

${visibleProjects.map((p) => `- [${p.title}](${p.links[0]?.href ?? u}): ${p.summary}`).join('\n')}

## Contact

- Email: ${site.email}
${site.socials.map((s) => `- [${s.label}](${s.href})`).join('\n')}
`
}

export function llmsFullTxt() {
  const projectBlocks = visibleProjects
    .map(
      (p) => `### ${p.title} (${p.year})

${p.kicker}. ${p.summary}

${list(p.highlights)}

- Stack: ${p.stack.join(', ')}
${p.badges?.length ? `- Recognition: ${p.badges.join(', ')}\n` : ''}${p.links.map((l) => `- ${l.label}: ${l.href}`).join('\n')}`,
    )
    .join('\n\n')

  const roleBlocks = roles
    .map(
      (r) => `### ${r.role} at ${r.company}${r.note ? ` (${r.note})` : ''}

${r.period} · ${r.location}

${list(r.points)}`,
    )
    .join('\n\n')

  return `# ${site.name} — ${site.role}

> ${site.description}

- Website: ${site.url}/
- Email: ${site.email}
${site.socials.map((s) => `- ${s.label}: ${s.href}`).join('\n')}
- Location: ${site.location} (${site.timeZoneLabel})
- Availability: ${site.availability.label}. ${site.availability.responseTime}.

## Results

${metrics.map((m) => `- ${metric(m)} ${m.label}: ${m.detail}`).join('\n')}

## Experience

${roleBlocks}

## Projects

${projectBlocks}

## Freelance services

${services.map((s) => `### ${s.title}\n\n${s.body}\n\nDeliverables: ${s.deliverables.join(', ')}.`).join('\n\n')}

### Ways to work together

${engagements.map((e) => `- ${e.name} (${e.duration}): ${e.body}`).join('\n')}

### Process

${processSteps.map((s, i) => `${i + 1}. ${s.title}: ${s.body} Output: ${s.output}.`).join('\n')}

## How I build agents: six pillars of Agentic RAG

${pillars.map((p) => `- ${p.title}. ${p.tagline} ${p.body} (${p.techniques.join(', ')})`).join('\n')}

## Skills

${stack.map((g) => `- ${g.label}: ${g.items.join(', ')}`).join('\n')}

## Education

- ${education.degree}, ${education.school} (${education.period}), ${education.score}

## Achievements

${list(achievements)}
`
}

/** Crawlers that power AI assistants and AI search. Named so the welcome is explicit, not implied. */
const AI_AGENTS = [
  'GPTBot', // OpenAI
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot', // Anthropic
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot', // Perplexity
  'Perplexity-User',
  'Google-Extended', // Gemini
  'Applebot-Extended', // Apple Intelligence
  'meta-externalagent', // Meta AI
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'CCBot', // Common Crawl (used by many models)
]

export function robotsTxt() {
  const u = site.url
  return `# ${site.name} — ${u}/
# Humans, search engines and AI agents are all welcome.
# Markdown versions of this site for LLMs:
#   ${u}/llms.txt       (index)
#   ${u}/llms-full.txt  (full profile)

User-agent: *
Allow: /

${AI_AGENTS.map((a) => `User-agent: ${a}`).join('\n')}
Allow: /

Sitemap: ${u}/sitemap.xml
`
}

export function sitemapXml(lastmod: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
}
