import { ref } from 'vue'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useGraphStore } from '@/stores/use-graph-store'
import type { XY } from '@/geometry/xy'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useEdgeSelectionStore } from '@/stores/use-edge-selection-store'
import { useContextMenuStore } from '@/stores/use-context-menu-store'
import { useEdgeDrag } from './use-edge-drag'
import type { IGraphNodeWrapper } from '@/graph/core/graph-node-wrapper'
import { useEdgeReconnect } from './use-edge-reconnect'

export function useNodeSelectionAndDrag() {
  const selectionStore = useGraphNodeSelectionStore()
  const edgeSelectionStore = useEdgeSelectionStore()
  const menu = useContextMenuStore()
  const edgeDrag = useEdgeDrag()
  const edgeReconnect = useEdgeReconnect()

  const { clientToCanvas } = useGraphCanvasStore()
  const graph = useGraphStore()

  const dragging = ref(false)
  const wasDragged = ref(false)
  const threshold = 5

  let startPointerPos: XY = { x: 0, y: 0 }

  // maps elements to drag with their original position
  const draggableElements: { node: IGraphNodeWrapper; startPos: XY }[] = []

  function onMouseDown(event: MouseEvent, nodeId: string) {
    if (event.button !== 0) return

    // Prevent default and propagation
    event.preventDefault()
    event.stopPropagation()

    // but still need to close and cancel menu and edge drag.
    menu.close()
    edgeDrag.cancelConnect()
    edgeReconnect.clear()
    edgeSelectionStore.deselectAll()

    // ——— selection logic ———
    if (event.shiftKey) {
      if (!selectionStore.isSelected(nodeId)) {
        selectionStore.selectNode(nodeId)
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (selectionStore.isSelected(nodeId)) {
        selectionStore.unselectNode(nodeId)
      }
    } else {
      if (!selectionStore.isSelected(nodeId)) {
        selectionStore.clearSelection()
        selectionStore.selectNode(nodeId)
      }
    }
    // ————————————————

    // record anchor point & initial node positions
    startPointerPos = clientToCanvas(event)
    draggableElements.length = 0

    selectionStore.selectedNodes.forEach((id) => {
      const n = graph.getNode(id)
      draggableElements.push({ node: n, startPos: n.xy })
    })

    wasDragged.value = false
    dragging.value = true

    window.addEventListener('mousemove', onMouseMove, { capture: true })
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value) return

    event.preventDefault()
    event.stopPropagation()

    const cur = clientToCanvas(event)
    const dx = cur.x - startPointerPos.x
    const dy = cur.y - startPointerPos.y

    if (!wasDragged.value && Math.hypot(dx, dy) > threshold) {
      wasDragged.value = true
    }

    if (wasDragged.value) {
      // move whatever is selected
      draggableElements.forEach(({ node, startPos }) => {
        node.xy = { x: startPos.x + dx, y: startPos.y + dy }
      })
    }
  }

  function onMouseUp() {
    if (!dragging.value) return

    dragging.value = false
    draggableElements.length = 0

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    if (wasDragged.value) {
      graph.commit()

      // reset drag-flag for next cycle
      setTimeout(() => (wasDragged.value = false), 0)
    }
  }

  return {
    dragging,
    wasDragged,
    onMouseDown,
  }
}
