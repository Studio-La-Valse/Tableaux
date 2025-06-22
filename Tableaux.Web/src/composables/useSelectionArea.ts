// src/composables/useSelectionArea.ts
import { ref, onUnmounted } from 'vue';

export function useSelectionArea() {
  // Flag that indicates an active (draggable) selection.
  const selecting = ref(false);
  // Starting coordinates for the drag.
  const startX = ref(0);
  const startY = ref(0);
  // The reactive selection rectangle.
  const x = ref(0);
  const y = ref(0);
  const width = ref(0);
  const height = ref(0);
  // Pixels of movement required before a drag is considered "actual".
  const dragThreshold = 5;

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return; // Only respond to left-click.
    // Record the initial pointer position.
    startX.value = e.clientX;
    startY.value = e.clientY;
    // Initialize rectangle values.
    x.value = e.clientX;
    y.value = e.clientY;
    width.value = 0;
    height.value = 0;
    // Initially, do not mark selection as active.
    selecting.value = false;

    // Attach global listeners.
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    const dx = e.clientX - startX.value;
    const dy = e.clientY - startY.value;
    const dist = Math.hypot(dx, dy);
    // Only consider it a true drag if movement exceeds the threshold.
    if (dist > dragThreshold) {
      if (!selecting.value) {
        selecting.value = true;
      }
      // Compute the selection rectangle.
      x.value = Math.min(startX.value, e.clientX);
      y.value = Math.min(startY.value, e.clientY);
      width.value = Math.abs(e.clientX - startX.value);
      height.value = Math.abs(e.clientY - startY.value);
      
      // Prevent default only when a drag is active.
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onMouseUp(e: MouseEvent) {
    if (selecting.value) {
      // Optionally, you could process the final selection rectangle here.
      selecting.value = false;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });

  return { selecting, x, y, width, height, onMouseDown };
}
