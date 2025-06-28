<template>
  <div ref="wrapper" class="canvas-container">
    <div :style="stripeStyle" class="stripe">
      <canvas ref="canvas" :style="canvasStyle"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineProps,
  nextTick,
  type StyleValue
} from 'vue'

type ZoomMode = 'fit' | '50' | '75' | '100' | '150' | '200'

const props = defineProps<{
  width: number
  height: number
  zoomMode: ZoomMode
}>()

const wrapper = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const parentW = ref(0)
const parentH = ref(0)
let ro: ResizeObserver

onMounted(() => {
  ro = new ResizeObserver(([e]) => {
    parentW.value = e.contentRect.width
    parentH.value = e.contentRect.height
  })
  if (wrapper.value) {
    ro.observe(wrapper.value)
  }
})
onBeforeUnmount(() => ro.disconnect())

// compute scale
const scale = computed(() => {
  if (props.zoomMode === 'fit') {
    return Math.min(parentW.value / props.width,
      parentH.value / props.height)
  }
  // numeric zoom factor
  return parseFloat(props.zoomMode) / 100
})

// displayed size
const scaledW = computed(() => props.width * scale.value)
const scaledH = computed(() => props.height * scale.value)

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
  display: 'block',
  marginLeft: `${marginX.value}px`,
  boxSizing: 'border-box',
  backgroundColor: 'black'
}))

function redraw() {
  if (!canvas.value) return
  canvas.value.width = props.width
  canvas.value.height = props.height
  const ctx = canvas.value.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  ctx.clearRect(0, 0, props.width, props.height)
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.arc(props.width / 2, props.height / 2, 50, 0, Math.PI * 2)
  ctx.fill()
}

onMounted(redraw)
watch([() => props.width, () => props.height], async () => {
  await nextTick()
  redraw()
})
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.stripe {
  background-color: rgb(17, 17, 17);
}
</style>
