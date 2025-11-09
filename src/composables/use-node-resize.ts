import type { Ref } from 'vue'
import { onUnmounted } from 'vue'
import { useContextMenuStore } from '@/stores/use-context-menu-store'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useGraphStore } from '@/stores/use-graph-store'
import { useEdgeDrag } from './use-edge-drag'
import { useEdgeReconnect } from './use-edge-reconnect'

// Define a simple XY interface.
type XY = {
  x: number
  y: number
}

/**
 * A composable that handles pointer-based resize functionality.
 *
 * @param width - A reactive reference to the current width.
 * @param height - A reactive reference to the current height.
 * @returns An object exposing the initResize function, which must be bound to the pointerdown event of the resizer element.
 */
export function useNodeResize(width: Ref<number>, height: Ref<number>) {
  const { clientToCanvas } = useGraphCanvasStore()
  const edgeDrag = useEdgeDrag()
  const edgeReconnect = useEdgeReconnect()
  const menu = useContextMenuStore()
  const graph = useGraphStore()

  // State variables to track the resize start.
  let startLocal: XY = { x: 0, y: 0 }
  let startWidth = width.value
  let startHeight = height.value
  let resizerEl: HTMLElement | null = null

  /**
   * Handles pointer movements to update the dimensions.
   */
  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Get the current pointer position.
    const localPos = clientToCanvas(e)
    const deltaX = localPos.x - startLocal.x
    const deltaY = localPos.y - startLocal.y

    // Update the reactive dimensions.
    width.value = startWidth + deltaX
    height.value = startHeight + deltaY
  }

  /**
   * Finalizes the resize and removes event listeners.
   */
  const onPointerUp = (e: PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (resizerEl) {
      resizerEl.releasePointerCapture(e.pointerId)
      resizerEl.removeEventListener('pointermove', onPointerMove)
      resizerEl.removeEventListener('pointerup', onPointerUp)
      resizerEl.removeEventListener('pointercancel', onPointerUp)

      graph.commit()
    }
  }

  /**
   * Called when the pointer is pressed on the resizer.
   */
  const initResize = (e: PointerEvent) => {
    if (e.button !== 0)
      return // Only respond to the primary (usually left) button.
    e.preventDefault()
    e.stopPropagation()

    // we prevented default behavior but need to stop other stuff.
    edgeDrag.cancelConnect()
    edgeReconnect.clear()
    menu.close()

    // Record the initial pointer position in logical coordinates.
    startLocal = clientToCanvas(e)
    startWidth = width.value
    startHeight = height.value

    // Set pointer capture so we can track pointermove/up events continuously.
    resizerEl = e.currentTarget as HTMLElement
    resizerEl.setPointerCapture(e.pointerId)
    resizerEl.addEventListener('pointermove', onPointerMove)
    resizerEl.addEventListener('pointerup', onPointerUp)
    resizerEl.addEventListener('pointercancel', onPointerUp)
  }

  // Ensure removal of event listeners upon unmounting.
  onUnmounted(() => {
    if (resizerEl) {
      resizerEl.removeEventListener('pointermove', onPointerMove)
      resizerEl.removeEventListener('pointerup', onPointerUp)
      resizerEl.removeEventListener('pointercancel', onPointerUp)
    }
  })

  return { initResize }
}
