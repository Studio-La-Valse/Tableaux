// stores/contextMenu.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGraphStore } from './use-graph-store'
import { useGraphCanvasStore } from './use-graph-canvas-store'

export const useContextMenuStore = defineStore('contextMenu', () => {
  const graph = useGraphStore()
  const canvasTransform = useGraphCanvasStore()

  // state
  const visible = ref(false)
  const xViewPort = ref(0)
  const yViewport = ref(0)
  const xCanvas = ref(0)
  const yCanvas = ref(0)

  // actions
  function open(event: MouseEvent) {
    event.preventDefault()

    visible.value = true

    const viewPortCoords = canvasTransform.clientToViewport(event)
    xViewPort.value = viewPortCoords.x
    yViewport.value = viewPortCoords.y

    const canvasCoords = canvasTransform.clientToCanvas(event)
    xCanvas.value = canvasCoords.x
    yCanvas.value = canvasCoords.y
  }

  function close() {
    visible.value = false
  }

  function onActivate(name: string[]) {
    graph.addNode(name, { x: xCanvas.value, y: yCanvas.value }, crypto.randomUUID())
    close()
  }

  return { visible, x: xViewPort, y: yViewport, open, close, onActivate }
})
