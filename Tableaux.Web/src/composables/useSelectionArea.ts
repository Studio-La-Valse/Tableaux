import { useGraph } from '@/stores/graph-store'
import { useSelectionStore } from '@/stores/selection-store'
import { ref, onUnmounted, type Ref } from 'vue'
import { useCanvasTransform } from './useCanvasTransform'

export function useSelectionArea() {
  const graphStore = useGraph()
  const { clearSelection, selectNode } = useSelectionStore()
  const { getCanvasContent, getLocalMousePos } = useCanvasTransform()

  // Indicates whether a selection drag is in progress.
  const selecting = ref(false)
  const threshold = 5

  // Coordinates
  const startX = ref(0)
  const startY = ref(0)
  const x = ref(0)
  const y = ref(0)
  const width = ref(0)
  const height = ref(0)

  const hasMoved = ref(false)
  const canvasRef: Ref<HTMLElement | null> = ref(null)

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return

    canvasRef.value = getCanvasContent(e.currentTarget)
    if (!canvasRef.value) return

    const localPos = getLocalMousePos(e, canvasRef.value)

    startX.value = localPos.x
    startY.value = localPos.y

    x.value = localPos.x
    y.value = localPos.y
    width.value = 0
    height.value = 0

    hasMoved.value = false
    selecting.value = false

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!canvasRef.value) return

    const localPos = getLocalMousePos(e, canvasRef.value)
    const dx = localPos.x - startX.value
    const dy = localPos.y - startY.value

    if (!hasMoved.value && Math.hypot(dx, dy) > threshold) {
      hasMoved.value = true
      selecting.value = true
    }

    if (selecting.value) {
      x.value = Math.min(startX.value, localPos.x)
      y.value = Math.min(startY.value, localPos.y)
      width.value = Math.abs(dx)
      height.value = Math.abs(dy)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const onMouseUp = (e: MouseEvent) => {
    if (e.button !== 0) return

    if (selecting.value) {
      // If a draggight happened (i.e. a nonzero rectangle), update selection.
      if (width.value > 0 && height.value > 0) {
        applySelection()
      }

      e.preventDefault()
      e.stopPropagation()

      selecting.value = false
    }

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  /**
   * Given the final selection rectangle, iterate over the provided graph nodes
   * and select those that lie entirely within the rectangle.
   */
  const applySelection = () => {
    // Clear any prior selection.
    clearSelection()
    const min = { clientX: x.value, clientY: y.value }
    const max = { clientX: x.value + width.value, clientY: y.value + height.value }

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
        selectNode(node.id)
      }
    })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { selecting, x, y, width, height, onMouseDown }
}
