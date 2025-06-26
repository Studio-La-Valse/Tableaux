import type { XY } from '@/models/geometry/xy'

export const useTransformToCanvas = () => {
  /**
   * Find the closest parent or child with class "canvas-content".
   * This holds the transform.
   */
  function getCanvasContent(el: EventTarget | null): HTMLElement | null {
    if (!(el instanceof HTMLElement)) return null

    // First check up the DOM tree using closest
    const upwardMatch = el.closest('.canvas-content')
    if (upwardMatch) return upwardMatch as HTMLElement

    // If no match above, search downward recursively
    return el.querySelector('.canvas-content') as HTMLElement | null
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
