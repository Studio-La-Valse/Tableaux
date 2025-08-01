<template>
  <div class="page">

    <GraphControls />

    <div ref="viewportRef" class="canvas-container" @contextmenu.prevent @dblclick.prevent="onCanvasDblClick"
      @mousedown="onMouseDown" @wheel="canvasTransform.onWheel">

      <div ref="canvasRef" class="canvas-content" :style="contentStyle">
        <GraphRenderer />

        <SelectionBorder />
      </div>

      <ActivatorTree />
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type StyleValue } from 'vue';

import ActivatorTree from '@/components/graph/NodeBrowser/ActivatorTree.vue'
import GraphRenderer from '@/components/graph/GraphRenderer.vue'
import SelectionBorder from '@/components/graph/SelectionBorder.vue'
import GraphControls from '@/components/graph/GraphControls/GraphControls.vue';

import { useSelectionArea } from '@/composables/use-selection-area';
import { useClearSelection } from '@/composables/use-clear-selection';
import { useCanvasTransform } from '@/composables/use-canvas-transform';

import { useContextMenuStore } from "@/stores/use-context-menu-store";
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store';
import { useSelectionAreaStore } from '@/stores/use-selection-area-store';
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store';
import { useGraphStore } from '@/stores/use-graph-store';

const selectionArea = useSelectionArea();
const selectionAreaStore = useSelectionAreaStore();
const clearSelection = useClearSelection();
const menu = useContextMenuStore()
const selection = useGraphNodeSelectionStore();
const graph = useGraphStore();
const canvasTransform = useCanvasTransform();
const canvasStore = useGraphCanvasStore()

const viewportRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);

// merge pointer‐events with zoomStyle
const contentStyle = computed<StyleValue>(() => ({
  ...canvasTransform.style.value,
  pointerEvents: selectionAreaStore.selecting ? 'none' : 'all'
}));

function onMouseDown(event: MouseEvent) {
  canvasTransform.onMouseDown(event);
  selectionArea.onMouseDown(event);
  clearSelection.onMouseDown(event);

  menu.close();
}

function onCanvasDblClick(evt: MouseEvent) {
  if (evt.target !== viewportRef.value) return;

  menu.open(evt);
}

function deleteSelectedNodes(evt: KeyboardEvent) {
  if (evt.key != 'Delete') return;

  graph.removeNodes([...selection.selectedNodes])
  selection.clearSelection();
}

onMounted(() => {
  if (!viewportRef.value || !canvasRef.value) {
    throw new Error()
  }

  canvasStore.setRefs(viewportRef.value, canvasRef.value)

  window.addEventListener('keydown', deleteSelectedNodes)
})

onUnmounted(() => {
  window.removeEventListener('keydown', deleteSelectedNodes)
})
</script>

<style lang="css" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.canvas-container {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
</style>
