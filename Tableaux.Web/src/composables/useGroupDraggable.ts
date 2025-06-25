// src/composables/useGroupDraggable.ts
import { ref } from 'vue'
import { useTransformToCanvas } from '@/composables/useTransformToCanvas'
import { useSelectionStore } from '@/stores/selection-store'
import { useGraph } from '@/stores/graph-store'
import type { XY } from '@/models/geometry/xy'

export function useGroupDraggable(currentNodeId: string) {
  const { getLocalMousePos, getCanvasContent } = useTransformToCanvas()
  const selectionStore = useSelectionStore()
  const { getNode } = useGraph()

  const dragging = ref(false)
  const wasDragged = ref(false)
  const movementThreshold = 5 // Minimum movement (in pixels) to consider it a drag

  let containerEl: HTMLElement | null = null
  let startPointerPos: XY = { x: 0, y: 0 }
  let dragOffsetMap: Record<string, XY> = {}

  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return // only primary button
    event.stopPropagation() // Prevent propagation to global handlers

    // --- Selection logic on mousedown ---
    if (event.shiftKey) {
      // If Shift is pressed, add the current node to the selection.
      if (!selectionStore.isSelected(currentNodeId)) {
        selectionStore.selectNode(currentNodeId)
      }
    } else if (event.ctrlKey || event.metaKey) {
      // If Ctrl/Cmd is pressed, remove the current node from the selection.
      if (selectionStore.isSelected(currentNodeId)) {
        selectionStore.unselectNode(currentNodeId)
      }
      // In this mode, the node isn’t part of a multi‐drag.
      // (Optionally, you could re-select it for isolated dragging, but here we honor the removal.)
    } else {
      // No modifier: clear any existing selection, then select only the current node.
      if (!selectionStore.isSelected(currentNodeId)) {
        selectionStore.clearSelection()
        selectionStore.selectNode(currentNodeId)
      }
    }
    // ----------------------------------

    // Prepare for dragging:
    const container = getCanvasContent(event.currentTarget)
    if (!container) return
    containerEl = container
    startPointerPos = getLocalMousePos(event, container)

    // For each node in the current selection, record its offset relative to the pointer.
    dragOffsetMap = {}
    selectionStore.selectedNodes.forEach((nodeId) => {
      const nodeInst = getNode(nodeId)
      dragOffsetMap[nodeId] = {
        x: startPointerPos.x - nodeInst.x,
        y: startPointerPos.y - nodeInst.y,
      }
    })

    wasDragged.value = false
    dragging.value = true
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value || !containerEl) return
    event.stopPropagation()

    const currentPointerPos = getLocalMousePos(event, containerEl)
    const dx = currentPointerPos.x - startPointerPos.x
    const dy = currentPointerPos.y - startPointerPos.y

    // Mark as drag if movement exceeds the threshold.
    if (!wasDragged.value && Math.sqrt(dx * dx + dy * dy) > movementThreshold) {
      wasDragged.value = true
    }

    // Update positions for each selected node.
    selectionStore.selectedNodes.forEach((nodeId) => {
      const nodeInst = getNode(nodeId)
      const offset = dragOffsetMap[nodeId] || { x: 0, y: 0 }
      nodeInst.x = currentPointerPos.x - offset.x
      nodeInst.y = currentPointerPos.y - offset.y
    })
  }

  function onMouseUp() {
    if (!dragging.value) return
    dragging.value = false
    containerEl = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    // Reset the drag status flag for future interactions.
    setTimeout(() => {
      wasDragged.value = false
    }, 0)
  }

  return { dragging, wasDragged, onMouseDown }
}
