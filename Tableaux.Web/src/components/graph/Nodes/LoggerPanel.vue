<template>
  <ResizablePanel :graph-node-id="props.graphNode.id" :initial-height="80" :initial-width="80">
    <div class="inner">
      <!-- directly loop over the reactive array -->
      <p v-for="(value, i) in props.graphNode.values" :key="i">
        {{ value }}
      </p>
    </div>
  </ResizablePanel>
</template>

<script setup lang="ts">
import type { Logger } from '@/models/graph/graph-nodes/generic/logger'
import ResizablePanel from "./ResizablePanel.vue"

// `defineProps` gives you a typed `graphNode` in your template
const props = defineProps<{
  graphNode: Logger
}>()

</script>


<style scoped>
.inner {
  padding: 10px;

  /* When content is small, auto margins center the inner container vertically.
     When content is larger than available space, the auto margins collapse
     so that content starts at the top and scrolling works naturally. */
  margin: auto;

  /* Center text, and if desired, limit content width */
  text-align: center;
  max-width: 600px;
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
