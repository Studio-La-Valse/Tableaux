<template>
  <textarea class="text-input" type="text" :value="graphNode.value" @input="handleInput" @mousedown.stop @mousemove.stop
    @mouseup.stop @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop></textarea>
</template>

<script setup lang="ts">
import type { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter';

const props = defineProps(
  {
    graphNode: {
      type: Object as () => TextEmitter,
      required: true,
    }
  }
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  props.graphNode.onChange(target.value);
}

</script>

<style lang="css" scoped>
.text-input {
  flex: 1;
  width: 100%;
  height: 100%;
  margin-right: 10px;
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  resize: none;
  border-radius: 5px;
}
</style>
