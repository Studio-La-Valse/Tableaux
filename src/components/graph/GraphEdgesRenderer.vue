<!-- src/components/GraphEdgesRenderer.vue -->
<template>
  <div class="edges-container">
    <!-- Permanent edges -->
    <GraphEdgeRenderer v-for="edge in graph.edges" :key="edge.id" :edge="edge" />

    <!-- Temporary (drag) edge -->
    <GraphEdgePathRenderer v-if="tempEdge" class="temp-edge-svg" :x1="startX" :y1="startY" :x2="tempEdge.currentX"
      :y2="tempEdge.currentY" :stroke="'grey'" :stroke-width="1" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GraphEdgeRenderer from './GraphEdgeRenderer.vue';
import { useGraph } from '@/stores/graph-store';
import { useEdgeDrag } from '@/composables/use-edge-drag';
import GraphEdgePathRenderer from './GraphEdgePathRenderer.vue';

// Get your permanent edges from the graph store.
const graph = useGraph();

// Get the reactive temporary edge state
const edgeDrag = useEdgeDrag();
const tempEdge = edgeDrag.tempEdge;

// Compute the starting point from the source node
const startX = computed(() => {
  if (tempEdge.value) {
    const node = graph.getNode(tempEdge.value.fromNodeId);
    if (node) {
      // Assume the output handle is at the right edge with an extra offset.
      return node.x + (node.width ?? 150);
    }
  }
  return 0;
});

const startY = computed(() => {
  if (tempEdge.value) {
    const node = graph.getNode(tempEdge.value.fromNodeId);
    if (node) {
      return node.calculateHandleCoordinate(tempEdge.value.fromOutputIndex, node.innerNode.outputs.length);
    }
  }
  return 0;
});

</script>

<style scoped>
.edges-container {
  /* Ensure this container is rendered as a child of your .canvas-content element. */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* so that edges do not block pointer events */
}

.temp-edge-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
</style>
