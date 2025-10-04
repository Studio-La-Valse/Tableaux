<template>
  <input
    ref="inputRef"
    class="color-input"
    type="color"
    :value="props.graphNode.data.value"
    @input="handleInput"
    @mousedown.stop
    @mousemove.stop
    @mouseup.stop="mouseUp"
    @wheel.stop
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
  />
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useGraphStore } from '@/stores/use-graph-store';
  import type { JsonValue } from '@/graph/core/models/json-value';
  import type { Emitter } from '@/graph/core/emitter';

  const graph = useGraphStore();

  const props = defineProps<{
    graphNode: Emitter<JsonValue>;
  }>();

  const inputRef = ref<HTMLInputElement | null>(null);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const colorValue = target.value;
    props.graphNode.onChange(colorValue);
  };

  const mouseUp = () => {
    graph.commit();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.value && !inputRef.value.contains(event.target as Node)) {
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
  .color-input {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    padding: 0px;
    min-width: 0px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    resize: none;
  }

  .color-input:focus {
    outline: none;
    border: 2px solid var(--color-accent);
  }
</style>
