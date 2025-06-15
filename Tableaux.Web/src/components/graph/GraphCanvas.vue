<template>
  <div
    ref="containerRef"
    class="canvas-container"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel="onWheel"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div
      ref="contentRef"
      class="canvas-content"
      :style="{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";

// References for container and inner content.
const containerRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

// We track the container’s size (for zoom calculations)
const canvasSize = ref({ width: 300, height: 300 });
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
  nextTick(() => {
    updateCanvasSize();
    if (containerRef.value) {
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

// Pan/zoom state for the canvas.
const position = ref({ x: 0, y: 0 });
const scale = ref(1);

// Canvas panning variables.
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });

const onMouseDown = (event: MouseEvent) => {
  // If the panel stops propagation, these won't fire.
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

const onWheel = (event: WheelEvent) => {
  event.preventDefault();
  if (!containerRef.value) return;

  const zoomIntensity = 0.1;
  const delta = event.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  const newScale = scale.value * (1 + delta);
  if (newScale > 5 || newScale < 0.2) return;

  // Convert the mouse position into “logical” canvas coordinates.
  const containerRect = containerRef.value.getBoundingClientRect();
  const localMouse = {
    x:
      ((event.clientX - containerRect.left) * canvasSize.value.width) /
      containerRect.width,
    y:
      ((event.clientY - containerRect.top) * canvasSize.value.height) /
      containerRect.height,
  };

  // Adjust the canvas position so that the zoom is centered around the mouse.
  position.value.x -= delta * (localMouse.x - position.value.x);
  position.value.y -= delta * (localMouse.y - position.value.y);
  scale.value = newScale;
};

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
}
</style>
