<template>
  <canvas ref="canvasRef" class="canvas"></canvas>
</template>

<script setup lang="ts">
  import { useDesignCanvasStore } from '@/stores/use-design-canvas-store';
  import { storeToRefs } from 'pinia';
  import { onMounted } from 'vue';

  const canvasStore = useDesignCanvasStore();
  const { canvasRef } = storeToRefs(canvasStore);
  const { attachCanvas } = canvasStore;

  onMounted(() => {
    if (canvasRef.value) attachCanvas(canvasRef.value);
  });
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
