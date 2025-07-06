import { useCanvasRefStore } from '@/stores/canvas-ref-store'
import { ref } from 'vue'

export interface TempEdgeData {
  fromNodeId: string
  fromOutputIndex: number
  currentX: number
  currentY: number
}

export interface GraphEdgePrototype {
  fromNodeId: string
  fromOutputIndex: number
  toNodeId: string
  toInputIndex: number
}

const tempEdge = ref<TempEdgeData | null>(null)

export function useEdgeDrag() {
  const { clientToCanvas } = useCanvasRefStore()

  function cancelEdgeDrag() {
    tempEdge.value = null
    if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
    if (mouseUpHandler) window.removeEventListener('mouseup', mouseUpHandler)
  }

  function mouseMoveHandler(e: MouseEvent) {
    e.stopPropagation()

    const mousePos = clientToCanvas(e)
    updateEdgeDrag(mousePos.x, mousePos.y)
  }

  function updateEdgeDrag(x: number, y: number) {
    if (tempEdge.value) {
      tempEdge.value.currentX = x
      tempEdge.value.currentY = y
    }
  }

  function mouseUpHandler() {
    // If mouse is released without a valid drop, cancel the drag.
    cancelEdgeDrag()
    if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
    if (mouseUpHandler) window.removeEventListener('mouseup', mouseUpHandler)
  }

  function startEdgeDrag(fromNodeId: string, fromOutputIndex: number, e: MouseEvent) {
    if (e.button !== 0) return

    const mousePos = clientToCanvas(e)
    tempEdge.value = {
      fromNodeId,
      fromOutputIndex,
      currentX: mousePos.x,
      currentY: mousePos.y,
    }

    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener('mouseup', mouseUpHandler)

    e.stopPropagation()
  }

  function finishEdgeDrag(
    targetNodeId: string,
    targetInputIndex: number,
  ): GraphEdgePrototype | null {
    if (tempEdge.value) {
      const newEdgeData = {
        fromNodeId: tempEdge.value.fromNodeId,
        fromOutputIndex: tempEdge.value.fromOutputIndex,
        toNodeId: targetNodeId,
        toInputIndex: targetInputIndex,
      }
      cancelEdgeDrag()
      return newEdgeData
    }
    return null
  }

  return {
    tempEdge,
    startEdgeDrag,
    finishEdgeDrag,
  }
}
