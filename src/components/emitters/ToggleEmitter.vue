<template>
  <div class="toggle-icon" @click="toggleValue">
    <component :is="graphNode.data.value ? CheckCircleIcon : XCircleIcon" class="icon"
      :class="graphNode.data.value ? 'icon-true' : 'icon-false'" />
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/solid'

import { useGraphStore } from '@/stores/use-graph-store';
import type { Emitter } from '@/graph/core/emitter';
import type { JsonValue } from '@/graph/core/models/json-value';

const graph = useGraphStore();

const props = defineProps<{
  graphNode: Emitter<JsonValue>
}>()

const toggleValue = () => {
  props.graphNode.onChange(!props.graphNode.data.value);
  graph.commit();
}
</script>


<style scoped>
.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  padding: 0;
  min-width: 0px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
}

.toggle-icon:hover {
  background: var(--color-border-hover);
}

.toggle-icon.active {
  background: var(--color-background-soft);
  border-color: var(--color-accent);
}

.icon {
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.icon-true {
  color: var(--vt-complete-2);
}

.icon-false {
  color: var(--vt-error-1);
}
</style>
