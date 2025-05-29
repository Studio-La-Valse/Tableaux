<template>
  <div class="home-view">
    <MidiControls class="controls" />
    <Canvas class="canvas" />
  </div>
</template>

<script setup lang="ts">
import MidiControls from "@/components/MidiController.vue";
import Canvas from "@/components/Canvas.vue";
</script>

<style scoped>
.home-view {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.controls {
  flex: 0 0 300px; /* Fixed width */
  padding: 1rem;
  background: #2c3e50;
  color: white;
}

.canvas {
  flex-grow: 1; /* Take remaining space */
  height: 100vh; /* Full height */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}
</style>
