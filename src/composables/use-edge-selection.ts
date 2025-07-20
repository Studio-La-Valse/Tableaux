// composables/useEdgeSelection.ts
import { useEdgeSelectionStore } from '@/stores/edge-selection-store'
import { useGraphNodeSelectionStore } from '@/stores/graph-node-selection-store'
import { useGraph } from '@/stores/graph-store'
import { onMounted, onUnmounted } from 'vue'

export function useEdgeSelection(edgeId: string) {
  const edgeSelectionStore = useEdgeSelectionStore()
  const nodeSelectionStore = useGraphNodeSelectionStore()
  const graph = useGraph()

  const handleClick = (e: MouseEvent) => {
    if (e.button !== 0) return

    e.stopPropagation()
    e.preventDefault()

    nodeSelectionStore.clearSelection()
    if (e.ctrlKey || e.metaKey) {
      edgeSelectionStore.selectEdge(edgeId, 'remove')
    } else if (e.shiftKey) {
      edgeSelectionStore.selectEdge(edgeId, 'add')
    } else {
      edgeSelectionStore.selectEdge(edgeId, 'replace')
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (['Delete', 'Backspace'].includes(event.key)) {
      graph.removeEdges([...edgeSelectionStore.selectedEdgeIds])
      edgeSelectionStore.deselectAll()
    }
  }

  const deselect = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) return
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
