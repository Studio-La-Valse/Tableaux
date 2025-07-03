// src/composables/usePanZoom.ts
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface Position {
  x: number
  y: number
}
interface Size {
  width: number
  height: number
}
interface Options {
  minScale?: number
  maxScale?: number
  zoomIntensity?: number
}

export function useCanvasTransform(options: Options = {}) {
  const { minScale = 0.2, maxScale = 5, zoomIntensity = 0.1 } = options

  // Refs for container and—optionally—the content
  const containerRef = ref<HTMLElement | null>(null)
  const contentRef = ref<HTMLElement | null>(null)

  // Track container’s pixel size (for correct zoom centering)
  const canvasSize = ref<Size>({ width: 300, height: 300 })
  function updateCanvasSize() {
    if (!containerRef.value) return
    canvasSize.value = {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight,
    }
  }

  let resizeObserver: ResizeObserver | null = null
  onMounted(() => {
    nextTick(updateCanvasSize)
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(updateCanvasSize)
      resizeObserver.observe(containerRef.value)
    }
  })
  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  // Pan & zoom state
  const position = ref<Position>({ x: 0, y: 0 })
  const scale = ref<number>(1)
  const style = computed(() => ({
    transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`,
    transformOrigin: 'top left',
  }))

  // Drag‐to‐pan
  const isDragging = ref(false)
  const startPosition = ref<Position>({ x: 0, y: 0 })

  function onMouseDown(event: MouseEvent) {
    // Only right-button pans
    if (event.button !== 2) return

    isDragging.value = true
    startPosition.value = { x: event.clientX, y: event.clientY }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    event.preventDefault()
    event.stopPropagation()
  }

  function onMouseMove(event: MouseEvent) {
    if (!isDragging.value) return
    const dx = event.clientX - startPosition.value.x
    const dy = event.clientY - startPosition.value.y

    position.value.x += dx
    position.value.y += dy
    startPosition.value = { x: event.clientX, y: event.clientY }

    event.preventDefault()
    event.stopPropagation()
  }

  function onMouseUp(event: MouseEvent) {
    if (!isDragging.value) return
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    event.preventDefault()
    event.stopPropagation()
  }

  // Wheel zoom
  function onWheel(event: WheelEvent) {
    if (!containerRef.value) return

    const delta = event.deltaY < 0 ? +zoomIntensity : -zoomIntensity
    const newScale = scale.value * (1 + delta)
    if (newScale < minScale || newScale > maxScale) return

    const rect = containerRef.value.getBoundingClientRect()
    const localMouse = {
      x: ((event.clientX - rect.left) * canvasSize.value.width) / rect.width,
      y: ((event.clientY - rect.top) * canvasSize.value.height) / rect.height,
    }

    // adjust origin so zoom centers on cursor
    position.value.x -= delta * (localMouse.x - position.value.x)
    position.value.y -= delta * (localMouse.y - position.value.y)
    scale.value = newScale

    event.preventDefault()
    event.stopPropagation()
  }

  return {
    // mount‐point refs
    containerRef,
    contentRef,

    // reactive state + style
    position,
    scale,
    style,
    isDragging,

    // event handlers
    onMouseDown,
    onWheel,
  }
}
