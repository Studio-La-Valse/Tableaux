import type { XY } from '@/geometry/xy'
import { defineStore } from 'pinia'
import { computed, onUnmounted, ref } from 'vue'
import { useGraphStore } from './use-graph-store'
import { CanvasClick } from '@/graph/graph-nodes/canvas/canvas-click'
import { MouseMove } from '@/graph/graph-nodes/canvas/mouse-move'
import { Viewport } from '@/graph/graph-nodes/canvas/viewport'
import { KeyPress } from '@/graph/graph-nodes/canvas/key-press'

const canvasRef = ref<HTMLCanvasElement | undefined>()
const innerDimensions = ref<XY>({ x: 1920, y: 1080 })

export const useDesignCanvasStore = defineStore('canvas-props', () => {
  const dimensions = computed(() => innerDimensions.value)
  const lastClick = ref<XY | undefined>()
  const graph = useGraphStore()

  const setCanvas = (canvas: HTMLCanvasElement) => {
    if (canvasRef.value) throw new Error('Canvas has already been set.')

    canvasRef.value = canvas

    canvas.addEventListener('click', click)
    canvas.addEventListener('mousemove', mousemove)
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
  }

  const click = (ev: MouseEvent) => {
    const point = clientToCanvas(ev)
    lastClick.value = point

    graph.nodes
      .map((v) => v.innerNode)
      .filter((v) => v instanceof CanvasClick)
      .forEach((v) => v.onChange(point))
  }

  const mousemove = (ev: MouseEvent) => {
    const point = clientToCanvas(ev)
    lastClick.value = point

    graph.nodes
      .map((v) => v.innerNode)
      .filter((v) => v instanceof MouseMove)
      .forEach((v) => v.onChange(point))
  }

  const keydown = (ev: KeyboardEvent) => {
    if (ev.repeat) return
    const key = ev.key

    graph.nodes
      .map((v) => v.innerNode)
      .filter((v) => v instanceof KeyPress)
      .forEach((v) => v.keyDown(key))
  }

  const keyup = (ev: KeyboardEvent) => {
    const key = ev.key

    graph.nodes
      .map((v) => v.innerNode)
      .filter((v) => v instanceof KeyPress)
      .forEach((v) => v.keyUp(key))
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

    if (!canvasRef.value) {
      throw new Error('A canvas has not yet been set!')
    }

    graph.nodes
      .map((v) => v.innerNode)
      .filter((v) => v instanceof Viewport)
      .forEach((v) => v.onChange(_dimensions))
  }

  onUnmounted(() => {
    canvasRef.value?.removeEventListener('click', click)
    canvasRef.value?.removeEventListener('mousemove', mousemove)
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('keyup', keyup)
  })

  return { dimensions, setDimensions, lastClick, setCanvas, canvasRef }
})
