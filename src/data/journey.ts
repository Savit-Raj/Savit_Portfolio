import type { Education, Role, StackGroup } from '@/types/content'

export const roles: Role[] = [
  {
    company: 'EY',
    role: 'Agentic AI Developer',
    note: 'Intern → Full-time',
    location: 'Pune, India',
    period: 'Jan 2026 — Present',
    current: true,
    points: [
      'Led the migration of a production tax-domain RAG chatbot to an Agentic RAG architecture on LangGraph + Milvus.',
      'Redesigned orchestration to cut LLM calls per request from 25–30 to 15–20.',
      'Lowered inference cost per request from $0.30–0.40 to $0.07–0.08 through prompt optimisation, workflow refinement and smarter retrieval.',
    ],
    certificate: 'https://drive.google.com/file/d/14oCPz46QujAnqwIMPFnOp9je9D3Hr6Ol/view?usp=sharing',
  },
  {
    company: 'PiTrade',
    role: 'Software Engineer Intern',
    location: 'New York, US',
    period: 'Jan 2025 — Aug 2025',
    points: [
      'Designed and built the user onboarding system: React Native on the front, AWS CDK infrastructure on the back.',
      'Architected and deployed serverless API endpoints, improving cost efficiency and performance.',
      'Led UI enhancements that made the app noticeably more intuitive.',
    ],
  },
  {
    company: 'ASKAI Technologies',
    role: 'AI Backend Intern',
    location: 'Connaught Place, Delhi',
    period: 'Dec 2024',
    points: ['Integrated OpenAI LLMs into production chat interfaces with custom prompts, embeddings and backend workflows.'],
    certificate: 'https://drive.google.com/file/d/1O8YLOz_M4PzSpjH5GMMiEqVxibU5wx-R/view?usp=share_link',
  },
]

export const education: Education = {
  school: 'Birla Institute of Technology, Mesra',
  degree: 'B.Tech — Artificial Intelligence & Machine Learning',
  period: '2022 — 2026',
  score: 'CGPA 8.5',
}

export const achievements: string[] = [
  'Vice President, Entrepreneurship Development Cell, BIT Mesra',
  '2nd Runner-Up, AI Knowledge Consortium case study',
  '2nd Runner-Up, Innovate-A-Thon hackathon',
  'Regional Winner, ICSE Schools Debate Competition',
]

export const stack: StackGroup[] = [
  {
    label: 'Agents & LLMs',
    items: ['LangGraph', 'LangChain', 'OpenAI', 'Groq', 'Llama 3.1', 'Prompt engineering', 'Tool calling', 'HITL'],
  },
  {
    label: 'Retrieval & ML',
    items: ['Milvus', 'Hybrid search', 'Sentence Transformers', 'BERTopic', 'UMAP · HDBSCAN', 'PyMuPDF', 'OpenCV', 'scikit-learn'],
  },
  {
    label: 'Backend & Cloud',
    items: ['Python', 'FastAPI', 'Node.js', 'AWS CDK', 'Serverless', 'MongoDB', 'SQLite', 'Vercel'],
  },
  {
    label: 'Frontend',
    items: ['TypeScript', 'React', 'React Native', 'Tailwind CSS', 'Force Graph 3D', 'IndexedDB', 'MirageJS'],
  },
]
