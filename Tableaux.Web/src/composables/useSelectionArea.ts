import { onUnmounted } from 'vue'
import { useSelectionAreaStore } from '@/stores/selection-area-store'
import { useTransformToCanvas } from './useTransformToCanvas'
import { useSelectionStore } from '@/stores/selection-store'
import { useGraph } from '@/stores/graph-store'

export function useSelectionArea() {
  const store = useSelectionAreaStore()
  const selectionStore = useSelectionStore();
  const graphStore = useGraph();

  const { getCanvasContent, getLocalMousePos } = useTransformToCanvas()
  let canvasEl: HTMLElement | null = null

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return
    canvasEl = getCanvasContent(e.currentTarget)
    if (!canvasEl) return
    const { x, y } = getLocalMousePos(e, canvasEl)
    store.begin(x, y)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!canvasEl) return
    e.preventDefault()
    const { x, y } = getLocalMousePos(e, canvasEl)
    store.update(x, y)
  }

  function onMouseUp(e: MouseEvent) {
    if (e.button !== 0) return
    const finalRect = store.end()
    if (finalRect.width > 0 && finalRect.height > 0) {
      applySelection(finalRect);
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  /**
   * Given the final selection rectangle, iterate over the provided graph nodes
   * and select those that lie entirely within the rectangle.
   */
  const applySelection = (rect: {x: number, y: number, width: number, height: number}) => {
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
        selectionStore.selectNode(node.id)
      }
    })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { onMouseDown }
}
