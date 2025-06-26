<template>
  <div ref="containerRef" class="canvas-container" @contextmenu.prevent @dblclick.prevent="onCanvasDblClick"
    @mousedown="onMouseDown" @wheel="onWheel" @click="menu.close">

    <div ref="contentRef" class="canvas-content" :style="contentStyle">
      <SelectionBorder :selecting="selecting" :x="x" :y="y" :width="width" :height="height" />
      <GraphRenderer />
    </div>

    <ActivatorTree v-if="menu.visible" :rootGroup="activatorTree" @activate="menu.onActivate" @close="menu.close"
      class="context-panel" :style="{ top: menu.y + 'px', left: menu.x + 'px' }" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, type StyleValue } from 'vue';
import { useSelectionArea } from '@/composables/useSelectionArea';
import { useClearSelection } from '@/composables/useClearSelection';
import { useCanvasTransform } from '@/composables/useCanvasTransform';
import { useContextMenuStore } from "@/stores/context-menu";

import ActivatorTree from '@/components/graph/ActivatorTree.vue'
import GraphRenderer from '@/components/graph/GraphRenderer.vue'
import SelectionBorder from '@/components/graph/SelectionBorder.vue'
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store';
import { useGraph } from '@/stores/graph-store';
import { useSelectionStore } from '@/stores/selection-store';

const { onMouseDown: onSelMouseDown, selecting, x, y, width, height } = useSelectionArea();
const clearSelection = useClearSelection();
const menu = useContextMenuStore()
const { activatorTree } = useGraphNodeActivatorCollection();
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
  pointerEvents: selecting.value ? 'none' : 'all'
}));

function onMouseDown(event: MouseEvent) {
  onPanMouseDown(event);
  onSelMouseDown(event);
  clearSelection.onClickClearSelection(event);
}

function onCanvasDblClick(evt: MouseEvent) {
  if (evt.target !== containerRef.value) return;

  menu.open(evt);
}

function deleteSelectedNodes(evt: KeyboardEvent) {
  if (evt.key != 'Delete') {
    return;
  }

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

.context-panel {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  background-color: rgb(63, 63, 63);
}
</style>
