<template>
  <GraphEdgesRenderer />
  <GraphNodesRenderer />
</template>


<script setup lang="ts">
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store';
import { useGraph } from '@/stores/graph-store';
import GraphEdgesRenderer from './GraphEdgesRenderer.vue';
import GraphNodesRenderer from './GraphNodesRenderer.vue';

const { clear } = useGraph();
const { registerDefault } = useGraphNodeActivatorCollection();

registerDefault();

clear();

</script>
