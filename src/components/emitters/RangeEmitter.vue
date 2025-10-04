<template>
  <input ref="inputRef" class="number-input" type="range" min="0" max="1" step="0.01"
    :value="props.graphNode.data.value" @keydown="handleKeyDown" @input="handleInput" @mousedown.stop @mousemove.stop
    @mouseup.stop="handleMouseUp" @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGraphStore } from '@/stores/use-graph-store';
import type { Emitter } from '@/graph/core/emitter';
import type { JsonValue } from '@/graph/core/models/json-value';

const graph = useGraphStore();

const props = defineProps<{
  graphNode: Emitter<JsonValue>
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
.number-input {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  padding: 0;
  min-width: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  resize: none;
}
</style>
