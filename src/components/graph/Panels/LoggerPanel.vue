<template>
  <ResizablePanel :graph-node-id="props.graphNode.id">
    <div class="text-input-wrapper">
      <textarea readonly class="text-input" :value="graphNode.values.map((t, i) => `${i}: ${t}` ).join('\n')" @mousedown.stop @mousemove.stop
        @mouseup.stop @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop></textarea>
    </div>
  </ResizablePanel>
</template>

<script setup lang="ts">
import type { Logger } from '@/graph/graph-nodes/generic/logger'
import ResizablePanel from "./ResizablePanel.vue"

// `defineProps` gives you a typed `graphNode` in your template
const props = defineProps<{
  graphNode: Logger
}>()
</script>


<style scoped>
.text-input-wrapper {
  padding: 8px;
  height: 100%;
}

.text-input {
  text-align: center;
  white-space: pre-wrap;
  width: 100%;
  height: 100%;
  resize: none;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  box-sizing: border-box;
  overflow-y: auto;
}

/* (Optional) Custom scrollbar styling for WebKit browsers */
.text-input::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  cursor: grab;
}

.text-input::-webkit-scrollbar-thumb {
  background-color: var(--color-text);
  border-radius: 4px;
}

.text-input::-webkit-scrollbar-thumb:active {
  cursor: grabbing;
}
</style>
