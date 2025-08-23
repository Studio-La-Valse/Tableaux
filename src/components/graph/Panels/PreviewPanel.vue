<template>
  <ResizablePanel :graph-node-id="props.graphNode.id">
    <div ref="wrapper" class="canvas-container">
      <div :style="stripeStyle" class="stripe">
        <div :style="canvasStyle">
          <canvas ref="previewCanvas" :width="canvasProps.dimensions.x" :height="canvasProps.dimensions.y"
            class="preview-canvas">
          </canvas>
        </div>
      </div>

    </div>
  </ResizablePanel>
</template>

<script setup lang="ts">
import ResizablePanel from "./ResizablePanel.vue"
import type { Preview } from '@/graph/graph-nodes/geometry/preview';
import { useDesignCanvasStore } from "@/stores/use-design-canvas-store";
import { computed, onBeforeUnmount, onMounted, ref, type StyleValue } from "vue";

const canvasProps = useDesignCanvasStore()

// `defineProps` gives you a typed `graphNode` in your template
const props = defineProps<{
  graphNode: Preview
}>()

const previewCanvas = ref<HTMLCanvasElement | null>(null)

const wrapper = ref<HTMLElement | null>(null)
const parentW = ref(0)
const parentH = ref(0)
let ro: ResizeObserver

// compute scale
const scale = computed(() => {
  return Math.min(parentW.value / canvasProps.dimensions.x,
    parentH.value / canvasProps.dimensions.y)
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

onMounted(() => {
  props.graphNode.setCanvas(previewCanvas.value)

  ro = new ResizeObserver(([e]) => {
    parentW.value = e.contentRect.width
    parentH.value = e.contentRect.height
  })
  if (wrapper.value) {
    ro.observe(wrapper.value)
  }
})
onBeforeUnmount(() => ro.disconnect())

</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 5px;
  overflow: hidden;
}

.preview-canvas {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  display: block;
  box-sizing: border-box;
  background-color: black;
}
</style>
