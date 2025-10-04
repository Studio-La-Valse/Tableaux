<template>
  <div>x</div>
</template>

<script setup lang="ts">
  import type { GraphNode } from '@/graph/core/graph-node';

  defineProps({
    graphNode: {
      type: Object as () => GraphNode,
      required: true,
    },
  });
</script>
