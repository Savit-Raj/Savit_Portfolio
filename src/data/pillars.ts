import type { Pillar } from '@/types/content'

/** The six pillars of production Agentic RAG, straight from the EY build. */
export const pillars: Pillar[] = [
  {
    id: 'retrieval',
    title: 'Retrieval',
    tagline: 'Beyond naive top-k.',
    body: 'Modular pipelines with swappable retrievers, rerankers and filters, so each stage can be measured and tuned on its own instead of hoping one similarity search gets it right.',
    techniques: ['Swappable retrievers', 'Cross-encoder reranking', 'Metadata filters', 'Stage-level evals'],
  },
  {
    id: 'query',
    title: 'Query understanding',
    tagline: 'Raw questions are rarely retrieval-ready.',
    body: 'Rewrite vague questions and break multi-part ones into sub-queries, so every retrieval call is precise and aimed at one thing.',
    techniques: ['Query rewriting', 'Sub-query decomposition', 'HyDE', 'Intent routing'],
  },
  {
    id: 'orchestration',
    title: 'Orchestration',
    tagline: "The agent's loop.",
    body: 'ReAct (reason → act → observe) or Plan-and-Execute decides when to retrieve, when to call a tool, and when there is enough context to answer. This is where most of the cost gets won or lost.',
    techniques: ['ReAct', 'Plan-and-Execute', 'LangGraph state machines', 'Tool routing'],
  },
  {
    id: 'memory',
    title: 'Memory',
    tagline: 'Coherent across turns and sessions.',
    body: 'Short-term memory (the context window) and long-term persistent memory let agents remember what matters instead of treating every query in isolation.',
    techniques: ['Conversation buffers', 'Summarised history', 'Persistent user memory', 'Checkpointing'],
  },
  {
    id: 'reliability',
    title: 'Reliability',
    tagline: 'Catch bad retrievals before they become bad answers.',
    body: 'Corrective retrieval (evaluate → refine → retry) and self-reflection act as guardrails. When the agent is unsure, it looks again or asks a human.',
    techniques: ['Corrective RAG', 'Self-reflection', 'Groundedness checks', 'Human-in-the-loop'],
  },
  {
    id: 'indexing',
    title: 'Indexing',
    tagline: 'How you store matters as much as how you search.',
    body: 'Hierarchical chunking and hybrid dense + sparse search noticeably improve recall, especially in dense domains like tax and legal text.',
    techniques: ['Hierarchical chunking', 'Hybrid dense + sparse', 'Milvus', 'Semantic chunking'],
  },
]
