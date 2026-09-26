import type { Metric } from '@/types/content'

export const metrics: Metric[] = [
  {
    value: 5,
    suffix: '×',
    label: 'lower inference cost per request',
    detail: '$0.30–0.40 → $0.07–0.08 on an enterprise Agentic RAG system at EY',
  },
  {
    value: 35,
    prefix: '−',
    suffix: '%',
    label: 'LLM calls per request',
    detail: '25–30 → 15–20 calls after redesigning the agent orchestration',
  },
  {
    value: 15,
    suffix: '+',
    label: 'production tools in one agent',
    detail: 'Movi: a LangGraph agent with human-in-the-loop safety checks',
  },
  {
    value: 8,
    suffix: 'K+',
    label: 'likes on a single build post',
    detail: 'Real-time face-recognition attendance system, shared on LinkedIn',
  },
]
