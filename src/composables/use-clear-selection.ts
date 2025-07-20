// src/composables/useSelectionInteraction.ts
import { onMounted, onUnmounted } from 'vue'
import { useGraphNodeSelectionStore } from '@/stores/graph-node-selection-store'
import { useEdgeSelectionStore } from '@/stores/edge-selection-store'

export function useClearSelection() {
  const nodeSelection = useGraphNodeSelectionStore()
  const edgeSelection = useEdgeSelectionStore()

  // Global click handler using capture phase.
  function onClickClearSelection(event: MouseEvent) {
    if (event.button !== 0) return
    if (event.ctrlKey || event.shiftKey || event.metaKey) return

    nodeSelection.clearSelection()
    edgeSelection.deselectAll()
  }

  // Global keydown handler.
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      nodeSelection.clearSelection()
      edgeSelection.deselectAll()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown, true)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown, true)
  })

  return { onMouseDown: onClickClearSelection }
}
