import type { Engagement, ProcessStep, Service } from '@/types/content'

export const services: Service[] = [
  {
    icon: 'bot',
    title: 'Agentic RAG assistants',
    body: 'Chatbots that reason over your documents, cite their sources, and say so when they don’t know.',
    deliverables: ['Ingestion + chunking pipeline', 'Hybrid vector search', 'Corrective retrieval loop', 'Eval harness'],
  },
  {
    icon: 'workflow',
    title: 'Workflow automation agents',
    body: 'LangGraph agents that call your tools and APIs, with human-in-the-loop approval before anything risky.',
    deliverables: ['Tool / API integrations', 'Approval gates', 'Audit trail', 'Failure recovery'],
  },
  {
    icon: 'file',
    title: 'Document intelligence',
    body: 'Turn PDFs, XML and reports into structured data, topic maps and knowledge graphs you can search.',
    deliverables: ['Extraction + parsing', 'Topic modelling', 'Knowledge graphs', 'Structured exports'],
  },
  {
    icon: 'gauge',
    title: 'LLM cost & latency audits',
    body: 'Already have an LLM app? I’ll cut calls, tokens and spend without losing answer quality. I’ve done it at 5×.',
    deliverables: ['Call-graph profiling', 'Prompt compression', 'Model routing', 'Before/after report'],
  },
  {
    icon: 'mic',
    title: 'Voice & multimodal agents',
    body: 'Speech in, speech out, and screenshots understood. Useful for field ops, support and hands-free workflows.',
    deliverables: ['Speech-to-text', 'Text-to-speech', 'Vision inputs', 'Low-latency inference'],
  },
  {
    icon: 'layers',
    title: 'Full-stack AI products',
    body: 'The whole product, not just a notebook: React/TypeScript front-ends, FastAPI or Node backends, deployed and handed over.',
    deliverables: ['React + TypeScript UI', 'FastAPI / Node APIs', 'Vercel / AWS deploys', 'Docs + handover'],
  },
]

export const engagements: Engagement[] = [
  {
    name: 'Prototype sprint',
    duration: '1–2 weeks',
    body: 'A working proof-of-concept on your real data. You decide whether to scale it based on something that runs, not a slide deck.',
  },
  {
    name: 'Fixed-scope build',
    duration: '3–8 weeks',
    body: 'A production-ready agent or AI feature with clear milestones, evals, deployment and documentation.',
  },
  {
    name: 'Ongoing partner',
    duration: 'Monthly',
    body: 'A standing retainer for iteration, new tools, monitoring and cost tuning as usage grows.',
  },
]

export const processSteps: ProcessStep[] = [
  {
    title: 'Discover',
    body: 'A short call to map the workflow, the data, and the one metric that proves the agent is worth it.',
    output: 'Scope + success metric',
  },
  {
    title: 'Prototype',
    body: 'A thin, working slice on your real data within days, so we find the hard parts early.',
    output: 'Clickable PoC',
  },
  {
    title: 'Build',
    body: 'The production agent: tools, retrieval, guardrails, human-in-the-loop, observability.',
    output: 'Production system',
  },
  {
    title: 'Evaluate',
    body: 'Measure accuracy, groundedness, latency and cost per request, then iterate until the numbers hold.',
    output: 'Eval report',
  },
  {
    title: 'Ship & hand over',
    body: 'Deploy, document and walk your team through it, so nobody depends on me to keep it running.',
    output: 'Deployed + documented',
  },
]
