<template>
  <div ref="containerRef" class="canvas-container" @mousedown="onMouseDown" @mousemove="onMouseMove"
    @mouseup="onMouseUp" @mouseleave="onMouseUp" @wheel="onWheel" @touchstart="onTouchStart" @touchmove="onTouchMove"
    @touchend="onTouchEnd" @touchcancel="onTouchEnd">
    <div class="canvas-content" :style="{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";

// Element references
const containerRef = ref<HTMLDivElement | null>(null);
// Using client dimensions from container for calculations.
const canvasSize = ref({ width: 300, height: 300 });

// Update the canvas dimensions based on container size
const updateCanvasSize = () => {
  if (containerRef.value) {
    canvasSize.value = {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight,
    };
  }
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // Ensure the parent layout (Split.js) has been applied.
  nextTick(() => {
    updateCanvasSize();
    if (containerRef.value) {
      // Observe size changes in the container element.
      resizeObserver = new ResizeObserver(() => updateCanvasSize());
      resizeObserver.observe(containerRef.value);
    }
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// Interaction state
const position = ref({ x: 0, y: 0 });
const scale = ref(1);
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });

// Mouse interactions
const onMouseDown = (event: MouseEvent) => {
  if (event.button === 0) {
    isDragging.value = true;
    startPosition.value = { x: event.clientX, y: event.clientY };
    event.preventDefault();
  }
};

const onMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    const dx = event.clientX - startPosition.value.x;
    const dy = event.clientY - startPosition.value.y;
    position.value.x += dx;
    position.value.y += dy;
    startPosition.value = { x: event.clientX, y: event.clientY };
  }
};

const onMouseUp = () => {
  isDragging.value = false;
};

// Zoom with mouse wheel
const onWheel = (event: WheelEvent) => {
  event.preventDefault();
  if (!containerRef.value) return;

  const zoomIntensity = 0.1;
  const delta = event.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  const newScale = scale.value * (1 + delta);
  if (newScale > 5 || newScale < 0.2) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const localMouse = {
    x:
      ((event.clientX - containerRect.left) * canvasSize.value.width) /
      containerRect.width,
    y:
      ((event.clientY - containerRect.top) * canvasSize.value.height) /
      containerRect.height,
  };

  position.value.x -= delta * (localMouse.x - position.value.x);
  position.value.y -= delta * (localMouse.y - position.value.y);
  scale.value = newScale;
};

// Touch events mimic mouse dragging.
const onTouchStart = (event: TouchEvent) => {
  if (event.touches.length === 1) {
    isDragging.value = true;
    startPosition.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    event.preventDefault();
  }
};

const onTouchMove = (event: TouchEvent) => {
  if (isDragging.value && event.touches.length === 1) {
    const dx = event.touches[0].clientX - startPosition.value.x;
    const dy = event.touches[0].clientY - startPosition.value.y;
    position.value.x += dx;
    position.value.y += dy;
    startPosition.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    event.preventDefault();
  }
};

const onTouchEnd = () => {
  isDragging.value = false;
};
</script>

<style scoped lang="css">
/* Ensure our component fills the area provided by Split.js */
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 2px dashed blue;
  position: relative;
}

.canvas-content {
  width: 100%;
  height: 100%;
  transform-origin: top left;
  /* Optionally, add any other styles for your inner content */
}
</style>
