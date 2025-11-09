<template>
  <input
    ref="inputRef"
    class="number-input"
    type="number"
    :value="props.graphNode.data.value"
    @keydown="handleKeyDown"
    @input="handleInput"
    @mousedown.stop
    @mousemove.stop
    @mouseup.stop="handleMouseUp"
    @wheel.stop
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
  >
</template>

<script setup lang="ts">
import type { Emitter } from '@/graph/core/emitter'
import type { JsonValue } from '@/graph/core/models/json-value'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { useGraphStore } from '@/stores/use-graph-store'

const props = defineProps<{
  graphNode: Emitter<JsonValue>
}>()

const graph = useGraphStore()

const inputRef = useTemplateRef<HTMLTextAreaElement>('inputRef')

let changed = false
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const numValue = Number(target.value)
  if (Number.isNaN(numValue))
    return

  props.graphNode.onChange(numValue)
  changed = true
}

function handleMouseUp() {
  if (changed) {
    graph.commit()
  }

  changed = false
}

function handleClickOutside(event: MouseEvent) {
  if (inputRef.value && !inputRef.value.contains(event.target as Node)) {
    inputRef.value.blur()
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    const textarea = event.target as HTMLTextAreaElement
    textarea.blur()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

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
  padding-left: 5px;
  min-width: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  resize: none;
}

.number-input:focus {
  outline: none;
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
