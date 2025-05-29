<template>
  <div
    ref="containerRef"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel="onWheel"
    style="width: 100%; height: 100%; overflow: hidden; cursor: grab;"
  >
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`"
      style="width: 100%; height: 100%;"
    >
      <!-- All transformations are applied here on the group, keeping the SVG's
           coordinate space and bounding box intact. -->
      <g :transform="`translate(${position.x}, ${position.y}) scale(${scale})`">
        <!-- Example content filling the canvas.
             Using canvasSize to draw a background rectangle that fills the space. -->
        <rect x="0" y="0" width="500" height="500" fill="lightblue" />
        <!-- You can add more SVG content here -->
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// References for the container and SVG elements.
const containerRef = ref(null);
const svgRef = ref(null);

// The canvas size in our coordinate system (matching container size).
const canvasSize = ref({ width: 1, height: 1 });

// Update canvasSize by checking the container's client dimensions.
const updateCanvasSize = () => {
  if (containerRef.value) {
    canvasSize.value = {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight,
    };
  }
};

onMounted(() => {
  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCanvasSize);
});

// Transformation state: translation and scale.
const position = ref({ x: 0, y: 0 });
const scale = ref(1);

// Drag state for panning with the middle mouse button.
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });

const onMouseDown = (event) => {
  if (event.button === 1) {
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

const onWheel = (event) => {
  event.preventDefault();
  // Choose a zoom intensity.
  const zoomIntensity = 0.1;
  // Compute the zoom delta.
  const delta = event.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  
  // Calculate the new scale.
  const newScale = scale.value * (1 + delta);
  
  // Get the SVG's bounding rectangle (in screen pixels).
  const svgRect = svgRef.value.getBoundingClientRect();
  
  // Compute the mouse position relative to the SVG's coordinate space.
  // In our case, the SVG's viewBox is "0 0 canvasSize.width canvasSize.height"
  // so we map the (clientX, clientY) into that coordinate system.
  const localMouse = {
    x: ((event.clientX - svgRect.left) * canvasSize.value.width) / svgRect.width,
    y: ((event.clientY - svgRect.top) * canvasSize.value.height) / svgRect.height,
  };
  
  // Update the translation so that the point under the mouse stays fixed.
  // Derived from: newT = oldT - delta · (M - oldT)
  position.value.x = position.value.x - delta * (localMouse.x - position.value.x);
  position.value.y = position.value.y - delta * (localMouse.y - position.value.y);
  
  // Apply the new scale.
  scale.value = newScale;
};
</script>
