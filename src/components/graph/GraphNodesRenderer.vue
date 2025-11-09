<template>
  <div
    v-for="graphNode in nodes"
    :key="`${graphNode.instanceId}`"
  >
    <GraphNodeRenderer :graph-node="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCopyPaste } from '@/composables/use-copy-paste'
import { useGraphStore } from '@/stores/use-graph-store'
import GraphNodeRenderer from './GraphNodeRenderer.vue'

const graph = useGraphStore()
const nodes = computed(() => graph.nodes)

useCopyPaste()
</script>
