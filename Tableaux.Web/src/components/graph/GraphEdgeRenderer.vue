<template>
  <!-- The SVG container is now only as big as the edge's bounding box -->
  <svg :style="svgStyle" class="edge-svg">
    <!-- Visible line: changes color when selected -->
    <line
      :x1="adjustedStart.x"
      :y1="adjustedStart.y"
      :x2="adjustedEnd.x"
      :y2="adjustedEnd.y"
      :stroke="isSelected ? 'blue' : 'white'"
      stroke-width="2"
    />
    <!-- Interactive overlay: invisible (but painted) so that only hits on the line register -->
    <line
      ref="edgeOverlay"
      :x1="adjustedStart.x"
      :y1="adjustedStart.y"
      :x2="adjustedEnd.x"
      :y2="adjustedEnd.y"
      stroke="black"
      stroke-opacity="0"
      stroke-width="10"
      style="cursor: pointer; pointer-events: stroke;"
      @click="toggleSelection"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { StyleValue } from 'vue';
import type { GraphEdge } from '@/models/graph/core/graph-edge';
import { useGraph } from '@/stores/graph-store';

const { removeEdge, getNode } = useGraph();

const props = defineProps<{
  edge: GraphEdge;
}>();

// Deletion callback: empty placeholder function.
const deleteSelectedEdge = () => {
  removeEdge(props.edge.rightGraphNodeId, props.edge.inputIndex)
};

const leftNode = computed(() =>
  getNode(props.edge.leftGraphNodeId)
);

const rightNode = computed(() =>
 getNode(props.edge.rightGraphNodeId)
);

const leftNodeWidth = computed(() => leftNode.value?.width ?? 150);

// Compute the absolute starting point (from left node)
const start = computed(() => {
  if (!leftNode.value) return { x: 0, y: 0 };
  const x = leftNode.value.x + leftNodeWidth.value;
  const y = leftNode.value.calculateHandleCoordinate(
    props.edge.outputIndex,
    leftNode.value.numberOfOutputs
  );
  return { x, y };
});

// Compute the absolute ending point (at right node)
const end = computed(() => {
  if (!rightNode.value) return { x: 0, y: 0 };
  const x = rightNode.value.x;
  const y = rightNode.value.calculateHandleCoordinate(
    props.edge.inputIndex,
    rightNode.value.numberOfInputs
  );
  return { x, y };
});

// Use a fixed padding so that it’s easier to click the edge.
const padding = 10;

// Compute the bounding box of the edge:
const xMin = computed(() => Math.min(start.value.x, end.value.x));
const yMin = computed(() => Math.min(start.value.y, end.value.y));
const boxWidth = computed(() => Math.abs(start.value.x - end.value.x));
const boxHeight = computed(() => Math.abs(start.value.y - end.value.y));

// Position the SVG container only over the edge’s area (with padding)
const svgStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  left: `${xMin.value - padding}px`,
  top: `${yMin.value - padding}px`,
  width: `${boxWidth.value + padding * 2}px`,
  height: `${boxHeight.value + padding * 2}px`,
  overflow: 'visible'
}));

// Adjust the coordinates relative to the SVG container.
const adjustedStart = computed(() => ({
  x: start.value.x - (xMin.value - padding),
  y: start.value.y - (yMin.value - padding)
}));

const adjustedEnd = computed(() => ({
  x: end.value.x - (xMin.value - padding),
  y: end.value.y - (yMin.value - padding)
}));

// Track selection state.
const isSelected = ref(false);

// Reference to the interactive overlay element.
const edgeOverlay = ref<SVGLineElement | null>(null);

// Toggle edge selection on click. Notice we do NOT stop propagation.
const toggleSelection = () => {
  isSelected.value = !isSelected.value;
};

// When clicking anywhere in the document outside of the edge overlay,
// unselect the edge.
const handleDocumentClick = (event: MouseEvent) => {
  if (edgeOverlay.value && edgeOverlay.value.contains(event.target as Node)) {
    return;
  }
  isSelected.value = false;
};

// Listen for keydown events to trigger deletion when the edge is selected.
const handleKeydown = (event: KeyboardEvent) => {
  if (isSelected.value && (event.key === 'Delete' || event.key === 'Backspace')) {
    deleteSelectedEdge();
    isSelected.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.edge-svg {
  color: inherit;
  /* Optionally set a z-index so that nodes (if rendered above) are not blocked */
  z-index: 1;
}
</style>
