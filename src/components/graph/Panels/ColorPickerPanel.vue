<template>
  <ResizablePanel :graph-node-id="graphNode.modelId">
    <ColorEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
import type { ColorPicker } from '@/graph/graph-nodes/geometry/color/color-picker'
import ColorEmitter from '@/components/emitters/ColorEmitter.vue'
import ResizablePanel from './ResizablePanel.vue'

defineProps<{
  graphNode: ColorPicker
}>()
</script>
