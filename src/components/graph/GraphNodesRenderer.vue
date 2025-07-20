<template>
  <div v-for="graphNode in graph.nodes" :key="`${graphNode.innerNode.id}-${graphNode.version}`">
    <GraphNodeRenderer :graphNodeId="graphNode.innerNode.id" />
  </div>
</template>

<script setup lang="ts">
import { useGraph } from '@/stores/graph-store';
import GraphNodeRenderer from './GraphNodeRenderer.vue';
import { useCopyPaste } from '@/composables/use-copy-paste';

const graph = useGraph();

useCopyPaste();
</script>
