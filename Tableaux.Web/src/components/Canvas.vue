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
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`"
      class="canvas-svg"
    >
      <g :transform="`translate(${position.x}, ${position.y}) scale(${scale})`">
        <slot></slot>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Element references
const containerRef = ref(null);
const svgRef = ref(null);
const canvasSize = ref({ width: 300, height: 300 });

const updateCanvasSize = () => {
  if (containerRef.value) {
    canvasSize.value = {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight,
    };
  }
};

let resizeObserver = null;

onMounted(() => {
  updateCanvasSize();

  // Use ResizeObserver to track parent container size changes
  resizeObserver = new ResizeObserver(() => updateCanvasSize());
  resizeObserver.observe(containerRef.value);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// Interaction states
const position = ref({ x: 0, y: 0 });
const scale = ref(1);
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });

// Mouse interactions
const onMouseDown = (event) => {
  if (event.button === 0) {
    isDragging.value = true;
    startPosition.value = { x: event.clientX, y: event.clientY };
    event.preventDefault();
  }
};

const onMouseMove = (event) => {
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

// Zoom with wheel
const onWheel = (event) => {
  event.preventDefault();
  const zoomIntensity = 0.1;
  const delta = event.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  const newScale = scale.value * (1 + delta);

  const svgRect = svgRef.value.getBoundingClientRect();
  const localMouse = {
    x: ((event.clientX - svgRect.left) * canvasSize.value.width) / svgRect.width,
    y: ((event.clientY - svgRect.top) * canvasSize.value.height) / svgRect.height,
  };

  position.value.x -= delta * (localMouse.x - position.value.x);
  position.value.y -= delta * (localMouse.y - position.value.y);
  scale.value = newScale;
};
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.canvas-svg {
  width: 100%;
  height: 100%;
}
</style>
