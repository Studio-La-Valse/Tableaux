import { onUnmounted } from 'vue'
import { useSelectionAreaStore } from '@/stores/selection-area-store'
import { useSelectionStore } from '@/stores/selection-store'
import { useGraph } from '@/stores/graph-store'
import { useCanvasRefStore } from '@/stores/canvas-ref-store'

export function useSelectionArea() {
  const store = useSelectionAreaStore()
  const selectionStore = useSelectionStore()
  const graphCanvasStroe = useCanvasRefStore()
  const graphStore = useGraph()

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return

    const { x, y } = graphCanvasStroe.clientToCanvas(e)
    store.begin(x, y)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    e.preventDefault()
    e.stopPropagation()
  }

  function onMouseMove(e: MouseEvent) {
    const { x, y } = graphCanvasStroe.clientToCanvas(e)
    store.update(x, y)

    e.preventDefault()
    e.stopPropagation()
  }

  function onMouseUp(e: MouseEvent) {
    if (e.button !== 0) return
    const finalRect = store.end()
    if (finalRect.width > 0 && finalRect.height > 0) {
      applySelection(finalRect)
    }

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)

    e.preventDefault()
    e.stopPropagation()
  }

  /**
   * Given the final selection rectangle, iterate over the provided graph nodes
   * and select those that lie entirely within the rectangle.
   */
  const applySelection = (rect: { x: number; y: number; width: number; height: number }) => {
    // Clear any prior selection.
    selectionStore.clearSelection()
    const min = { clientX: rect.x, clientY: rect.y }
    const max = { clientX: rect.x + rect.width, clientY: rect.y + rect.height }

    // For every node provided, check whether its rectangle is completely within the selection.
    graphStore.nodes.forEach((node) => {
      if (
        // Node's top-left point is to the right and below the selection's top-left...
        node.x >= min.clientX &&
        node.y >= min.clientY &&
        // ... and the node's bottom-right is to the left and above the selection's bottom-right.
        node.x + node.width <= max.clientX &&
        node.y + node.height <= max.clientY
      ) {
        selectionStore.selectNode(node.innerNode.id)
      }
    })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { onMouseDown }
}
