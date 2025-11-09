<template>
  <ResizablePanel :graph-node-id="graphNode.modelId">
    <xNumberEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
  import type { NumberEmitter } from '@/graph/graph-nodes/math/number-emitter';
  import ResizablePanel from './ResizablePanel.vue';
  import xNumberEmitter from '@/components/emitters/NumberEmitter.vue';

  defineProps<{
    graphNode: NumberEmitter;
  }>();
</script>
