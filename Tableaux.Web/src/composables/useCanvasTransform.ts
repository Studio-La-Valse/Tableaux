import type { XY } from "@/models/geometry/xy"

export const useCanvasTransform = () => {
  /**
   * Find the closest parent with class "canvas-content". This holds the transform.
   */
  function getCanvasContent(el: EventTarget | null): HTMLElement | null {
    if (el instanceof HTMLElement) {
      return el.closest('.canvas-content') as HTMLElement
    }
    return null
  }

  /**
   * Convert the mouse event’s coordinates into the canvas-content’s logical space.
   * We use DOMMatrix to invert the container’s computed transform.
   */
  function getLocalMousePos(event: MouseEvent, container: HTMLElement): XY {
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

  return { getCanvasContent, getLocalMousePos }
}
