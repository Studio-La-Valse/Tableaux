// src/composables/useSelectionInteraction.ts
import { onMounted, onUnmounted } from 'vue'
import { useGraphNodeSelectionStore } from '@/stores/graph-node-selection-store'

export function useClearSelection() {
  const selectionStore = useGraphNodeSelectionStore()

  // Global click handler using capture phase.
  function onClickClearSelection(event: MouseEvent) {
    if (event.button !== 0) return
    if (event.ctrlKey || event.shiftKey || event.metaKey) return
    
    selectionStore.clearSelection()
  }

  // Global keydown handler.
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      selectionStore.clearSelection()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown, true)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown, true)
  })

  return { onClickClearSelection }
}
