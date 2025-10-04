<template>
  <ToggleEmitter :graph-node="graphNode" />
</template>

<script setup lang="ts">
  import type { Toggle } from '@/graph/graph-nodes/generic/toggle';
  import ToggleEmitter from '@/components/emitters/ToggleEmitter.vue';

  defineProps<{
    graphNode: Toggle;
  }>();
</script>
