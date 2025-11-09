<template>
  <ResizablePanel :graph-node-id="graphNode.modelId">
    <xTextEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
import type { TextEmitter } from '@/graph/graph-nodes/text/text-emitter'
import xTextEmitter from '@/components/emitters/TextEmitter.vue'
import ResizablePanel from './ResizablePanel.vue'

defineProps<{
  graphNode: TextEmitter
}>()
</script>
