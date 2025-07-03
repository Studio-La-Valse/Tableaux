<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <div class="number-input-wrapper">
      <input class="number-input" type="number" :value="graphNode.value" @input="handleInput" @mousedown.stop
        @mousemove.stop @mouseup.stop @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop />
    </div>

  </ResizablePanel>
</template>

<script setup lang="ts">
import type { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter'
import ResizablePanel from './ResizablePanel.vue';

const props = defineProps<{
  graphNode: NumberEmitter
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  props.graphNode.onChange(Number(target.value))
}
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
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
