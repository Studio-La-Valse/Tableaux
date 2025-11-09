// stores/edgeSelectionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEdgeSelectionStore = defineStore('edgeSelection', () => {
  const selectedEdgeIds = ref<Set<string>>(new Set())

  const isSelected = (id: string) => selectedEdgeIds.value.has(id)

  const selectEdge = (id: string, mode: 'add' | 'remove' | 'replace') => {
    if (mode === 'remove') {
      selectedEdgeIds.value.delete(id)
    }
    else if (mode === 'add') {
      selectedEdgeIds.value.add(id)
    }
    else {
      selectedEdgeIds.value.clear()
      selectedEdgeIds.value.add(id)
    }
  }

  const deselectAll = () => selectedEdgeIds.value.clear()

  return {
    selectedEdgeIds,
    isSelected,
    selectEdge,
    deselectAll,
  }
})
