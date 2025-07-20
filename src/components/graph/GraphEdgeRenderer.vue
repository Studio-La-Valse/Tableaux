<template>
  <GraphEdgePathRenderer :x1="start.x" :y1="start.y" :x2="end.x" :y2="end.y"
    :stroke="isSelected ? 'var(--color-accent)' : 'var(--color-text)'" :stroke-width="isSelected ? 3 : 1" />
  <GraphEdgePathRenderer :x1="start.x" :y1="start.y" :x2="end.x" :y2="end.y" stroke="var(--color-text)"
    :stroke-opacity="0" :stroke-width="10" :callback="handleClick" pointer-events="all" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEdgeSelection } from '@/composables/use-edge-selection';
import type { GraphEdge } from '@/models/graph/core/graph-edge';
import GraphEdgePathRenderer from './GraphEdgePathRenderer.vue';
import { useEdgeSelectionStore } from '@/stores/use-edge-selection-store';

const props = defineProps<{ edge: GraphEdge }>();

const selectionStore = useEdgeSelectionStore();

const { handleClick } = useEdgeSelection(props.edge.id);

const isSelected = computed(() => selectionStore.isSelected(props.edge.id));

const leftNode = computed(() => props.edge.leftGraphNode);
const rightNode = computed(() => props.edge.rightGraphNode);
const leftNodeWidth = computed(() => leftNode.value.width ?? 150);

const start = computed(() => {
  if (!leftNode.value) return { x: 0, y: 0 };
  return {
    x: leftNode.value.xy.x + leftNodeWidth.value,
    y: leftNode.value.calculateHandleCoordinate(
      props.edge.outputIndex,
      leftNode.value.innerNode.outputs.length
    ),
  };
});

const end = computed(() => {
  if (!rightNode.value) return { x: 0, y: 0 };
  return {
    x: rightNode.value.xy.x,
    y: rightNode.value.calculateHandleCoordinate(
      props.edge.inputIndex,
      rightNode.value.innerNode.inputs.length
    ),
  };
});
</script>
