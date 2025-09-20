<template>
  <div
    class="press-button"
    @mousedown="setPressed(true)"
    @mouseup="setPressed(false)"
    :title="pressed ? 'Pressed' : 'Unpressed'"
  >
    {{ pressed ? '🟩' : '⭕' }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGraphStore } from '@/stores/use-graph-store';
import type { Toggle } from '@/graph/graph-nodes/generic/toggle';

const graph = useGraphStore();

const props = defineProps<{
  graphNode: Toggle
}>()

const pressed = computed(() => props.graphNode.data.value);

const setPressed = (state: boolean) => {
  props.graphNode.onChange(state);
  graph.commit();
}
</script>

<style scoped>
.press-button {
  width: 60px;
  height: 35px;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  cursor: pointer;
  user-select: none;
}

.press-button:hover {
  background: var(--color-border-hover);
}
</style>
