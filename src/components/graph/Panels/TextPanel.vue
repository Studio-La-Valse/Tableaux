<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <xTextEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
  import ResizablePanel from './ResizablePanel.vue';
  import xTextEmitter from '@/components/emitters/TextEmitter.vue';
  import type { TextEmitter } from '@/graph/graph-nodes/text/text-emitter';

  defineProps<{
    graphNode: TextEmitter;
  }>();
</script>
