<template>
  <div id="split-horizontal">
    <GraphCanvas class="graph" />

    <DesignCanvasPainter class="design" :elements="[]"/>
  </div>
</template>

<script setup lang="ts">
import Split from "split.js";
import { onMounted } from "vue";
import GraphCanvas from "@/components/graph/GraphCanvas.vue";
import DesignCanvasPainter from "@/components/design/DesignCanvasPainter.vue";

onMounted(() => {
  // Split MidiControls and canvas-container horizontally
  Split([".graph", ".design"], {
    direction: "horizontal",
    sizes: [50, 50],
    minSize: [150, 150], // MidiControls min-width, Canvas area min-width
    gutterSize: 6,
  });

});
</script>


<style lang="css" scoped>
#split-horizontal {
  display: flex;
  width: 100vw;
  height: 100vh;
}

#split-vertical {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
}
</style>
