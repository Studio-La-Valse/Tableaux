// graph-node-types.ts
import type { Component } from 'vue';
import type { GraphNode } from '../../graph/core/graph-node';
import type { CustomNodeDefinition } from './json/dynamic-graph-node';

export interface GraphNodeConstructor {
  new (modelId: string): GraphNode;

  __graphNodePath?: string[];

  /** Panel component (optional, added by decorator) */
  __graphNodePanel?: Component;

  /** Optional metadata about the class (label, description, icon...) */
  __graphNodeTypeLabel?: string;
  __graphNodeTypeDescription?: string;
  __graphNodeIcon?: string;
}

export type GraphNodeDefinition = {
  NodeClass: GraphNodeConstructor;
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
