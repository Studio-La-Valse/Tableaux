import 'reflect-metadata';
import type { Component } from 'vue';
import type { GraphNodeConstructor, GraphNodeDefinition } from './graph-node-definition';

export const graphNodeTypes: Array<GraphNodeDefinition> = [];

export function GraphNodeType(...category: string[]) {
  return function (target: GraphNodeConstructor) {
    target.__graphNodePath = category;

    graphNodeTypes.push({
      NodeClass: target,
    });
  };
}

export function GraphNodePanel(component: Component) {
  return function (target: GraphNodeConstructor) {
    target.__graphNodePanel = component;
  };
}
