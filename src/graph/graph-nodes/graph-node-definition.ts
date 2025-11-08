// graph-node-types.ts
import type { GraphNode } from '../../graph/core/graph-node';
import type { CustomNodeDefinition } from './json/dynamic-graph-node';

export type GraphNodeDefinition = {
  category: string[];
  NodeClass: new (id: string, path: string[]) => GraphNode;
  description?: string;
  icon?: string;
  customTemplate?: CustomNodeDefinition;
};

export function isGraphNodeDefinition(value: unknown): value is GraphNodeDefinition {
  return (
    typeof value === 'object' &&
    value !== null &&
    'category' in value &&
    Array.isArray(value.category) &&
    'NodeClass' in value &&
    typeof value.NodeClass === 'function' &&
    (!('icon' in value) || typeof value.icon === 'string') &&
    (!('description' in value) || typeof value.description === 'string')
  );
}
