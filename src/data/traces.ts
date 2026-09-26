import type { TraceScenario } from '@/types/content'

/**
 * Scripted agent runs for the hero terminal. Illustrative only: they show the
 * patterns (decompose → retrieve → grade → retry → reflect → HITL), not client data.
 */
export const traceScenarios: TraceScenario[] = [
  {
    name: 'policy-assistant',
    agent: 'agentic-rag',
    steps: [
      { kind: 'user', text: 'Which expense rules changed in the 2026 travel policy?' },
      { kind: 'plan', text: 'decompose → [2026 rules] [2025 rules] [diff]', llm: true, cost: 0.011 },
      { kind: 'tool', text: 'milvus.hybrid_search(k=12, filter=year:2026)', cost: 0.002 },
      { kind: 'grade', text: 'relevance 4/12 · below threshold → rewrite query', llm: true, cost: 0.009 },
      { kind: 'tool', text: 'milvus.hybrid_search(k=12, q="per-diem & lodging caps")', cost: 0.002 },
      { kind: 'grade', text: 'relevance 10/12 ✓', llm: true, cost: 0.008 },
      { kind: 'reflect', text: 'grounded in 6 chunks · no unsupported claims ✓', llm: true, cost: 0.013 },
      { kind: 'answer', text: '3 changes found: per-diem cap, lodging tier, receipt window [§4.2, §4.7, §6.1]', llm: true, cost: 0.024 },
    ],
  },
  {
    name: 'ops-copilot',
    agent: 'movi',
    steps: [
      { kind: 'user', text: 'Remove the vehicle from trip “Bulk – 00:01”' },
      { kind: 'plan', text: 'intent: remove_vehicle_from_trip · destructive', llm: true, cost: 0.006 },
      { kind: 'tool', text: 'get_trip_status("Bulk – 00:01")', cost: 0.001 },
      { kind: 'observe', text: 'trip is 25% booked · 11 passengers affected' },
      { kind: 'hitl', text: 'consequence check → awaiting human approval…' },
      { kind: 'observe', text: 'operator: “yes, reassign them to 00:15”' },
      { kind: 'tool', text: 'remove_vehicle_from_trip() · assign_vehicle_to_trip()', cost: 0.002 },
      { kind: 'answer', text: 'Done. 11 passengers moved to “Bulk – 00:15”, drivers notified.', llm: true, cost: 0.007 },
    ],
  },
  {
    name: 'doc-intelligence',
    agent: 'topic-graph',
    steps: [
      { kind: 'user', text: 'What themes connect these 40 vendor contracts?' },
      { kind: 'tool', text: 'pymupdf.extract(40 files) → 1,284 semantic chunks' },
      { kind: 'tool', text: 'embed(all-MiniLM) → bertopic.fit(umap, hdbscan)' },
      { kind: 'observe', text: '7 topic clusters · 3 cross-document bridges' },
      { kind: 'plan', text: 'scope chat → cluster #3 “auto-renewal & termination”', llm: true, cost: 0.005 },
      { kind: 'reflect', text: 'answer cites 5 contracts · confidence high ✓', llm: true, cost: 0.006 },
      { kind: 'answer', text: '9 contracts auto-renew within 60 days, and 4 have no exit clause.', llm: true, cost: 0.011 },
    ],
  },
]
