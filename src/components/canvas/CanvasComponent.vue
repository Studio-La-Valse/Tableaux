<template>
  <div
    class="page"
    :style="style"
  >
    <CanvasControls
      v-model:zoom-mode="zoomMode"
      @full-screen="handleFullScreen"
    />

    <div
      ref="canvasContainer"
      class="canvas-container"
    >
      <DesignCanvas :zoom-mode="zoomMode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useCanvasTransform } from '@/composables/use-canvas-transform'
import { useNodeSelectionAndDrag } from '@/composables/use-node-selection-and-drag'
import DesignCanvas from './CanvasContainer.vue'
import CanvasControls from './CanvasControls.vue'

const groupDrag = useNodeSelectionAndDrag()
const canvasPan = useCanvasTransform()

const style = computed<StyleValue>(() => ({
  pointerEvents: groupDrag.dragging.value || canvasPan.isDragging.value ? 'none' : 'all',
}))

type ZoomMode = 'fit' | '50' | '75' | '100' | '150' | '200'

const zoomMode = ref<ZoomMode>('fit')

// keep track of what the zoom was before we forced Fit
let previousZoom: ZoomMode = zoomMode.value

// DOM ref for the element we fullscreen
const canvasContainer = useTemplateRef<HTMLElement>('canvasContainer')

function handleFullScreen() {
  if (!canvasContainer.value)
    return

  // stash current zoom
  previousZoom = zoomMode.value

  // force Fit mode
  zoomMode.value = 'fit'

  // request fullscreen
  canvasContainer.value.requestFullscreen().catch(console.error)
}

// this runs on *every* fullscreen change
function onFullScreenChange() {
  // if we've *exited* fullscreen (element is null)
  if (!document.fullscreenElement) {
    zoomMode.value = previousZoom
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullScreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullScreenChange)
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.canvas-container {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
</style>
