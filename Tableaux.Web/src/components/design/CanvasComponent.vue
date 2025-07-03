<template>
  <div class="page" :style="style">
    <CanvasControls v-model:zoomMode="zoomMode" @fullScreen="handleFullScreen" />

    <div ref="canvasContainer" class="canvas-container">
      <DesignCanvas :zoomMode="zoomMode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type StyleValue } from 'vue'
import CanvasControls from './CanvasControls.vue'
import DesignCanvas from './CanvasContainer.vue'
import { useGroupDraggable } from '@/composables/useGroupDraggable'
import { useCanvasTransform } from '@/composables/useCanvasTransform'

const groupDrag = useGroupDraggable()
const canvasPan = useCanvasTransform()

const style = computed<StyleValue>(() => ({
  pointerEvents: (groupDrag.dragging.value || canvasPan.isDragging.value) ? 'none' : 'all'
}))

type ZoomMode = 'fit' | '50' | '75' | '100' | '150' | '200'

const zoomMode = ref<ZoomMode>('fit')

// keep track of what the zoom was before we forced Fit
let previousZoom: ZoomMode = zoomMode.value;

// DOM ref for the element we fullscreen
const canvasContainer = ref<HTMLElement | null>(null)

function handleFullScreen() {
  if (!canvasContainer.value) return

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
  height: 100vh;
}

.canvas-container {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: auto;
}
</style>
