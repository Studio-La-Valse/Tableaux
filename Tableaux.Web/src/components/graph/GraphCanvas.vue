<template>
  <div ref="containerRef" class="canvas-container" @contextmenu.prevent @dblclick.prevent="onCanvasDblClick"
    @mousedown="onMouseDown" @wheel="onWheel">

    <div ref="contentRef" class="canvas-content" :style="contentStyle">
      <GraphRenderer />

      <SelectionBorder />
    </div>

    <ActivatorTree />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, type StyleValue } from 'vue';
import ActivatorTree from '@/components/graph/NodeBrowser/ActivatorTree.vue'
import GraphRenderer from '@/components/graph/GraphRenderer.vue'
import SelectionBorder from '@/components/graph/SelectionBorder.vue'

import { useSelectionArea } from '@/composables/useSelectionArea';
import { useClearSelection } from '@/composables/useClearSelection';
import { useCanvasTransform } from '@/composables/useCanvasTransform';

import { useContextMenuStore } from "@/stores/context-menu";
import { useGraph } from '@/stores/graph-store';
import { useSelectionStore } from '@/stores/selection-store';
import { useSelectionAreaStore } from '@/stores/selection-area-store';

const selectionArea = useSelectionArea();
const selectionAreaStore = useSelectionAreaStore();
const clearSelection = useClearSelection();
const menu = useContextMenuStore()
const selection = useSelectionStore();
const graph = useGraph();

// pull in all pan/zoom refs & handlers
const {
  containerRef,
  contentRef,
  style: zoomStyle,
  onMouseDown: onPanMouseDown,
  onWheel
} = useCanvasTransform();

// merge pointer‐events with zoomStyle
const contentStyle = computed<StyleValue>(() => ({
  ...zoomStyle.value,
  pointerEvents: selectionAreaStore.selecting ? 'none' : 'all'
}));

function onMouseDown(event: MouseEvent) {
  if (event.target !== containerRef.value) return;

  onPanMouseDown(event);
  selectionArea.onMouseDown(event);
  clearSelection.onClickClearSelection(event);

  menu.close();
}

function onCanvasDblClick(evt: MouseEvent) {
  if (evt.target !== containerRef.value) return;

  menu.open(evt);
}

function deleteSelectedNodes(evt: KeyboardEvent) {
  if (evt.key != 'Delete') return;

  selection.selectedNodes.forEach((n) => graph.removeNode(n))
  selection.clearSelection();
}

onMounted(() => {
  window.addEventListener('keydown', deleteSelectedNodes)
})

onUnmounted(() => {
  window.removeEventListener('keydown', deleteSelectedNodes)
})
</script>

<style lang="css" scoped>
.canvas-container {
  overflow: hidden;
  position: relative;
}

.canvas-content {}
</style>
