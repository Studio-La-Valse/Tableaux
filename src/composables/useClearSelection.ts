// src/composables/useSelectionInteraction.ts
import { onMounted, onUnmounted } from 'vue'
import { useSelectionStore } from '@/stores/selection-store'

export function useClearSelection() {
  const selectionStore = useSelectionStore()

  // Global click handler using capture phase.
  function onClickClearSelection(event: MouseEvent) {
    if (event.button !== 0) return

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
