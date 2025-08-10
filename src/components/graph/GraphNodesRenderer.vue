<template>
  <div v-for="graphNode in nodes" :key="`${graphNode.version}`">
    <GraphNodeRenderer :graphNode="graphNode"/>
  </div>
</template>

<script setup lang="ts">
import { useGraphStore } from '@/stores/use-graph-store';
import GraphNodeRenderer from './GraphNodeRenderer.vue';
import { useCopyPaste } from '@/composables/use-copy-paste';
import { computed } from 'vue';

const graph = useGraphStore();
const nodes = computed(() => graph.nodes)

useCopyPaste();
</script>
