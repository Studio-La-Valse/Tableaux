<template>
  <div id="split-horizontal">
    <GraphCanvas class="graph">
      <GraphRenderer/>
    </GraphCanvas>

    <DesignCanvasPainter class="design" :elements="[]" />
  </div>
</template>

<script setup lang="ts">
import Split from "split.js";
import { onMounted } from "vue";
import GraphCanvas from "@/components/graph/GraphCanvasV2.vue";
import DesignCanvasPainter from "@/components/design/DesignCanvasPainter.vue";
import GraphRenderer from "@/components/graph/GraphRenderer.vue";


onMounted(() => {
  Split([".graph", ".design"], {
    direction: "horizontal",
    sizes: [50, 50],
    minSize: [150, 150],
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
</style>
