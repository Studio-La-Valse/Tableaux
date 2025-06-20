<template>
  <!-- Render an SVG overlay that draws a line between node positions -->
  <svg :style="svgStyle" class="edge-svg">
    <line
      :x1="start.x"
      :y1="start.y"
      :x2="end.x"
      :y2="end.y"
      stroke="white"
      stroke-width="2"
    />
  </svg>
</template>

<script setup lang="ts">
import { type  StyleValue , computed, inject } from 'vue';
import type { GraphEdge } from '@/models/graph/core/graph-edge';
import type { GraphNode } from '@/models/graph/core/graph-node';

const props = defineProps<{
  edge: GraphEdge;
}>();

// Inject computedNodes as a reactive reference.
// It is expected to be a Ref wrapping an array of GraphNode.
const computedNodesRef = inject('computedNodes') as { value: GraphNode[] } | null;

if (!computedNodesRef) {
  console.error("computedNodes was not provided");
}

// Now, whenever you need to access the array, use computedNodesRef.value.
const leftNode = computed(() =>
  computedNodesRef?.value.find(
    (node) => node.id === props.edge.leftGraphNodeId
  )
);

const rightNode = computed(() =>
  computedNodesRef?.value.find(
    (node) => node.id === props.edge.rightGraphNodeId
  )
);

// Define some constants based on the assumed node layout.
const leftNodeWidth = computed(() => leftNode.value?.width ?? 150)

const outputPortYOffset = 20; // Vertical offset per output port index.
const inputPortYOffset = 20;  // Vertical offset per input port index.

// Compute the starting point from the left node.
const start = computed(() => {
  if (!leftNode.value) return { x: 0, y: 0 };
  return {
    // Adjust x using the nodeWidth to position the connection at the right edge.
    x: leftNode.value.x + leftNodeWidth.value,
    // Adjust y based on the output index offset.
    y: leftNode.value.y + outputPortYOffset * props.edge.outputIndex,
  };
});

// Compute the endpoint for the right node.
const end = computed(() => {
  if (!rightNode.value) return { x: 0, y: 0 };
  return {
    // The connection enters at the left edge of the right node.
    x: rightNode.value.x,
    // Adjust y based on the input index offset.
    y: rightNode.value.y + inputPortYOffset * props.edge.inputIndex,
  };
});

// Provide styling for the SVG so that it spans the entire graph container.
const svgStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '100%',
  height: '100%',
  overflow: 'visible',
  pointerEvents: 'none' // So that edge interactions don’t interfere with node interactions.
}));
</script>

<style scoped>
.edge-svg {
  color: inherit;
}
</style>
