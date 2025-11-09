import type { GraphEdgePrototype } from '@/graph/core/graph-edge'
import { onUnmounted, ref } from 'vue'
import { useContextMenuStore } from '@/stores/use-context-menu-store'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useGraphStore } from '@/stores/use-graph-store'

export type EdgeDirection = 'forward' | 'reverse'

export type TempEdgeData = {
  direction: EdgeDirection
  fromNodeId?: string
  fromOutputIndex?: number
  toNodeId?: string
  toInputIndex?: number
  currentX: number
  currentY: number
}

const tempEdge = ref<TempEdgeData | null>(null)

export function useEdgeDrag() {
  const { clientToCanvas } = useGraphCanvasStore()
  const { close } = useContextMenuStore()
  const { connect } = useGraphStore()
  /**
   * Start connecting from an OUTPUT (forward) or from an INPUT (reverse)
   */
  function startConnect(
    direction: EdgeDirection,
    nodeId: string,
    portIndex: number,
    e: MouseEvent,
  ) {
    if (e.button !== 0)
      return
    e.stopPropagation()
    e.preventDefault()

    close()

    const { x, y } = clientToCanvas(e)

    if (direction === 'forward') {
      tempEdge.value = {
        direction,
        fromNodeId: nodeId,
        fromOutputIndex: portIndex,
        currentX: x,
        currentY: y,
      }
    }
    else {
      tempEdge.value = {
        direction,
        toNodeId: nodeId,
        toInputIndex: portIndex,
        currentX: x,
        currentY: y,
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onGlobalClick)
    window.addEventListener('keyup', onKeyUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!tempEdge.value)
      return
    const pos = clientToCanvas(e)
    tempEdge.value.currentX = pos.x
    tempEdge.value.currentY = pos.y
  }

  function onGlobalClick(e: MouseEvent) {
    if (e.button !== 0)
      return
    cancelConnect()
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Escape')
      cancelConnect()
  }

  /**
   * Finish connecting — the clicked port type depends on the starting direction
   */
  function finishConnect(nodeId: string, portIndex: number, e: MouseEvent): void {
    if (e.button !== 0 || !tempEdge.value)
      return
    e.stopPropagation()
    e.preventDefault()

    let edge: GraphEdgePrototype

    if (tempEdge.value.direction === 'forward') {
      // Started from output → now clicked input
      edge = {
        fromNodeId: tempEdge.value.fromNodeId!,
        fromOutputIndex: tempEdge.value.fromOutputIndex!,
        toNodeId: nodeId,
        toInputIndex: portIndex,
      }
    }
    else {
      // Started from input → now clicked output
      edge = {
        fromNodeId: nodeId,
        fromOutputIndex: portIndex,
        toNodeId: tempEdge.value.toNodeId!,
        toInputIndex: tempEdge.value.toInputIndex!,
      }
    }

    if (edge) {
      connect([edge])
    }

    if (!e.shiftKey) {
      cancelConnect()
    }
  }

  function cancelConnect() {
    tempEdge.value = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mousedown', onGlobalClick)
    window.removeEventListener('keyup', onKeyUp)
  }

  onUnmounted(() => {
    cancelConnect()
  })

  return {
    tempEdge,
    startConnect,
    finishConnect,
    cancelConnect,
  }
}
