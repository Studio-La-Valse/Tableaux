<template>
  <ResizablePanel :graph-node-id="graphNode.id">
    <div class="color-input-wrapper">
      <input ref="inputRef" class="color-input" type="color" :value="props.graphNode.data.value" @input="handleInput"
        @mousedown.stop @mousemove.stop @mouseup.stop="mouseUp" @wheel.stop @touchstart.stop @touchmove.stop @touchend.stop />
    </div>
  </ResizablePanel>
</template>

<script setup lang="ts">
import type { ColorEmitter } from '@/models/graph/graph-nodes/emitters/color-emitter'
import ResizablePanel from './ResizablePanel.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGraphStore } from '@/stores/use-graph-store';

const graph = useGraphStore();

const props = defineProps<{
  graphNode: ColorEmitter
}>()

const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const colorValue = target.value;
  props.graphNode.onChange(colorValue);
};

const mouseUp = () => {
  graph.commit();
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    inputRef.value &&
    !inputRef.value.contains(event.target as Node)
  ) {
    inputRef.value.blur();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.color-input-wrapper {
  padding: 8px;
  height: 100%;
}

.color-input {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--color-border-hover);
}
</style>
