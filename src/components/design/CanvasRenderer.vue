<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { CanvasRenderingContextPainter } from '@/models/bitmap-painters/canvas-rendering-context-painter';
import { useCanvasElementStore } from '@/stores/use-canvas-element-store';
import { useCanvasPropsStore } from '@/stores/use-canvas-props-store';
import { nextTick, onMounted, ref, watch } from 'vue';

const elementStore = useCanvasElementStore();

const props = useCanvasPropsStore();

const canvas = ref<HTMLCanvasElement | null>(null)

function redraw() {
  if (!canvas.value) return
  canvas.value.width = props.dimensions.x
  canvas.value.height = props.dimensions.y

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return;

  const painter = new CanvasRenderingContextPainter(ctx);
  painter.Init(props.dimensions.x, props.dimensions.y);

  elementStore.elements.forEach(el => {
    painter.DrawElement(el)
  })

  painter.Finish();
}

onMounted(redraw)
watch(() => props.dimensions, async () => {
  await nextTick()
  redraw()
})


watch(() => elementStore.elements, redraw);
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
