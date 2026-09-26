import type { Project } from '@/types/content'

export const projects: Project[] = [
  {
    slug: 'rag-topic-graph',
    title: 'RAG Topic Graph Visualizer',
    kicker: 'RAG · Knowledge Graphs · NLP',
    year: '2026',
    summary:
      'Turns a pile of PDFs into an explorable 3D knowledge graph you can chat with. Themes are discovered automatically, documents are linked through them, and every answer comes from the right chunks.',
    highlights: [
      'Meaning-aware chunking + transformer embeddings on PyMuPDF-extracted text',
      'Unsupervised topic discovery with BERTopic (UMAP + HDBSCAN)',
      'Scoped RAG chat: ask a single topic or document, grounded in its chunks',
    ],
    pipeline: ['PDFs', 'Semantic chunks', 'Embeddings', 'Topic clusters', 'Knowledge graph', 'RAG chat'],
    stack: ['FastAPI', 'PyMuPDF', 'BERTopic', 'Sentence Transformers', 'React', 'Force Graph 3D', 'Groq'],
    links: [{ label: 'Post', href: 'https://www.linkedin.com/in/savit-raj/recent-activity/all/' }],
    visual: 'topic-graph',
    accent: 'cyan',
    video: '/media/rag-topic-graph.mp4',
    size: 'lg',
  },
  {
    slug: 'movi',
    title: 'Movi — Multimodal Transport Agent',
    kicker: 'Agentic AI · LangGraph · HITL',
    year: '2025',
    summary:
      'An operations copilot for transport teams. Movi calls 15+ tools, checks the consequences of risky actions against “tribal knowledge”, and asks a human before it breaks anyone’s commute.',
    highlights: [
      'LangGraph state machine: agent → consequence check → HITL confirm → execute',
      '15+ production tools: vehicle assignment, routes, paths, trip status',
      'Multimodal: voice in (STT), voice out (gTTS), dashboard screenshot analysis',
    ],
    pipeline: ['Voice / text / image', 'Agent', 'Consequence check', 'Human approval', 'Tool execution'],
    stack: ['LangGraph', 'FastAPI', 'Groq · Llama 3.1', 'React', 'Tailwind', 'SQLite', 'gTTS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Savit-Raj/langgraph-tribal-knowledge-agent' },
      { label: 'Demo', href: 'https://www.loom.com/share/2904adafe85e4a79a4ae981de8550725' },
    ],
    visual: 'movi',
    accent: 'signal',
    size: 'lg',
  },
  {
    slug: 'face-recognition',
    title: 'Face Recognition Attendance',
    kicker: 'Computer Vision · ML',
    year: '2024',
    summary:
      'Real-time attendance from a webcam feed. HOG encodes each face into 128 measurements, an SVM classifier matches it, and the attendance log updates itself.',
    highlights: [
      '85% classification accuracy with a linear SVM on 128-d face encodings',
      'Unknown faces are labelled and never logged; a 3-second stability check avoids false marks',
      'De-duplicated CSV log that only re-stamps after 24 hours',
    ],
    stack: ['Python', 'OpenCV', 'dlib', 'face-recognition', 'scikit-learn · SVM'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Savit-Raj/Face-Recognition-Attendance-System' },
      { label: 'Post', href: 'https://www.linkedin.com/in/savit-raj/recent-activity/all/' },
    ],
    visual: 'face-scan',
    accent: 'rose',
    video: '/media/face-recognition.mp4',
    badges: ['8K+ likes on LinkedIn', '28★ on GitHub'],
    size: 'md',
  },
  {
    slug: 'talentflow',
    title: 'TalentFlow',
    kicker: 'Product · Frontend Engineering',
    year: '2025',
    summary:
      'A complete hiring platform: job boards, a 6-stage drag-and-drop candidate pipeline, and an assessment builder with conditional logic. Stays fast with 1,000+ candidates.',
    highlights: [
      'Kanban pipeline with optimistic updates and a full timeline audit trail',
      'Assessment builder: 6 question types, conditional logic, live preview',
      'Server-like pagination + debounced search over 1,000+ records, offline-first with IndexedDB',
    ],
    stack: ['React', 'TypeScript', 'Tailwind', 'MirageJS', 'IndexedDB'],
    links: [
      { label: 'Live', href: 'https://talentflowsavit.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Savit-Raj/TalentFlow' },
    ],
    visual: 'kanban',
    accent: 'violet',
    size: 'md',
  },
  {
    slug: 'creditsea',
    title: 'CreditSea XML Parser',
    kicker: 'Full-stack · Document Processing',
    year: '2025',
    summary:
      'Upload an Experian soft-pull XML and get a clean, structured credit report in seconds: parsed, validated, stored and visualised.',
    highlights: [
      'Drag-and-drop upload with schema validation before any processing',
      'Parses deeply nested credit-report XML into typed report objects',
      'REST API on Railway, MongoDB Atlas storage, frontend on Vercel',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Railway', 'Vercel'],
    links: [
      { label: 'Live', href: 'https://credit-sea-xml-file-parser.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Savit-Raj/CreditSea-XML-File-Parser' },
    ],
    visual: 'xml',
    accent: 'ember',
    size: 'md',
    hidden: true, // not showcased right now — flip to false (or delete this line) to bring it back
  },
]
