<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { BitmapPainter } from '@/bitmap-painters/bitmap-painter';
import { useDesignCanvasStore } from '@/stores/use-design-canvas-store';
import { nextTick, onMounted, ref, watch } from 'vue';

const canvasStore = useDesignCanvasStore();

const canvas = ref<HTMLCanvasElement | undefined>()

function redraw() {
  if (!canvas.value) return
  canvas.value.width = canvasStore.dimensions.x
  canvas.value.height = canvasStore.dimensions.y

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return;

  const painter = new BitmapPainter(ctx);
  painter.Init(canvasStore.dimensions.x, canvasStore.dimensions.y);

  canvasStore.elements.forEach(el => {
    painter.DrawElement(el)
  })

  painter.Finish();
}

onMounted(() => {
  if (!canvas.value) {
    throw new Error()
  }

  canvasStore.setCanvas(canvas.value)

  redraw()
})

watch(() => canvasStore.dimensions, async () => {
  await nextTick()
  redraw()
})


watch(() => canvasStore.elements, redraw);
</script>

<style>
.canvas {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  display: block;
  box-sizing: border-box;
  background-color: black;
}
</style>
