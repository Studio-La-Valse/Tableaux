import { defineStore } from "pinia";
import type { Component } from "vue";
import GraphNodePanel from "@/components/graph/GraphNodePanel.vue";
import type { GraphNodeConstructor } from "@/graph/graph-nodes/decorators";
import type { IGraphNode } from "@/graph/core/graph-node";

export const useEmitterInputStore = defineStore('graph-emitter-input-store', () => {
    const graphNodeComponentRegistry = new Map<GraphNodeConstructor, Component>();

    const registerInput = (constructor: GraphNodeConstructor, component: Component) => {
        graphNodeComponentRegistry.set(constructor, component);
    };

    const getInput = (node: IGraphNode): Component => {
        for (const [ctor, component] of graphNodeComponentRegistry.entries()) {
            if (node instanceof ctor) {
                return component;
            }
        }

        return GraphNodePanel;
    };

    return {
        registerInput,
        getInput
    }
})
