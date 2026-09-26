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
  url: 'https://savitraj.vercel.app',

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
