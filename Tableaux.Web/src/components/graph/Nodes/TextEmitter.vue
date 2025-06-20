<template>
  <input class="text-input" type="text" :value="graphNode.value" @input="handleInput" @mousedown.stop @mousemove.stop
    @mouseup.stop @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop />
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
  width: 100%;
}
</style>
