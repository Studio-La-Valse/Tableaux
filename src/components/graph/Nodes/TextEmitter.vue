<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <div class="text-input-wrapper">
      <textarea ref="textInputRef" class="text-input" :value="(graphNode.data.value as string)" @input="handleInput"
        @keydown.stop="handleKeyDown" @mousedown.stop @mousemove.stop @mouseup.stop @wheel.stop @touchstart.stop
        @touchmove.stop @touchend.stop></textarea>
    </div>

  </ResizablePanel>

</template>

<script setup lang="ts">
import type { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter';
import ResizablePanel from './ResizablePanel.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGraphStore } from '@/stores/use-graph-store';

const graph = useGraphStore()

const props = defineProps<{
  graphNode: TextEmitter
}>()

const textInputRef = ref<HTMLTextAreaElement | null>(null);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = target.value
  props.graphNode.onChange(value)
  graph.commit()
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    textInputRef.value &&
    !textInputRef.value.contains(event.target as Node)
  ) {
    textInputRef.value.blur();
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.blur();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
