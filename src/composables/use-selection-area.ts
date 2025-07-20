import { onUnmounted } from 'vue'
import { useSelectionAreaStore } from '@/stores/use-selection-area-store'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useGraphStore } from '@/stores/use-graph-store'
import { useCanvasRefStore } from '@/stores/use-canvas-ref-store'
import { useEdgeDrag } from './use-edge-drag'

type mode = 'default' | 'add' | 'subtract'

export function useSelectionArea() {
  const selectionAreaStore = useSelectionAreaStore()
  const nodeSelectionStore = useGraphNodeSelectionStore()
  const canvasRefStore = useCanvasRefStore()
  const graphStore = useGraphStore()
  const edgeDrag = useEdgeDrag()

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return
    if (edgeDrag.tempEdge.value) return

    e.preventDefault()
    e.stopPropagation()

    const { x, y } = canvasRefStore.clientToCanvas(e)
    selectionAreaStore.begin(x, y)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    const { x, y } = canvasRefStore.clientToCanvas(e)
    selectionAreaStore.update(x, y)

    e.preventDefault()
    e.stopPropagation()
  }

  function onMouseUp(e: MouseEvent) {
    if (e.button !== 0) return

    const finalRect = selectionAreaStore.end()
    if (finalRect.width > 0 && finalRect.height > 0) {
      let mode: mode = 'default'
      if (e.ctrlKey || e.metaKey) mode = 'subtract'
      if (e.shiftKey) mode = 'add'

      applySelection(finalRect, mode)
    }

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)

    e.preventDefault()
    e.stopPropagation()
  }

  function applySelection(
    rect: { x: number; y: number; width: number; height: number },
    mode: mode,
  ) {
    if (mode === 'default') nodeSelectionStore.clearSelection()

    const min = { x: rect.x, y: rect.y }
    const max = { x: rect.x + rect.width, y: rect.y + rect.height }

    graphStore.nodes
      .filter((node) => {
        return (
          node.x >= min.x &&
          node.y >= min.y &&
          node.x + node.width <= max.x &&
          node.y + node.height <= max.y
        )
      })
      .forEach((node) => {
        if (mode === 'add' || mode === 'default') {
          nodeSelectionStore.selectNode(node.innerNode.id)
        } else if (mode === 'subtract') {
          nodeSelectionStore.unselectNode(node.innerNode.id)
        }
      })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { onMouseDown }
}
