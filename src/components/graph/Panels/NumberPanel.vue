<template>
  <ResizablePanel :graph-node-id="graphNode.modelId">
    <xNumberEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
import type { NumberEmitter } from '@/graph/graph-nodes/math/number-emitter'
import xNumberEmitter from '@/components/emitters/NumberEmitter.vue'
import ResizablePanel from './ResizablePanel.vue'

defineProps<{
  graphNode: NumberEmitter
}>()
</script>
