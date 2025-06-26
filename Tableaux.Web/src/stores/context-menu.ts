// stores/contextMenu.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGraph } from './graph-store'
import { useTransformToCanvas } from '@/composables/useTransformToCanvas'

export const useContextMenuStore = defineStore('contextMenu', () => {
  const graph = useGraph()

  const { getLocalMousePos, getCanvasContent } = useTransformToCanvas()

  // state
  const visible = ref(false)
  const x = ref(0)
  const y = ref(0)
  const xCanvas = ref(0)
  const yCanvas = ref(0)

  // actions
  function open(event: MouseEvent) {
    event.preventDefault()
    visible.value = true
    x.value = event.clientX
    y.value = event.clientY

    const canvas = getCanvasContent(event.currentTarget);
    const canvasPos = getLocalMousePos(event, canvas!);
    xCanvas.value = canvasPos.x;
    yCanvas.value = canvasPos.y;
  }

  function close() {
    visible.value = false
  }

  function onActivate(name: string[]) {
    graph.addNode(name, { x: xCanvas.value, y: yCanvas.value }, crypto.randomUUID())
    close()
  }

  return { visible, x, y, open, close, onActivate }
})
