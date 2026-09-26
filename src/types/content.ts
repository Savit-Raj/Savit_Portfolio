/**
 * Content model for the whole site.
 * Every section renders from typed data in `src/data`, so copy changes never touch components.
 */

export type Accent = 'signal' | 'cyan' | 'violet' | 'ember' | 'rose'

export interface SocialLink {
  label: string
  href: string
  handle: string
}

export interface Metric {
  value: number
  prefix?: string
  suffix?: string
  label: string
  detail: string
}

export type ProjectVisual = 'topic-graph' | 'movi' | 'kanban' | 'xml' | 'face-scan'

export interface ProjectLink {
  label: 'GitHub' | 'Live' | 'Demo' | 'Post'
  href: string
}

export interface Project {
  slug: string
  title: string
  kicker: string
  year: string
  summary: string
  highlights: string[]
  pipeline?: string[]
  stack: string[]
  links: ProjectLink[]
  visual: ProjectVisual
  accent: Accent
  /** Optional demo clip in /public/media. Falls back to the generative visual if missing. */
  video?: string
  badges?: string[]
  size: 'lg' | 'md'
  /** Keep the project in the data but leave it off the site. */
  hidden?: boolean
}

export type PillarId =
  | 'retrieval'
  | 'query'
  | 'orchestration'
  | 'memory'
  | 'reliability'
  | 'indexing'

export interface Pillar {
  id: PillarId
  title: string
  tagline: string
  body: string
  techniques: string[]
}

export interface Service {
  title: string
  body: string
  deliverables: string[]
  icon: 'bot' | 'workflow' | 'file' | 'gauge' | 'mic' | 'layers'
}

export interface Engagement {
  name: string
  duration: string
  body: string
}

export interface ProcessStep {
  title: string
  body: string
  output: string
}

export interface Role {
  company: string
  role: string
  location: string
  period: string
  note?: string
  points: string[]
  certificate?: string
  current?: boolean
}

export interface Education {
  school: string
  degree: string
  period: string
  score: string
}

export type TraceKind = 'user' | 'plan' | 'tool' | 'observe' | 'grade' | 'reflect' | 'hitl' | 'answer'

export interface TraceStep {
  kind: TraceKind
  text: string
  /** Simulated spend accrued by this step, in USD. */
  cost?: number
  llm?: boolean
}

export interface TraceScenario {
  name: string
  agent: string
  steps: TraceStep[]
}

export interface StackGroup {
  label: string
  items: string[]
}
