<template>
  <div class="litegraph litegraph-editor" ref="containerRef">
    <div class="content">
      <div class="editor-area">
        <canvas id="mycanvas" class="graphcanvas lgraphcanvas" ref="graphContainer">

        </canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import { DrawableRectangleNode } from "./Nodes/Drawable/DrawableCircle.vue";

const graphContainer = ref(null);
const containerRef = ref<HTMLDivElement | null>(null);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  LiteGraph.registerNodeType("drawable/circle", DrawableRectangleNode)

  const graph = new LGraph();
  const canvas = new LGraphCanvas("#mycanvas", graph);

  const node = LiteGraph.createNode("drawable/circle")
  node.pos = [100, 100]
  graph.add(node)

  graph.start()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => canvas.resize());
    resizeObserver.observe(containerRef.value);
  }
});
</script>

<style>
.litegraph-editor {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  position: relative;
}

.litegraph-editor * {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.litegraph-editor .content {
  position: relative;
  width: 100%;
  height: calc(100% - 6px);
}

.litegraph-editor .editor-area {
  width: 100%;
  height: 100%;
}
</style>
