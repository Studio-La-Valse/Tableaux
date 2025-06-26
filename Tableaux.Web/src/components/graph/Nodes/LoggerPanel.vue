<template>
  <div class="outer">
    <div class="inner">
      <p v-for="(value, index) in unwrappedValues" :key="index">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Logger } from '@/models/graph/graph-nodes/generic/logger';
import { computed, onMounted } from 'vue';

const props = defineProps({
  graphNode: {
    type: Object as () => Logger,
    required: true,
  },
});

// Unwrap the ref<string[]> for easier use in the template.
const unwrappedValues = computed(() => props.graphNode.values);

onMounted(() => {
  props.graphNode.onInitialize();
});
</script>

<style scoped>
.outer {
  /* Fill available space in the parent */
  height: 100%;
  width: 100%;
  overflow-y: auto;

  /* Flex layout helps with centering */
  display: flex;
  flex-direction: column;
}

.inner {
  /* When content is small, auto margins center the inner container vertically.
     When content is larger than available space, the auto margins collapse
     so that content starts at the top and scrolling works naturally. */
  margin: auto;

  /* Center text, and if desired, limit content width */
  text-align: center;
  max-width: 600px;
  /* Optional: adjust as needed */
}

/* (Optional) Custom scrollbar styling for WebKit browsers */
.outer::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  cursor: grab;
}

.outer::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.outer::-webkit-scrollbar-thumb:active {
  cursor: grabbing;
}
</style>
