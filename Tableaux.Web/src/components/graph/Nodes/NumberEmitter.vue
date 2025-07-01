<template>
  <input class="number-input" type="number" :value="graphNode.value" @input="handleInput" @mousedown.stop
    @mousemove.stop @mouseup.stop @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop />
</template>

<script setup lang="ts">
import type { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter';

const props = defineProps({
  graphNode: {
    type: Object as () => NumberEmitter,
    required: true,
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  props.graphNode.onChange(Number(target.value));
}
</script>

<style>
.number-input {
  width: 100%;
}
</style>
