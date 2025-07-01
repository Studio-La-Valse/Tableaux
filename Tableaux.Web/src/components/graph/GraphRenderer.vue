<template>
  <GraphEdgesRenderer />
  <GraphNodesRenderer />
</template>


<script setup lang="ts">
import { useGraph } from '@/stores/graph-store';
import GraphEdgesRenderer from './GraphEdgesRenderer.vue';
import GraphNodesRenderer from './GraphNodesRenderer.vue';

const { clear } = useGraph();

clear();

</script>
