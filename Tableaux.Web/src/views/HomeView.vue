<template>
  <div id="split-horizontal">
    <GraphCanvas class="graph" />

    <CanvasComponent class="design" :elements="[]" />
  </div>
</template>

<script setup lang="ts">
import Split from "split.js";
import { onMounted } from "vue";
import GraphCanvas from "@/components/graph/GraphComponent.vue";
import CanvasComponent from "@/components/design/CanvasComponent.vue";


onMounted(() => {
  Split([".graph", ".design"], {
    direction: "horizontal",
    sizes: [50, 50],
    minSize: [150, 150],
    gutterSize: 2
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
