<template>
  <!-- This overlay covers its parent canvas but does not block mouse events -->
  <div class="selection-border-overlay">
    <!-- The selection border is only drawn when a true drag occurred -->
    <div v-if="selecting" class="selection-border" :style="borderStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, type StyleValue } from 'vue';
import { useSelectionArea } from '@/composables/useSelectionArea';
import { useSelectionStore } from '@/stores/selection-store';
import { useGraph } from '@/stores/graph-store';

const { nodes } = useGraph();

// Use our composable that handles mouse events and calculates the selection rectangle.
const { selecting, x, y, width, height, onMouseDown } = useSelectionArea();

// Computed inline style for the drawn selection border.
const borderStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  left: `${x.value}px`,
  top: `${y.value}px`,
  width: `${width.value}px`,
  height: `${height.value}px`,
  border: '2px dashed #2196F3',
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  pointerEvents: 'none',
  zIndex: 1000
}));

// Acquire our selection store instance.
const selectionStore = useSelectionStore();

/**
 * Given the final selection rectangle, iterate over the provided graph nodes
 * and select those that lie entirely within the rectangle.
 */
function applySelection() {
  // Clear any prior selection.
  selectionStore.clearSelection();
  const selRect = { x: x.value, y: y.value, width: width.value, height: height.value };
  
  // For every node provided, check whether its rectangle is completely within the selection.
  nodes.forEach((node) => {
    if (
      // Node's top-left point is to the right and below the selection's top-left...
      node.x >= selRect.x &&
      node.y >= selRect.y &&
      // ... and the node's bottom-right is to the left and above the selection's bottom-right.
      (node.x + node.width) <= (selRect.x + selRect.width) &&
      (node.y + node.height) <= (selRect.y + selRect.height)
    ) {
      selectionStore.selectNode(node.id);
    }
  });
}

// When selection dragging ends, if the user actually dragged, then apply selection.
watch(selecting, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    // If a draggight happened (i.e. a nonzero rectangle), update selection.
    if (width.value > 0 && height.value > 0) {
      applySelection();
    }
  }
});

// Attach the mousedown listener on the window when the component mounts:
onMounted(() => {
  window.addEventListener('mousedown', onMouseDown);
});
onUnmounted(() => {
  window.removeEventListener('mousedown', onMouseDown);
});
</script>

<style scoped>
.selection-border-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  pointer-events: none; /* Allows events to pass through to underlying elements. */
}

.selection-border {
  box-sizing: border-box;
}
</style>
