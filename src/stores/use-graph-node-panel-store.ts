import { defineStore } from 'pinia';
import type { Component } from 'vue';
import GraphNodePanel from '@/components/graph/GraphNodePanel.vue';
import type { GraphNodeConstructor } from '@/graph/graph-nodes/decorators';
import type { IGraphNode } from '@/graph/core/graph-node';

export const useGraphNodePanelStore = defineStore('graph-node-panel-store', () => {
  const graphNodeComponentRegistry = new Map<GraphNodeConstructor, Component>();

  const registerPanel = (constructor: GraphNodeConstructor, component: Component) => {
    graphNodeComponentRegistry.set(constructor, component);
  };

  const getPanel = (node: IGraphNode): Component => {
    for (const [ctor, component] of graphNodeComponentRegistry.entries()) {
      if (node instanceof ctor) {
        return component;
      }
    }

    return GraphNodePanel;
  };

  return {
    registerPanel,
    getPanel,
  };
});
