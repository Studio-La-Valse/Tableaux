<template>
  <div class="selection-border-overlay">
    <!-- Only show the selection border while dragging -->
    <div v-if="selecting" class="selection-border" :style="borderStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue';

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  // Allow the selection border to be hidden when not actively selecting.
  visible: { type: Boolean, default: true },
  selecting: { type: Boolean, default: false }
});

const borderStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  left: `${props.x}px`,
  top: `${props.y}px`,
  width: `${props.width}px`,
  height: `${props.height}px`,
  border: '2px dashed #2196F3',
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  pointerEvents: 'none', // Ensures underlying elements can still receive mouse events.
  zIndex: 1000 // Bring the border to the front.
}));

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
