<template>
  <GraphEdgesRenderer />
  <GraphNodesRenderer />
</template>


<script setup lang="ts">
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store';
import { useGraph } from '@/stores/graph-store';
import { onMounted } from 'vue';
import GraphEdgesRenderer from './GraphEdgesRenderer.vue';
import GraphNodesRenderer from './GraphNodesRenderer.vue';

const { clear, addNode, tick } = useGraph();
const { registerDefault } = useGraphNodeActivatorCollection();

registerDefault();

clear();

addNode(["Emitters", "Text"], { x: 0, y: 0 }, crypto.randomUUID())
addNode(['Emitters', 'Number'], { x: 0, y: 100 }, crypto.randomUUID())
addNode(['Emitters', 'Number'], { x: 0, y: 200 }, crypto.randomUUID())
addNode(["Generic", "Merge"], { x: 200, y: 50 }, crypto.randomUUID())
addNode(["Math", "Add"], { x: 200, y: 200 }, crypto.randomUUID())
addNode(["Geometry", "XY"], { x: 200, y: 300 }, crypto.randomUUID())
addNode(["Generic", "Logger"], { x: 400, y: 100 }, crypto.randomUUID())
addNode(["Generic", "Repeat Until"], { x: 400, y: 250 }, crypto.randomUUID())
addNode(["Generic", "Repeat Shortest"], { x: 0, y: 300 }, crypto.randomUUID())

onMounted(() => {
  tick()
})
</script>
