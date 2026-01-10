<template>
  <canvas
    ref="canvasRef"
    class="canvas"
  />
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const { attachCanvas } = useDesignCanvasStore()

onMounted(() => {
  if (canvasRef.value)
    attachCanvas(canvasRef.value)
})
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
