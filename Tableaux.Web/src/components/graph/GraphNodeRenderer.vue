<template>
  <div class="panel" :style="{ transform: `translate(${localPos.x}px, ${localPos.y}px)` }" @mousedown="onMouseDown"
    @touchstart="onTouchStart">
    <PanelRenderer :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import PanelRenderer from "./PanelRenderer.vue";
import type { GraphNode } from "@/models/graph/core/graph-node";
import { XY } from "@/models/geometry/xy";
import { useGraph } from "@/stores/graph-store";

const { getNode } = useGraph();

const props = defineProps<{
  graphNode: GraphNode;
}>();

// The panel’s position in logical (canvas-content) coordinates.
const localPos = computed<XY>({
  get: () => new XY(props.graphNode.x, props.graphNode.y),
  set: (val) => {
    const node = getNode(props.graphNode.id)
    node.x = val.x;
    node.y = val.y;
  }
});

// Drag state.
const dragging = ref(false);
const dragOffset = ref<XY>({ x: 0, y: 0 });
const containerEl = ref<HTMLElement | null>(null);

/**
 * Find the closest parent with class "canvas-content". This holds the transform.
 */
function getCanvasContent(el: EventTarget | null): HTMLElement | null {
  if (el instanceof HTMLElement) {
    return el.closest(".canvas-content") as HTMLElement;
  }
  return null;
}

/**
 * Convert the mouse event’s coordinates into the canvas-content’s logical space.
 * We use DOMMatrix to invert the container’s computed transform.
 */
function getLocalMousePos(event: MouseEvent, container: HTMLElement): XY {
  const rect = container.getBoundingClientRect();
  const style = window.getComputedStyle(container);
  const transformStr = style.transform;
  let matrix = new DOMMatrix();
  if (transformStr && transformStr !== "none") {
    matrix = new DOMMatrix(transformStr);
  }
  const point = new DOMPoint(
    event.clientX - rect.left,
    event.clientY - rect.top
  );
  const invMatrix = matrix.inverse();
  const localPoint = point.matrixTransform(invMatrix);
  return { x: localPoint.x, y: localPoint.y };
}

function onMouseDown(event: MouseEvent) {
  if (event.button !== 0) return;
  // Prevent the canvas from panning.
  event.stopPropagation();

  const container = getCanvasContent(event.currentTarget);
  if (!container) return;
  containerEl.value = container;

  const mousePos = getLocalMousePos(event, container);
  // Save the offset between where the panel is and where the mouse is.
  dragOffset.value = {
    x: mousePos.x - localPos.value.x,
    y: mousePos.y - localPos.value.y,
  };

  dragging.value = true;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(event: MouseEvent) {
  if (!dragging.value || !containerEl.value) return;
  event.stopPropagation();

  const mousePos = getLocalMousePos(event, containerEl.value);
  localPos.value = {
    x: mousePos.x - dragOffset.value.x,
    y: mousePos.y - dragOffset.value.y,
  };
}

function onMouseUp() {
  dragging.value = false;
  containerEl.value = null;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) return;
  event.stopPropagation();

  const container = getCanvasContent(event.currentTarget);
  if (!container) return;
  containerEl.value = container;

  const touch = event.touches[0];
  // Create an object mimicking a MouseEvent.
  const simulatedEvent = { clientX: touch.clientX, clientY: touch.clientY } as MouseEvent;
  const mousePos = getLocalMousePos(simulatedEvent, container);
  dragOffset.value = {
    x: mousePos.x - localPos.value.x,
    y: mousePos.y - localPos.value.y,
  };

  dragging.value = true;
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);
  window.addEventListener("touchcancel", onTouchEnd);
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value || !containerEl.value || event.touches.length !== 1) return;
  event.stopPropagation();

  const touch = event.touches[0];
  const simulatedEvent = { clientX: touch.clientX, clientY: touch.clientY } as MouseEvent;
  const mousePos = getLocalMousePos(simulatedEvent, containerEl.value);
  localPos.value = {
    x: mousePos.x - dragOffset.value.x,
    y: mousePos.y - dragOffset.value.y,
  };
  event.preventDefault();
}

function onTouchEnd() {
  dragging.value = false;
  containerEl.value = null;
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("touchcancel", onTouchEnd);
}
</script>

<style scoped>
.panel {
  position: absolute;
  cursor: grab;
  user-select: none;
  min-width: 50px;
  min-height: 50px;
  background-color: cadetblue;
}
</style>
