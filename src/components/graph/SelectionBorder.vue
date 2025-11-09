<template>
  <div
    v-if="store.selecting"
    class="selection-border-overlay"
  >
    <div
      class="selection-border"
      :style="borderStyle"
    />
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { useSelectionAreaStore } from '@/stores/use-selection-area-store'

const store = useSelectionAreaStore()
const borderStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  left: `${store.rect.x}px`,
  top: `${store.rect.y}px`,
  width: `${store.rect.width}px`,
  height: `${store.rect.height}px`,
  border: '2px dashed #2196F3',
  backgroundColor: 'rgba(33,150,243,0.1)',
  pointerEvents: 'none',
  zIndex: 1000,
}))
</script>

<style scoped>
.selection-border-overlay {
  position: absolute;
  top: 0;
  left: 0;
  /* Ensure the overlay covers the entire canvas area */
  width: 100%;
  height: 100%;
}

/* Basic styling for the selection border element */
.selection-border {
  box-sizing: border-box;
}
</style>
