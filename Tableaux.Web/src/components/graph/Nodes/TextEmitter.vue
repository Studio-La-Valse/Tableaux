<template>
  <ResizablePanel :graph-node-id="graphNode.id" :initial-width="150" :initial-height="80">
    <div class="text-input-wrapper">
      <textarea class="text-input" :value="graphNode.value" @input="handleInput" @mousedown.stop @mousemove.stop
        @mouseup.stop @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop></textarea>
    </div>

  </ResizablePanel>

</template>

<script setup lang="ts">
import type { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter';
import ResizablePanel from './ResizablePanel.vue';

const props = defineProps<{
  graphNode: TextEmitter
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  props.graphNode.onChange(target.value);
}

</script>

<style scoped>
.text-input-wrapper {
  padding: 8px;
  height: 100%;
}

.text-input {
  width: 100%;
  height: 100%;
  resize: none;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  box-sizing: border-box;
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
