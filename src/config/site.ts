import type { SocialLink } from '@/types/content'

/**
 * Global site configuration — identity, links and availability.
 * Update this file first when details change.
 */
export const site = {
  name: 'Savit Raj',
  shortName: 'savit',
  role: 'Agentic AI Engineer',
  company: 'EY',
  location: 'Pune, India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  email: 'savitraj81597@gmail.com',

  /**
   * ★ Your live URL (no trailing slash): the ONLY place to change it. At build time it's written
   * into the canonical link, social cards, structured data, robots.txt, sitemap.xml and llms.txt.
   */
  url: 'https://savitraj.vercel.app',

  /** One-line bio for search results, structured data and llms.txt. */
  description:
    'Agentic AI engineer at EY (Pune, India) building end-to-end, domain-specific AI automation: Agentic RAG, LangGraph agents with human-in-the-loop, document intelligence and LLM cost optimisation. Available for freelance projects.',

  /** Public headshot (your GitHub avatar) shown by search engines for profile results. Set to null to omit. */
  photo: 'https://avatars.githubusercontent.com/u/133812414?v=4&s=460' as string | null,

  /** Topics you want to be found for (schema.org `knowsAbout`). */
  expertise: [
    'Agentic AI',
    'Retrieval-Augmented Generation (RAG)',
    'Agentic RAG',
    'LangGraph',
    'LangChain',
    'Milvus',
    'Human-in-the-loop AI agents',
    'LLM cost optimisation',
    'Document intelligence',
    'Knowledge graphs',
    'Computer vision',
    'Python',
    'FastAPI',
    'React',
    'TypeScript',
  ],

  availability: {
    open: true,
    label: 'Taking on freelance projects',
    responseTime: 'Replies within 24h',
  },

  /**
   * Public résumé download. Drop a résumé *without* phone / DOB into /public and set the path,
   * e.g. '/Savit_Raj_Resume.pdf'. Leave null to hide every résumé button.
   */
  resumeUrl: null as string | null,

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/savit-raj/', handle: 'in/savit-raj' },
    { label: 'GitHub', href: 'https://github.com/Savit-Raj', handle: '@Savit-Raj' },
  ] satisfies SocialLink[],
} as const

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'journey', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId =
  | 'top'
  | 'flagship'
  | 'playbook'
  | 'work'
  | 'services'
  | 'process'
  | 'journey'
  | 'stack'
  | 'contact'
