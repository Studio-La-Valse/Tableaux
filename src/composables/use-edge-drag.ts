import { ref, onUnmounted } from 'vue'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useContextMenuStore } from '@/stores/use-context-menu-store'

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
  const { clientToCanvas } = useGraphCanvasStore()
  const { close } = useContextMenuStore()

  function startConnect(fromNodeId: string, fromOutputIndex: number, e: MouseEvent) {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()

    close()

    const { x, y } = clientToCanvas(e)
    tempEdge.value = { fromNodeId, fromOutputIndex, currentX: x, currentY: y }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onGlobalClick)
    window.addEventListener('keyup', onKeyUp)
  }

  // update preview line end coords
  function onMouseMove(e: MouseEvent) {
    if (!tempEdge.value) return
    const pos = clientToCanvas(e)
    tempEdge.value.currentX = pos.x
    tempEdge.value.currentY = pos.y
  }

  // cancel if clicking anywhere else (left-click but not on an input)
  function onGlobalClick(e: MouseEvent) {
    if (e.button !== 0) return
    // let finishEdgeConnect handle clicks on inputs;
    // here we cancel on any other left-click
    cancelConnect()
  }

  // cancel on Escape key
  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Escape') cancelConnect()
  }

  function finishConnect(
    toNodeId: string,
    toInputIndex: number,
    e: MouseEvent,
  ): GraphEdgePrototype | null {
    if (e.button !== 0 || !tempEdge.value) return null
    e.stopPropagation()
    e.preventDefault()

    const edge: GraphEdgePrototype = {
      fromNodeId: tempEdge.value.fromNodeId,
      fromOutputIndex: tempEdge.value.fromOutputIndex,
      toNodeId,
      toInputIndex,
    }

    // allow to connect multiple.
    if (e.shiftKey) return edge

    cancelConnect()
    return edge
  }

  function cancelConnect() {
    tempEdge.value = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mousedown', onGlobalClick)
    window.removeEventListener('keyup', onKeyUp)
  }

  // Clean up if component unmounts mid-connect
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
