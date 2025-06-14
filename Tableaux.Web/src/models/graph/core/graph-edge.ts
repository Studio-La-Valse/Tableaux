import type { GraphNodeInput } from './graph-node-input'
import type { GraphNodeOutput } from './graph-node-output'

export interface GraphEdge {
  graphNodeInput: GraphNodeInput
  graphNodeOutput: GraphNodeOutput
}
