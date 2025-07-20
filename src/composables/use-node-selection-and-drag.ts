import { ref } from 'vue'
import { useGraphNodeSelectionStore } from '@/stores/graph-node-selection-store'
import { useGraph } from '@/stores/graph-store'
import type { XY } from '@/models/geometry/xy'
import { useCanvasRefStore } from '@/stores/canvas-ref-store'
import { useEdgeSelectionStore } from '@/stores/edge-selection-store'
import { useContextMenuStore } from '@/stores/context-menu'
import { useEdgeDrag } from './use-edge-drag'

export function useNodeSelectionAndDrag() {
  const selectionStore = useGraphNodeSelectionStore()
  const edgeSelectionStore = useEdgeSelectionStore()
  const menu = useContextMenuStore()
  const edgeDrag = useEdgeDrag();

  const { clientToCanvas } = useCanvasRefStore()
  const graph = useGraph()

  const dragging = ref(false)
  const wasDragged = ref(false)
  const threshold = 5

  let startPointerPos: XY = { x: 0, y: 0 }

  // maps nodeId → offset from pointer to node at start
  let dragOffsetMap: Record<string, XY> = {}

  function onMouseDown(event: MouseEvent, nodeId: string) {
    if (event.button !== 0) return

    // Prevent default and propagation
    event.preventDefault()
    event.stopPropagation()

    // but still need to close and cancel menu and edge drag.
    menu.close()
    edgeDrag.cancelConnect();

    // ——— selection logic ———
    edgeSelectionStore.deselectAll()
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
    dragOffsetMap = {}

    selectionStore.selectedNodes.forEach((id) => {
      const n = graph.getNode(id)
      dragOffsetMap[id] = {
        x: startPointerPos.x - n.x,
        y: startPointerPos.y - n.y,
      }
    })

    wasDragged.value = false
    dragging.value = true

    window.addEventListener('mousemove', onMouseMove, { capture: true })
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value) return

    const cur = clientToCanvas(event)
    const dx = cur.x - startPointerPos.x
    const dy = cur.y - startPointerPos.y

    if (!wasDragged.value && Math.hypot(dx, dy) > threshold) {
      wasDragged.value = true
    }

    // move whatever is selected
    selectionStore.selectedNodes.forEach((id) => {
      const n = graph.getNode(id)
      const offs = dragOffsetMap[id] || { x: 0, y: 0 }
      n.x = cur.x - offs.x
      n.y = cur.y - offs.y
    })

    event.preventDefault()
    event.stopPropagation()
  }

  function onMouseUp() {
    if (!dragging.value) return

    dragging.value = false

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
