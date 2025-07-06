<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <div class="number-input-wrapper">
      <input ref="inputRef" class="number-input" type="number" :value="props.graphNode.data.value"
        @keydown="handleKeyDown" @input="handleInput" @mousedown.stop @mousemove.stop @mouseup.stop @wheel.stop
        @touchstart.stop @touchmove.stop @touchend.stop />
    </div>

  </ResizablePanel>
</template>

<script setup lang="ts">
import type { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter'
import ResizablePanel from './ResizablePanel.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGraph } from '@/stores/graph-store';

const graph = useGraph();

const props = defineProps<{
  graphNode: NumberEmitter
}>()

const inputRef = ref<HTMLTextAreaElement | null>(null);

let debounceTimer: number | undefined
const debounceDelay = 2

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numValue = Number(target.value)
  if (isNaN(numValue)) return

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {

    props.graphNode.onChange(numValue)
    graph.commit()

  }, debounceDelay)
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    inputRef.value &&
    !inputRef.value.contains(event.target as Node)
  ) {
    inputRef.value.blur();
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
.number-input-wrapper {
  padding: 8px;
  height: 100%;
}

.number-input {
  width: 100%;
  height: 100%;
  resize: none;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
