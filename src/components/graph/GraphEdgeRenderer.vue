<template>
  <GraphEdgePathRenderer :x1="start.x" :y1="start.y" :x2="end.x" :y2="end.y"
    :stroke="isSelected ? 'var(--color-accent)' : 'var(--color-text)'" :stroke-width="isSelected ? 3 : 1" />

  <!-- Interactive overlay: invisible (but painted) so that only hits on the line register, all pointer events registered -->
  <GraphEdgePathRenderer :x1="start.x" :y1="start.y" :x2="end.x" :y2="end.y" :stroke="'var(--color-text)'"
    :stroke-opacity="0" :stroke-width="10" :callback="toggleSelection" :pointer-events="'all'" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { GraphEdge } from '@/models/graph/core/graph-edge';
import { useGraph } from '@/stores/graph-store';
import GraphEdgePathRenderer from './GraphEdgePathRenderer.vue';

const { removeEdge } = useGraph();
const { getNode } = useGraph();

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
    leftNode.value.outputs.length
  );
  return { x, y };
});

// Compute the absolute ending point (at right node)
const end = computed(() => {
  if (!rightNode.value) return { x: 0, y: 0 };
  const x = rightNode.value.x;
  const y = rightNode.value.calculateHandleCoordinate(
    props.edge.inputIndex,
    rightNode.value.inputs.length
  );
  return { x, y };
});

// Track selection state.
const isSelected = ref(false);

// Toggle edge selection on click. Notice we do NOT stop propagation.
const toggleSelection = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  isSelected.value = !isSelected.value;
};

// When clicking anywhere in the document outside of the edge overlay,
// unselect the edge.
const handleDocumentClick = () => {
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
