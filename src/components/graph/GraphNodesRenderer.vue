<template>
  <div v-for="graphNode in nodes" :key="`${graphNode.innerNode.id}-${graphNode.version}`">
    <GraphNodeRenderer :graphNode="graphNode" @updatePosition="onUpdatePosition" />
  </div>
</template>

<script setup lang="ts">
import { useGraphStore } from '@/stores/use-graph-store';
import GraphNodeRenderer from './GraphNodeRenderer.vue';
import { useCopyPaste } from '@/composables/use-copy-paste';
import { computed } from 'vue';
import type { XY } from '@/geometry/xy';
import type { GraphNodeWrapper } from '@/graph/core/graph-node-wrapper';

const graph = useGraphStore();
const nodes = computed(() => graph.nodes)

useCopyPaste();

const onUpdatePosition = (graphNode: GraphNodeWrapper, pos: XY) => {
  graphNode.xy = { x: pos.y, y: pos.y }
};
</script>
