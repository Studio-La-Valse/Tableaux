<template>
  <div class="panel" :style="{ transform: `translate(${localPos.x}px, ${localPos.y}px)` }" @mousedown="onMouseDown">
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

const node = getNode(props.graphNode.id)

// The panel’s position in logical (canvas-content) coordinates.
const localPos = computed<XY>({
  get: () => new XY(props.graphNode.x, props.graphNode.y),
  set: (val) => {
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
  const style = window.getComputedStyle(container);
  const transformStr = style.transform;
  let matrix = new DOMMatrix();
  if (transformStr && transformStr !== "none") {
    matrix = new DOMMatrix(transformStr);
  }
  const point = new DOMPoint(
    event.clientX,
    event.clientY
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
