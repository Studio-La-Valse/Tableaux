// src/composables/useEdgeDrag.ts
import type { XY } from '@/models/geometry/xy'
import type { GraphEdge } from '@/models/graph/core/graph-edge'
import { ref } from 'vue'

export interface TempEdgeData {
  fromNodeId: string
  fromOutputIndex: number
  currentX: number
  currentY: number
}

export interface GraphEdgePrototype {
  fromNodeId: string,
  fromOutputIndex: number,
  toNodeId: string,
  toInputIndex: number,
}

const tempEdge = ref<TempEdgeData | null>(null)
const containerEl = ref<HTMLElement | null>(null)

/**
 * Converts the pointer event’s client coordinates into logical coordinates of
 * the container by inverting its computed transform (using DOMMatrix).
 */
function getLocalMousePos(event: MouseEvent | PointerEvent, container: HTMLElement): XY {
  const style = window.getComputedStyle(container)
  const transformStr = style.transform
  let matrix = new DOMMatrix()
  if (transformStr && transformStr !== 'none') {
    matrix = new DOMMatrix(transformStr)
  }
  const point = new DOMPoint(event.clientX, event.clientY)
  const invMatrix = matrix.inverse()
  const localPoint = point.matrixTransform(invMatrix)
  return { x: localPoint.x, y: localPoint.y }
}

export function useEdgeDrag() {
  function startEdgeDrag(fromNodeId: string, fromOutputIndex: number, e: MouseEvent) {
    if (e.button !== 0) return
    // Prevent the canvas from panning.
    e.stopPropagation()

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
  }

  /**
   * Finalize the drag by "dropping" on an input. You can then use the returned
   * connection data to create an edge.
   */
  function finishEdgeDrag(targetNodeId: string, targetInputIndex: number): GraphEdgePrototype | null {
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

  /**
   * Cancel any active edge drag.
   */
  function cancelEdgeDrag() {
    tempEdge.value = null
    if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
    if (mouseUpHandler) window.removeEventListener('mouseup', mouseUpHandler)
  }

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!containerEl.value) return
    e.stopPropagation()

    const mousePos = getLocalMousePos(e, containerEl.value)
    updateEdgeDrag(mousePos.x, mousePos.y)
  }

  /**
   * Update the drag state with the new (logical) coordinates.
   */
  function updateEdgeDrag(x: number, y: number) {
    if (tempEdge.value) {
      tempEdge.value.currentX = x
      tempEdge.value.currentY = y
    }
  }

  const mouseUpHandler = () => {
    // If mouse is released without a valid drop, cancel the drag.
    cancelEdgeDrag()
    if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
    if (mouseUpHandler) window.removeEventListener('mouseup', mouseUpHandler)
  }

  /**
   * Finds the closest parent with class "canvas-content" to get the current
   * transform (scale, translate, etc.).
   */
  function getCanvasContent(el: EventTarget | null): HTMLElement | null {
    if (el instanceof HTMLElement) {
      return el.closest('.canvas-content') as HTMLElement
    }
    return null
  }

  return {
    tempEdge,
    startEdgeDrag,
    updateEdgeDrag,
    finishEdgeDrag,
    cancelEdgeDrag,
  }
}
