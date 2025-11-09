<template>
  <textarea
    ref="textInputRef"
    class="text-input"
    :value="(graphNode.data.value as string)"
    @input="handleInput"
    @keydown.stop="handleKeyDown"
    @mousedown.stop
    @mousemove.stop
    @mouseup.stop
    @wheel.stop
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
  />
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

const textInputRef = useTemplateRef<HTMLTextAreaElement>('textInputRef')

let changed = false
function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const value = target.value
  props.graphNode.onChange(value)
  changed = true
}

function handleClickOutside(event: MouseEvent) {
  if (textInputRef.value && !textInputRef.value.contains(event.target as Node)) {
    textInputRef.value.blur()
    if (changed) {
      graph.commit()
    }

    changed = false
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
.text-input {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  padding: 0;
  padding-top: 5px;
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

.text-input:focus {
  outline: none;
  border: 2px solid var(--color-accent);
}
</style>
