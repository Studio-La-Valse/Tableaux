import 'reflect-metadata';
import type { GraphNode } from '../core/graph-node';
import type { Component } from 'vue';
import type { CustomNodeDefinition } from './json/dynamic-graph-node';

export interface GraphNodeConstructor {
  new (id: string, path: string[]): GraphNode;
  __graphNodePanel?: Component;
  __emitterInput?: Component;
}

export interface CustomNodeConstructor extends GraphNodeConstructor {
  __graphNodePanel: Component;
  __definition: CustomNodeDefinition;
}

export const graphNodeTypes: Array<{
  category: string[];
  ctor: GraphNodeConstructor;
}> = [];

export function GraphNodeType(...category: string[]) {
  return function (target: GraphNodeConstructor) {
    graphNodeTypes.push({ category, ctor: target });
  };
}

export function GraphNodePanel(component: Component) {
  return function (target: GraphNodeConstructor) {
    target.__graphNodePanel = component;
  };
}

export function EmitterInput(component: Component) {
  return function (target: GraphNodeConstructor) {
    target.__emitterInput = component;
  };
}
