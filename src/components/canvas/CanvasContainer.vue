<template>
  <div
    ref="wrapper"
    class="canvas-container"
  >
    <div
      :style="stripeStyle"
      class="stripe"
    >
      <div :style="canvasStyle">
        <CanvasRenderer
          :width="canvasProps.dimensions.x"
          :height="canvasProps.dimensions.y"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'
import CanvasRenderer from './CanvasRenderer.vue'

type ZoomMode = 'fit' | '50' | '75' | '100' | '150' | '200'

const props = defineProps<{
  zoomMode: ZoomMode
}>()

const canvasProps = useDesignCanvasStore()

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const parentW = ref(0)
const parentH = ref(0)
let ro: ResizeObserver

onMounted(() => {
  ro = new ResizeObserver(([e]) => {
    requestAnimationFrame(() => {
      parentW.value = e.contentRect.width
      parentH.value = e.contentRect.height
    })
  })
  if (wrapper.value)
    ro.observe(wrapper.value)
})

onBeforeUnmount(() => ro.disconnect())

// compute scale
const scale = computed(() => {
  if (props.zoomMode === 'fit') {
    return Math.min(
      parentW.value / canvasProps.dimensions.x,
      parentH.value / canvasProps.dimensions.y,
    )
  }
  // numeric zoom factor
  return Number.parseFloat(props.zoomMode) / 100
})

// displayed size
const scaledW = computed(() => canvasProps.dimensions.x * scale.value)
const scaledH = computed(() => canvasProps.dimensions.y * scale.value)

// centering margins (≥0)
const marginX = computed(() => Math.max((parentW.value - scaledW.value) / 2, 0))
const marginY = computed(() => Math.max((parentH.value - scaledH.value) / 2, 0))

// stripe behind the canvas
const stripeStyle = computed<StyleValue>(() => ({
  width: '100%',
  height: `${scaledH.value}px`,
  marginTop: `${marginY.value}px`,
}))

// canvas style
const canvasStyle = computed<StyleValue>(() => ({
  width: `${scaledW.value}px`,
  height: `${scaledH.value}px`,
  marginLeft: `${marginX.value}px`,
}))
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.stripe {
  background-color: var(--color-background-soft);
}
</style>
