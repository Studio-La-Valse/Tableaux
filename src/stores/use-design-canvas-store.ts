import type { Shape } from '@/geometry/shape'
import type { XY } from '@/geometry/xy'
import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useGraphStore } from './use-graph-store'
import { CanvasClick } from '@/graph/graph-nodes/canvas/canvas-click'
import { MouseMove } from '@/graph/graph-nodes/canvas/mouse-move'
import { Viewport } from '@/graph/graph-nodes/canvas/viewport'
import { BitmapPainter } from '@/bitmap-painters/bitmap-painter'

const canvasRef = ref<HTMLCanvasElement | undefined>()
const innerDimensions = ref<XY>({ x: 1920, y: 1080 })

export const useDesignCanvasStore = defineStore('canvas-props', () => {
  const dimensions = computed(() => innerDimensions.value)
  const lastClick = ref<XY | undefined>()
  const graph = useGraphStore()
  const elements: Shape[] = []

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

    requestRedraw()
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

    requestRedraw()
  }

  function setElements(_elements: Shape[]) {
    elements.length = 0
    _elements.forEach((v) => elements.push(v))
  }

  let redrawRequested = false
  function requestRedraw() {
    redrawRequested = true
    nextTick(() => redraw())
  }

  function redraw() {
    if (!redrawRequested) return

    if (!canvasRef.value) return

    const ctx = canvasRef.value.getContext('2d')
    if (!ctx) return

    canvasRef.value.width = dimensions.value.x
    canvasRef.value.height = dimensions.value.y

    const painter = new BitmapPainter(ctx)
    painter.Init(dimensions.value.x, dimensions.value.y)

    elements.forEach((el) => {
      painter.DrawElement(el)
    })

    painter.Finish()

    redrawRequested = false
  }

  return { dimensions, redraw: requestRedraw, setDimensions, lastClick, setElements, setCanvas }
})
