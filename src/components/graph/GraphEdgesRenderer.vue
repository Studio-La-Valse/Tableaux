<!-- src/components/GraphEdgesRenderer.vue -->
<template>
  <div class="edges-container">
    <!-- Permanent edges -->
    <GraphEdgeRenderer v-for="edge in graph.edges" :key="edge.id" :edge="edge" />

    <!-- Temporary (drag) edge -->
    <GraphEdgePathRenderer v-if="tempEdge" class="temp-edge-svg" :x1="startX" :y1="startY" :x2="tempEdge.currentX"
      :y2="tempEdge.currentY" :stroke="'grey'" :stroke-width="1" />

    <!-- Temporary (reconnect) edges -->
    <div v-for="tempReconnect in tempEdges" :key="tempReconnect.toNodeId">
      <GraphEdgePathRenderer class="temp-edge-svg" :x1="tempReconnect.currentX" :y1="tempReconnect.currentY"
        :x2="endX(tempReconnect.toNodeId)" :y2="endY(tempReconnect.toNodeId, tempReconnect.toInputIndex)"
        :stroke="'grey'" :stroke-width="1" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GraphEdgeRenderer from './GraphEdgeRenderer.vue';
import { useGraphStore } from '@/stores/use-graph-store';
import { useEdgeDrag } from '@/composables/use-edge-drag';
import GraphEdgePathRenderer from './GraphEdgePathRenderer.vue';
import { useEdgeReconnect } from '@/composables/use-edge-reconnect';

// Get your permanent edges from the graph store.
const graph = useGraphStore();

// Get the reactive temporary edge state
const edgeDrag = useEdgeDrag();
const tempEdge = edgeDrag.tempEdge;

const edgeReconnect = useEdgeReconnect()
const tempEdges = edgeReconnect.tempEdges

// Compute the starting point from the source node
const startX = computed(() => {
  if (tempEdge.value) {
    const node = graph.getNode(tempEdge.value.fromNodeId);
    if (node) {
      // Assume the output handle is at the right edge with an extra offset.
      return node.xy.x + (node.width ?? 150);
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

const endX = (targetNodeId: string) => {
  return graph.getNode(targetNodeId).xy.x
}

const endY = (targetNodeId: string, targetInputIndex: number) => {
  const node = graph.getNode(targetNodeId)
  return node.calculateHandleCoordinate(targetInputIndex, node.innerNode.inputs.length)
}

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
