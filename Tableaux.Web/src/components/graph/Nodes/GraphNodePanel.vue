<template>
  <div>
  {{ graphNode.path.at(-1) }}
  </div>
</template>

<script setup lang="ts">
import type { GraphNode } from '@/models/graph/core/graph-node';
import { defineProps } from 'vue';

defineProps({
  graphNode: {
    type: Object as () => GraphNode,
    required: true,
  }
})

</script>

