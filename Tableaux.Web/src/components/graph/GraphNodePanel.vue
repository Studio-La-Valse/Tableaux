<template>
  <div>
    {{ graphNode.path[graphNode.path.length - 1] }}
  </div>
</template>

<script setup lang="ts">
import type { GraphNode } from '@/models/graph/core/graph-node';

defineProps({
  graphNode: {
    type: Object as () => GraphNode,
    required: true,
  }
})

</script>
