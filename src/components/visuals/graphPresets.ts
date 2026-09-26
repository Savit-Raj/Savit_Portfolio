import { accentHex } from '@/lib/utils'
import type { GraphPreset } from './AgentGraphCanvas'

/** Hero: an agent hub dispatching work to its capabilities. */
export const agentPreset: GraphPreset = {
  seed: 7,
  hub: 'agent',
  perCluster: 13,
  spread: 0.19,
  bridges: 9,
  nodeNoun: 'step',
  clusters: [
    { label: 'plan', color: accentHex.signal },
    { label: 'retrieve', color: accentHex.cyan },
    { label: 'tools', color: accentHex.ember },
    { label: 'memory', color: accentHex.violet },
    { label: 'reflect', color: accentHex.rose },
  ],
}

/** RAG Topic Graph project: documents clustered into discovered themes. */
export const topicPreset: GraphPreset = {
  seed: 42,
  perCluster: 16,
  spread: 0.17,
  bridges: 16,
  speed: 1.6,
  nodeNoun: 'chunk',
  clusters: [
    { label: 'topic 0 · tax', color: accentHex.cyan },
    { label: 'topic 1 · contracts', color: accentHex.violet },
    { label: 'topic 2 · finance', color: accentHex.signal },
    { label: 'topic 3 · policy', color: accentHex.ember },
    { label: 'topic 4 · research', color: accentHex.rose },
    { label: 'topic 5 · ops', color: '#7aa2ff' },
  ],
}
