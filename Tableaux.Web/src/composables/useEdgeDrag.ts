import { ref } from 'vue'
import { useTransformToCanvas } from './useTransformToCanvas'

const { getCanvasContent, getLocalMousePos } = useTransformToCanvas()

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
const containerEl = ref<HTMLElement | null>(null)

function cancelEdgeDrag() {
  tempEdge.value = null
  if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
  if (mouseUpHandler) window.removeEventListener('mouseup', mouseUpHandler)
}

function mouseMoveHandler(e: MouseEvent) {
  if (!containerEl.value) return
  e.stopPropagation()

  const mousePos = getLocalMousePos(e, containerEl.value)
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

export function useEdgeDrag() {
  function startEdgeDrag(fromNodeId: string, fromOutputIndex: number, e: MouseEvent) {
    if (e.button !== 0) return

    const container = getCanvasContent(e.currentTarget)
    if (!container) return
    containerEl.value = container

    const mousePos = getLocalMousePos(e, container)
    tempEdge.value = {
      fromNodeId,
      fromOutputIndex,
      currentX: mousePos.x,
      currentY: mousePos.y,
    }

    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener('mouseup', mouseUpHandler)

    e.stopPropagation();
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
