<template>
  <div ref="resizableRef" class="resizable" :style="{ width: width + 'px', height: height + 'px' }">
    <!-- Input Ports rendered via our renderer component -->
    <div class="inputs" v-if="graphNode.inputs && graphNode.inputs.length">
      <GraphNodeInputRenderer v-for="(input, index) in graphNode.inputs" :key="'input-' + index" :input="input" />
    </div>

    <!-- Output Ports rendered via our renderer component -->
    <div class="outputs" v-if="graphNode.outputs && graphNode.outputs.length">
      <GraphNodeOutputRenderer v-for="(output, index) in graphNode.outputs" :key="'output-' + index" :output="output" />
    </div>

    <!-- Main Content Panel -->
    <div class="content">
      <component :is="getGraphNodePanel(graphNode)" :graphNode="graphNode" />
    </div>

    <!-- Resizer for the bottom right corner -->
    <div class="resizer" @pointerdown="initResize"></div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, type Component, computed } from 'vue';
import NumberEmitterPanel from './Nodes/NumberEmitter.vue';
import TextEmitterPanel from './Nodes/TextEmitter.vue';
import GraphNodePanel from './Nodes/GraphNodePanel.vue';
import LoggerPanel from './Nodes/LoggerPanel.vue';
import GraphNodeInputRenderer from './Nodes/GraphNodeInputRenderer.vue';
import GraphNodeOutputRenderer from './Nodes/GraphNodeOutputRenderer.vue';
import type { GraphNode } from '@/models/graph/core/graph-node';
import { useGraph } from '@/stores/graph-store';

const { getNode } = useGraph()

const props = defineProps({
  graphNode: {
    type: Object as () => GraphNode,
    required: true,
  }
});

const graphNode = getNode(props.graphNode.id)

// Registry to resolve the proper node panel based on the graph node type.
const registry: Record<string, Component> = {
  NumberEmitter: NumberEmitterPanel,
  TextEmitter: TextEmitterPanel,
  Logger: LoggerPanel,
  // Other emitter types can be added here.
};

const getGraphNodePanel = (emitter: GraphNode) => {
  // Identifying the type using the constructor name.
  const type = emitter.constructor.name;
  return registry[type] || GraphNodePanel;
};

// INITIAL DIMENSIONS
const width = computed({
  get: () => graphNode.width,
  set: (val) => { graphNode.width = val }
})
const height = computed({
  get: () => graphNode.height,
  set: (val) => { graphNode.height = val }
})

// --- Resizing state variables ---
interface XY { x: number; y: number; }
let startLocal: XY = { x: 0, y: 0 };
let startWidth = width.value;
let startHeight = props.graphNode.computedMinHeight;
let containerEl: HTMLElement | null = null;
let resizerEl: HTMLElement | null = null;

/**
 * Finds the closest parent with class "canvas-content" to get the current
 * transform (scale, translate, etc.).
 */
function getCanvasContent(el: EventTarget | null): HTMLElement | null {
  if (el instanceof HTMLElement) {
    return el.closest('.canvas-content') as HTMLElement;
  }
  return null;
}

/**
 * Converts the pointer event’s client coordinates into logical coordinates of
 * the container by inverting its computed transform (using DOMMatrix).
 */
function getLocalMousePos(
  event: MouseEvent | PointerEvent,
  container: HTMLElement
): XY {
  const rect = container.getBoundingClientRect();
  const style = window.getComputedStyle(container);
  const transformStr = style.transform;
  let matrix = new DOMMatrix();
  if (transformStr && transformStr !== 'none') {
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

/**
 * Called on pointer down on the resizer. It finds the canvas (transform container),
 * records the local pointer position and the starting dimensions.
 */
const initResize = (e: PointerEvent) => {
  if (e.button !== 0) return; // Only for primary button
  e.preventDefault();
  e.stopPropagation();

  // Find the canvas-content container where the transform is applied.
  containerEl = getCanvasContent(e.currentTarget);
  if (!containerEl) return;

  // Record the starting pointer position in logical (local) coordinates.
  startLocal = getLocalMousePos(e, containerEl);
  startWidth = width.value;
  startHeight = height.value;

  // Set pointer capture so that all subsequent events go to this element.
  resizerEl = e.currentTarget as HTMLElement;
  resizerEl.setPointerCapture(e.pointerId);
  resizerEl.addEventListener('pointermove', onPointerMove);
  resizerEl.addEventListener('pointerup', onPointerUp);
  resizerEl.addEventListener('pointercancel', onPointerUp);
};

const onPointerMove = (e: PointerEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (!containerEl) return;

  // Compute the current pointer position in the canvas's local coordinate space.
  const localPos = getLocalMousePos(e, containerEl);
  const deltaX = localPos.x - startLocal.x;
  const deltaY = localPos.y - startLocal.y;

  // Update node dimensions.
  // For width, we enforce a minimum of 150px.
  // For height, the minimum is computedMinHeight.
  width.value = startWidth + deltaX;
  height.value = startHeight + deltaY;
};

const onPointerUp = (e: PointerEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (resizerEl) {
    resizerEl.releasePointerCapture(e.pointerId);
    resizerEl.removeEventListener('pointermove', onPointerMove);
    resizerEl.removeEventListener('pointerup', onPointerUp);
    resizerEl.removeEventListener('pointercancel', onPointerUp);
  }
};

onUnmounted(() => {
  if (resizerEl) {
    resizerEl.removeEventListener('pointermove', onPointerMove);
    resizerEl.removeEventListener('pointerup', onPointerUp);
    resizerEl.removeEventListener('pointercancel', onPointerUp);
  }
});
</script>

<style scoped>
.resizable {
  position: relative;
  border: 2px solid #ccc;
  box-sizing: border-box;
  overflow: hidden;
  background: #989494;
}

/* Place the input ports inside the node on the left side */
.inputs {
  position: absolute;
  left: -15px;
  top: 0;
  width: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 4px 0;
}

/* Place the output ports inside the node on the right side */
.outputs {
  position: absolute;
  right: -15px;
  top: 0;
  width: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 4px 0;
}

/* Adjust the main content to account for the port panels */
.content {
  position: relative;
  margin: 0 30px;
  width: calc(100% - 60px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

/* Resizer styling remains unchanged */
.resizer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background-color: #aaa;
  cursor: se-resize;
}
</style>
