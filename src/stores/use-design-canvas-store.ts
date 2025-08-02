import type { Shape } from '@/geometry/shape'
import type { XY } from '@/geometry/xy'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useGraphStore } from './use-graph-store'
import { CanvasClick } from '@/graph/graph-nodes/canvas/canvas-click'
import { MouseMove } from '@/graph/graph-nodes/canvas/mouse-move'
import { Viewport } from '@/graph/graph-nodes/canvas/viewport'

const canvasRef = ref<HTMLCanvasElement | undefined>()
const innerDimensions = ref<XY>({ x: 1920, y: 1080 })

export const useDesignCanvasStore = defineStore('canvas-props', () => {
  const dimensions = computed(() => innerDimensions.value)
  const lastClick = ref<XY | undefined>()
  const elements: Ref<Shape[]> = ref([])
  const graph = useGraphStore()

  const setCanvas = (canvas: HTMLCanvasElement) => {
    if (canvasRef.value) throw new Error('Canvas has already been set.')

    canvasRef.value = canvas
    canvas.addEventListener('click', (ev: MouseEvent) => {
      const point = clientToCanvas(ev)
      lastClick.value = point

      graph.nodes
        .map((v) => v.innerNode)
        .filter((v) => v instanceof CanvasClick)
        .forEach((v) => v.onChange(point))
    })

    canvas.addEventListener('mousemove', (ev: MouseEvent) => {
      const point = clientToCanvas(ev)
      lastClick.value = point

      graph.nodes
        .map((v) => v.innerNode)
        .filter((v) => v instanceof MouseMove)
        .forEach((v) => v.onChange(point))
    })
  }

  function clientToCanvas(event: MouseEvent): XY {
    if (!canvasRef.value) throw new Error('Canvas has not been set.')

    const rect = canvasRef.value.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const scaleX = canvasRef.value.width / rect.width
    const scaleY = canvasRef.value.height / rect.height

    const canvasX = x * scaleX
    const canvasY = y * scaleY

    return { x: canvasX, y: canvasY }
  }

  const setDimensions = (_dimensions: XY) => {
    innerDimensions.value = _dimensions

    graph.nodes
      .map((v) => v.innerNode)
      .filter((v) => v instanceof Viewport)
      .forEach((v) => v.onChange(_dimensions))
  }

  function setElements(_elements: Shape[]) {
    elements.value = [..._elements]
  }

  return { dimensions, setDimensions, lastClick, elements, setElements, setCanvas }
})
