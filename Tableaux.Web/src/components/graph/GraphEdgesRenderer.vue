<!-- src/components/GraphEdgesRenderer.vue -->
<template>
  <div class="edges-container">
    <!-- Permanent edges -->
    <GraphEdgeRenderer
      v-for="edge in computedEdges"
      :key="edge.createKey()"
      :edge="edge"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GraphEdgeRenderer from './GraphEdgeRenderer.vue';
import { useGraph } from '@/stores/graph-store';

// Get your permanent edges from the graph store.
const { edges } = useGraph();
const computedEdges = computed(() => edges());


</script>

<style scoped>
.edges-container {
  /* Ensure this container is rendered as a child of your .canvas-content element. */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* so that edges do not block pointer events */
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
