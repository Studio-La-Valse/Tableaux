import type { XY } from '@/geometry/xy'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type GraphLayoutMode = 'split' | 'graph' | 'controls'

export const useGraphCanvasStore = defineStore('graph-canvas-store', () => {
  const viewportRef = ref<HTMLElement | null>(null)
  const canvasRef = ref<HTMLElement | null>(null)
  const mode = ref<GraphLayoutMode>('split')

  function clientToViewport(event: MouseEvent): XY {
    const rect = viewportRef.value?.getBoundingClientRect()
    return rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: 0, y: 0 }
  }

  function clientToCanvas(event: MouseEvent): XY {
    if (!canvasRef.value)
      return { x: 0, y: 0 }

    const pointInViewport = clientToViewport(event)

    const style = window.getComputedStyle(canvasRef.value)
    const transformStr = style.transform

    let matrix = new DOMMatrix()
    if (transformStr && transformStr !== 'none') {
      matrix = new DOMMatrix(transformStr)
    }

    const point = new DOMPoint(pointInViewport.x, pointInViewport.y)
    const invMatrix = matrix.inverse()
    const localPoint = point.matrixTransform(invMatrix)

    return { x: localPoint.x, y: localPoint.y }
  }

  return {
    mode,
    viewportRef,
    canvasRef,
    clientToViewport,
    clientToCanvas,
  }
})
