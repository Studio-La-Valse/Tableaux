import type { CustomNodeDefinition } from '@/graph/graph-nodes/json/dynamic-graph-node';
import type { GraphEdgeModel } from './graph-edge-model';
import type { GraphNodeModel } from './graph-node-model';

export type GraphModel = {
  defs?: CustomNodeDefinition[];
  nodes: GraphNodeModel[];
  edges: GraphEdgeModel[];
};
