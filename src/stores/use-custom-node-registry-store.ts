// stores/custom-node-registry.ts
import {
  createCustomNode,
  type CustomNodeDefinition,
} from '@/graph/graph-nodes/json/dynamic-graph-node';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useGraphNodeActivatorStore } from './use-graph-node-activator-store';
import { useGraphNodePanelStore } from './use-graph-node-panel-store';
import DynamicComponentPanel from '@/components/graph/Panels/DynamicComponentPanel.vue';

export const useCustomNodeRegistry = defineStore('custom-node-registry', () => {
  const entries = reactive<Record<string, CustomNodeDefinition>>({});
  const activatorStore = useGraphNodeActivatorStore();

  function register(def: CustomNodeDefinition) {
    if (get(def.name)) {
      throw Error(`Custom node definition with name ${def.name} is already registered.`);
    }

    const ctor = createCustomNode(def);

    entries[def.name] = def;

    // also register with activator store
    activatorStore.register(['Custom', def.name], (id, path) => new ctor(id, path));

    const panelStore = useGraphNodePanelStore();
    panelStore.registerPanel(ctor, DynamicComponentPanel);
  }

  function updateCode(name: string, newCode: string) {
    const entry = entries[name];
    if (!entry) {
      throw Error(
        `Cannot update code for definition with name ${name} because it was not registered.`
      );
    }

    entry.code = newCode;
  }

  function get(name: string): CustomNodeDefinition | undefined {
    return entries[name];
  }

  function getAllDefinitions(): CustomNodeDefinition[] {
    return Object.values(entries);
  }

  function loadFromDefinitions(defs: CustomNodeDefinition[]) {
    for (const def of defs) {
      register(def);
    }
  }

  function clear() {
    for (const key of Object.keys(entries)) {
      activatorStore.unregister(['Custom', key]);
      delete entries[key];
    }
  }

  return { entries, register, updateCode, get, getAllDefinitions, loadFromDefinitions, clear };
});
