<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <ColorEmitter :graph-node="graphNode" />
  </ResizablePanel>
</template>

<script setup lang="ts">
  import type { ColorPicker } from '@/graph/graph-nodes/geometry/color/color-picker';
  import ResizablePanel from './ResizablePanel.vue';
  import ColorEmitter from '@/components/emitters/ColorEmitter.vue';

  defineProps<{
    graphNode: ColorPicker;
  }>();
</script>
