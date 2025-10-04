// src/stores/selection-store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGraphNodeSelectionStore = defineStore('selection', () => {
  // A Set is used to easily add/remove/check node IDs.
  const selectedNodes = ref<Set<string>>(new Set());

  function selectNode(nodeId: string) {
    selectedNodes.value.add(nodeId);
  }

  function unselectNode(nodeId: string) {
    selectedNodes.value.delete(nodeId);
  }

  function clearSelection() {
    selectedNodes.value.clear();
  }

  function isSelected(nodeId: string): boolean {
    return selectedNodes.value.has(nodeId);
  }

  return {
    selectedNodes,
    selectNode,
    unselectNode,
    clearSelection,
    isSelected,
  };
});
