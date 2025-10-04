<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
  import { useDesignCanvasStore } from '@/stores/use-design-canvas-store';
  import { onMounted, ref } from 'vue';

  const { setCanvas } = useDesignCanvasStore();

  const canvas = ref<HTMLCanvasElement | undefined>();

  onMounted(() => {
    if (!canvas.value) {
      throw new Error();
    }

    setCanvas(canvas.value);
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
