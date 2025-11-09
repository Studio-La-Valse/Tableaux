import type { GraphEdgeModel } from './graph-edge-model'
import type { GraphNodeModel } from './graph-node-model'
import type { CustomNodeDefinition } from '@/graph/graph-nodes/json/dynamic-graph-node'

export type GraphModel = {
  defs: CustomNodeDefinition[]
  nodes: GraphNodeModel[]
  edges: GraphEdgeModel[]
}
