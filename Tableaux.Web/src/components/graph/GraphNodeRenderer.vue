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
import { useCanvasTransform } from "@/composables/canvasTransform";

const { getNode } = useGraph();
const { getCanvasContent, getLocalMousePos} = useCanvasTransform();

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
