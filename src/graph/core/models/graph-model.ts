import type { GraphEdgeModel } from './graph-edge-model';
import type { GraphNodeModel } from './graph-node-model';

export type GraphModel = {
  nodes: GraphNodeModel[];
  edges: GraphEdgeModel[];
};
