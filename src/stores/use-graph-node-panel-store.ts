import { defineStore } from "pinia";
import type { Component } from "vue";
import GraphNodePanel from "@/components/graph/GraphNodePanel.vue";
import type { GraphNode } from "@/graph/core/graph-node";

export const useGraphNodePanelStore = defineStore('graph-node-panel-store', () => {
    const graphNodeComponentRegistry = new Map<Function, Component>();

    const registerPanel = (constructor: Function, component: Component) => {
        graphNodeComponentRegistry.set(constructor, component);
    };

    const getPanel = (node: GraphNode): Component => {
        for (const [cls, component] of graphNodeComponentRegistry.entries()) {
            if (node instanceof cls) {
                return component;
            }
        }

        return GraphNodePanel;
    };

    return {
        registerPanel,
        getPanel
    }
})