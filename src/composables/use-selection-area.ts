import { onUnmounted, ref } from 'vue'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useGraphStore } from '@/stores/use-graph-store'
import { useEdgeDrag } from './use-edge-drag'
import { useEdgeReconnect } from './use-edge-reconnect'

type Mode = 'default' | 'add' | 'subtract'
const selecting = ref(false)
const rect = ref({ x: 0, y: 0, width: 0, height: 0 })

export function useSelectionArea() {
  const start = { x: 0, y: 0 }
  const threshold = 5

  const canvasRefStore = useGraphCanvasStore()
  const nodeSelectionStore = useGraphNodeSelectionStore()
  const graphStore = useGraphStore()
  const edgeDrag = useEdgeDrag()
  const edgeReconnect = useEdgeReconnect()

  function begin(x: number, y: number) {
    start.x = x
    start.y = y
    rect.value = { x, y, width: 0, height: 0 }
    selecting.value = false
  }

  function update(x: number, y: number) {
    const dx = x - start.x
    const dy = y - start.y
    if (!selecting.value && Math.hypot(dx, dy) > threshold) {
      selecting.value = true
    }
    if (selecting.value) {
      rect.value = {
        x: Math.min(start.x, x),
        y: Math.min(start.y, y),
        width: Math.abs(dx),
        height: Math.abs(dy),
      }
    }
  }

  function end() {
    selecting.value = false
    return rect.value
  }

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0 || edgeDrag.tempEdge.value || edgeReconnect.tempEdges.value.length)
      return

    e.preventDefault()
    e.stopPropagation()

    const { x, y } = canvasRefStore.clientToCanvas(e)
    begin(x, y)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    const { x, y } = canvasRefStore.clientToCanvas(e)
    update(x, y)

    e.preventDefault()
    e.stopPropagation()
  }

  function onMouseUp(e: MouseEvent) {
    if (e.button !== 0)
      return

    const finalRect = end()
    if (finalRect.width > 0 && finalRect.height > 0) {
      let mode: Mode = 'default'
      if (e.ctrlKey || e.metaKey)
        mode = 'subtract'
      if (e.shiftKey)
        mode = 'add'

      applySelection(finalRect, mode)
    }

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)

    e.preventDefault()
    e.stopPropagation()
  }

  function applySelection(
    rect: { x: number, y: number, width: number, height: number },
    mode: Mode,
  ) {
    if (mode === 'default')
      nodeSelectionStore.clearSelection()

    const min = { x: rect.x, y: rect.y }
    const max = { x: rect.x + rect.width, y: rect.y + rect.height }

    graphStore.nodes
      .filter((node) => {
        return (
          node.xy.x >= min.x
          && node.xy.y >= min.y
          && node.xy.x + node.width <= max.x
          && node.xy.y + node.height <= max.y
        )
      })
      .forEach((node) => {
        if (mode === 'add' || mode === 'default') {
          nodeSelectionStore.selectNode(node.modelId)
        }
        else if (mode === 'subtract') {
          nodeSelectionStore.unselectNode(node.modelId)
        }
      })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { selecting, rect, onMouseDown }
}
