<template>
  <div v-for="graphNode in graph.nodes" :key="graphNode.id">
    <GraphNodeRenderer :graphNodeId="graphNode.id" />
  </div>
</template>

<script setup lang="ts">
import { useGraph } from '@/stores/graph-store';
import GraphNodeRenderer from './GraphNodeRenderer.vue';
import { useCopyPaste } from '@/composables/useCopyPaste';

const graph = useGraph();

useCopyPaste();
</script>
