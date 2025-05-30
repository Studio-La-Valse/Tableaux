<template>
  <div id="split-horizontal">
    <MidiControls class="controls" />
    <div id="split-vertical">
      <DesignCanvasPainter class="canvas"/>

      <GraphCanvas class="canvas"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import MidiControls from "@/components/MidiController.vue";
import GraphCanvas from "@/components/graph/GraphCanvas.vue";
import Split from "split.js";
import { onMounted } from "vue";
import DesignCanvasPainter from "@/components/DesignCanvasPainter.vue";

onMounted(() => {
  // Split MidiControls and canvas-container horizontally
  Split([".controls", "#split-vertical"], {
    direction: "horizontal",
    sizes: [20, 75],
    minSize: [150, 300], // MidiControls min-width, Canvas area min-width
    gutterSize: 6,
  });

  // Split canvases vertically
  Split([".canvas:first-child", ".canvas:last-child"], {
    direction: "vertical",
    sizes: [50, 50],
    gutterSize: 6,
    minSize: 100, // Minimum height for each canvas
  });
});
</script>


<style lang="css" scoped>
#split-horizontal {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.controls {
  flex-grow: 1; /* Allows resizing */
  min-width: 150px; /* Prevents shrinking too much */
  padding: 1rem;
  background: #2c3e50;
  color: white;
}

#split-vertical {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
}

.canvas {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7193b5;
}
</style>
