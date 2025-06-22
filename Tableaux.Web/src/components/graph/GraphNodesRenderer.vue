<template>
  <div v-for="graphNode in nodes" :key="graphNode.id">
    <GraphNodeRenderer :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { useGraph } from '@/stores/graph-store';
import GraphNodeRenderer from './GraphNodeRenderer.vue';
import { useSelectionInteraction } from '@/composables/useSelectionInteraction';

// Activate the global selection listeners.
useSelectionInteraction();

const { nodes } = useGraph();

</script>
