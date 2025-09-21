<template>
  <div class="toggle-icon" @click="toggleValue">
    {{ props.graphNode.data.value ? '✔' : '✖' }}
  </div>
</template>


<script setup lang="ts">
import { useGraphStore } from '@/stores/use-graph-store';
import type { Toggle } from '@/graph/graph-nodes/generic/toggle';

const graph = useGraphStore();

const props = defineProps<{
  graphNode: Toggle
}>()

const toggleValue = () => {
  props.graphNode.onChange(!props.graphNode.data.value);
  graph.commit();
}
</script>


<style scoped>
.toggle-icon {
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

.toggle-icon:hover {
  background: var(--color-border-hover);
}
</style>
