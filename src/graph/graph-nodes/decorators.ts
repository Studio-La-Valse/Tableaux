import 'reflect-metadata';
import type { GraphNode } from '../core/graph-node';

interface GraphNodeConstructor {
  new (id: string, path: string[]): GraphNode;
}

export const graphNodeTypes: Array<{ category: string[]; ctor: GraphNodeConstructor }> = [];

export function GraphNodeType(...category: string[]) {
  return function (target: GraphNodeConstructor) {
    graphNodeTypes.push({ category, ctor: target });
  };
}
