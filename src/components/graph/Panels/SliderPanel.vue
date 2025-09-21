<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <div class="number-input-wrapper">
      <input ref="inputRef" class="number-input" type="range" min="0" max="1" step="0.01" :value="props.graphNode.data.value"
        @keydown="handleKeyDown" @input="handleInput" @mousedown.stop @mousemove.stop @mouseup.stop="handleMouseUp"
        @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop />
    </div>

  </ResizablePanel>
</template>

<script setup lang="ts">
import type { NumberEmitter } from '@/graph/graph-nodes/math/number-emitter'
import ResizablePanel from './ResizablePanel.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGraphStore } from '@/stores/use-graph-store';

const graph = useGraphStore();

const props = defineProps<{
  graphNode: NumberEmitter
}>()

const inputRef = ref<HTMLTextAreaElement | null>(null);

let changed = false
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numValue = Number(target.value)
  if (isNaN(numValue)) return

  props.graphNode.onChange(numValue)
  changed = true
}

const handleMouseUp = () => {
  if (changed) {
    graph.commit()
  }

  changed = false
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
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
