<template>
  <div v-for="graphNode in computedNodes" :key="graphNode.id">
    <GraphNodeRenderer :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGraph } from '@/stores/graph-store';
import GraphNodeRenderer from './GraphNodeRenderer.vue';

const { nodes } = useGraph();
const computedNodes = computed(nodes);

</script>
