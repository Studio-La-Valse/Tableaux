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
    <canvas
      ref="canvasRef"
      :width="canvasSize.width"
      :height="canvasSize.height"
      class="canvas-bitmap"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

/**  
 * External elements must implement the Drawable interface.
 * Their draw() methods will be invoked in world-coordinates after the grid is drawn.
 */
export interface Drawable {
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const props = defineProps<{
  elements?: Drawable[];
}>();

// --- Element & Size Handling ---
const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasSize = ref({ width: 300, height: 300 });

// --- World Transformation State ---
// Even though the canvas element has finite dimensions,
// we treat the "world" as infinite with these transformation parameters.
const position = ref({ x: 0, y: 0 });
const scale = ref(1);

// --- Dragging State ---
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });

// --- 2D Drawing Context ---
let ctx: CanvasRenderingContext2D | null = null;

// --- Update Canvas Size ---
// This method updates the canvas pixel size from the container.
// Because adjusting the canvas element’s width/height resets it,
// we reinitialize the context and delay the redraw slightly.
const updateCanvasSize = () => {
  if (containerRef.value && canvasRef.value) {
    canvasSize.value = {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight,
    };
    canvasRef.value.width = canvasSize.value.width;
    canvasRef.value.height = canvasSize.value.height;
    ctx = canvasRef.value.getContext('2d');
    nextTick(() => {
      setTimeout(() => {
        draw();
      }, 50);
    });
  }
};

let resizeObserver: ResizeObserver | null = null;

// --- Drawing Routine ---
// draw() resets the canvas, applies the world transform, and then calls drawContent().
const draw = () => {
  if (!ctx) return;
  ctx.save();
  // Reset transform and clear the entire canvas.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height);
  // Apply the current world transform.
  ctx.setTransform(scale.value, 0, 0, scale.value, position.value.x, position.value.y);
  // Draw the infinite grid and any externally provided elements.
  drawContent(ctx);
  ctx.restore();
};

// drawContent() renders the grid and then iterates over external drawable elements.
const drawContent = (ctx: CanvasRenderingContext2D) => {
  const gridSpacing = 50;
  
  // Compute visible world boundaries in world coordinates.
  const worldMinX = (-position.value.x) / scale.value;
  const worldMinY = (-position.value.y) / scale.value;
  const worldMaxX = (canvasSize.value.width - position.value.x) / scale.value;
  const worldMaxY = (canvasSize.value.height - position.value.y) / scale.value;
  
  // Draw vertical gridlines.
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1 / scale.value; // Keep line width consistent when zooming.
  const startX = Math.floor(worldMinX / gridSpacing) * gridSpacing;
  for (let x = startX; x < worldMaxX; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, worldMinY);
    ctx.lineTo(x, worldMaxY);
    ctx.stroke();
  }
  
  // Draw horizontal gridlines.
  const startY = Math.floor(worldMinY / gridSpacing) * gridSpacing;
  for (let y = startY; y < worldMaxY; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(worldMinX, y);
    ctx.lineTo(worldMaxX, y);
    ctx.stroke();
  }
  
  // --- Draw External Elements ---
  if (props.elements) {
    props.elements.forEach((element) => element.draw(ctx));
  }
};

onMounted(() => {
  updateCanvasSize();
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => updateCanvasSize());
    resizeObserver.observe(containerRef.value);
  }
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    draw();
  }
});

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
    resizeObserver.disconnect();
  }
});

// --- Redraw when external elements change ---
watch(
  () => props.elements,
  () => {
    draw();
  },
  { deep: true }
);

// --- Mouse & Touch Interaction Handlers ---
// Panning via left-click dragging.
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
    draw();
  }
};

const onMouseUp = () => {
  isDragging.value = false;
};

// Zooming: Mouse wheel zoom keeps the point under the pointer fixed.
const onWheel = (event: WheelEvent) => {
  event.preventDefault();
  const zoomIntensity = 0.1;
  const delta = event.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  const newScale = scale.value * (1 + delta);
  if (newScale > 5 || newScale < 0.2){
    return;
  }
  
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // Adjust the translation so that the world coordinate under the pointer remains constant.
    position.value.x -= delta * (mouseX - position.value.x);
    position.value.y -= delta * (mouseY - position.value.y);
    scale.value = newScale;
    draw();
  }
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
    draw();
    event.preventDefault();
  }
};

const onTouchEnd = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.canvas-bitmap {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
