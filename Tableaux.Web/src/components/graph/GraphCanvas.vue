<template>
  <div ref="containerRef" class="canvas-container" @mousedown="_onMouseDown" @contextmenu.prevent @wheel="onWheel">

    <div ref="contentRef" class="canvas-content" :style="style">

      <SelectionBorder :selecting="selecting" :x="x" :y="y" :width="width" :height="height" />

      <GraphRenderer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSelectionArea } from "@/composables/useSelectionArea";
import { ref, onMounted, onUnmounted, nextTick, computed, type StyleValue } from "vue";
import SelectionBorder from "./SelectionBorder.vue";
import GraphRenderer from "./GraphRenderer.vue";
import { useClearSelection } from "@/composables/useClearSelection";

const { onMouseDown, selecting, x, y, width, height } = useSelectionArea();
const clearSelection = useClearSelection();

const style = computed<StyleValue>(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`,
  pointerEvents: selecting.value ? "none" : "all"
}))

// References for container and inner content.
const containerRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

// Track the container’s size (for zoom calculations)
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

// Variables to track dragging.
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });

// --- Mouse Event Handlers ---
// Note: We now respond to the right mouse button (event.button === 2).
const _onMouseDown = (event: MouseEvent) => {
  clearSelection.onClickClearSelection(event);
  
  onMouseDown(event)

  if (event.button === 2) {
    isDragging.value = true;
    startPosition.value = { x: event.clientX, y: event.clientY };
    // Attach document-level listeners so dragging continues outside the container.
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    event.preventDefault();
  }
};

const onMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return;
  const dx = event.clientX - startPosition.value.x;
  const dy = event.clientY - startPosition.value.y;
  position.value.x += dx;
  position.value.y += dy;
  startPosition.value = { x: event.clientX, y: event.clientY };
};

const onMouseUp = (event: MouseEvent) => {
  if (isDragging.value) {
    isDragging.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    event.preventDefault();
  }
};

// --- Wheel / Zoom Logic ---
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
