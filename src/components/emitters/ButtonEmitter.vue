<template>
  <button class="press-button" type="button" @mousedown.stop="setPressed(true)" @mouseup="setPressed(false)">
    <component :is="graphNode.data.value ? CheckCircleIcon : XCircleIcon" class="icon"
      :class="graphNode.data.value ? 'icon-true' : 'icon-false'" />
  </button>

</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/solid'
import type { Emitter } from '@/graph/core/emitter';
import type { JsonValue } from '@/graph/core/models/json-value';

const props = defineProps<{
  graphNode: Emitter<JsonValue>
}>()

const setPressed = (state: boolean) => {
  props.graphNode.onChange(state);
}
</script>

<style scoped>
.press-button {
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

.press-button.active {
  background: var(--color-background-soft);
  border-color: var(--color-accent);
}

.press-button:hover {
  background: var(--color-border-hover);
}

.icon {
  width: 16px;
  height: 16px;
  color: var(--color-text);
  pointer-events: none;
}

.icon-true {
  color: var(--vt-complete-2);
}

.icon-false {
  color: var(--vt-error-1);
}
</style>
