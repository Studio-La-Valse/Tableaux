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

import { useSelectionArea } from '@/composables/useSelectionArea';
import { useClearSelection } from '@/composables/useClearSelection';
import { useCanvasTransform } from '@/composables/useCanvasTransform';

import { useContextMenuStore } from "@/stores/context-menu";
import { useGraphNodeSelectionStore } from '@/stores/graph-node-selection-store';
import { useSelectionAreaStore } from '@/stores/selection-area-store';
import { useCanvasRefStore } from '@/stores/canvas-ref-store';
import { useGraph } from '@/stores/graph-store';

const selectionArea = useSelectionArea();
const selectionAreaStore = useSelectionAreaStore();
const clearSelection = useClearSelection();
const menu = useContextMenuStore()
const selection = useGraphNodeSelectionStore();
const graph = useGraph();
const canvasTransform = useCanvasTransform();
const canvasStore = useCanvasRefStore()

const viewportRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);

// merge pointer‐events with zoomStyle
const contentStyle = computed<StyleValue>(() => ({
  ...canvasTransform.style.value,
  pointerEvents: selectionAreaStore.selecting ? 'none' : 'all'
}));

function onMouseDown(event: MouseEvent) {
  if (event.target !== viewportRef.value) return;

  canvasTransform.onMouseDown(event);
  selectionArea.onMouseDown(event);
  clearSelection.onClickClearSelection(event);

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
