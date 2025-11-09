import { onMounted, onUnmounted } from 'vue'
// composables/useEdgeSelection.ts
import { useEdgeSelectionStore } from '@/stores/use-edge-selection-store'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useGraphStore } from '@/stores/use-graph-store'

export function useEdgeSelection(edgeId: string) {
  const edgeSelectionStore = useEdgeSelectionStore()
  const nodeSelectionStore = useGraphNodeSelectionStore()
  const graph = useGraphStore()

  const handleClick = (e: MouseEvent) => {
    if (e.button !== 0)
      return

    e.stopPropagation()
    e.preventDefault()

    nodeSelectionStore.clearSelection()
    if (e.ctrlKey || e.metaKey) {
      edgeSelectionStore.selectEdge(edgeId, 'remove')
    }
    else if (e.shiftKey) {
      edgeSelectionStore.selectEdge(edgeId, 'add')
    }
    else {
      edgeSelectionStore.selectEdge(edgeId, 'replace')
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const toRemove = [...edgeSelectionStore.selectedEdgeIds]
    if (!toRemove.some(v => v, false)) {
      return
    }

    if (['Delete', 'Backspace'].includes(event.key)) {
      graph.removeEdges(toRemove)
      edgeSelectionStore.deselectAll()
    }
  }

  const deselect = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey)
      return
    edgeSelectionStore.deselectAll()
  }

  onMounted(() => {
    document.addEventListener('click', deselect)
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', deselect)
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    handleClick,
  }
}
