<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <RangeEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
  import type { NumberEmitter } from '@/graph/graph-nodes/math/number-emitter';
  import ResizablePanel from './ResizablePanel.vue';
  import RangeEmitter from '@/components/emitters/RangeEmitter.vue';

  defineProps<{
    graphNode: NumberEmitter;
  }>();
</script>
