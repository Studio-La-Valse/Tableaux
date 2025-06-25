<template>
  <div ref="containerRef" class="canvas-container" @dblclick="onCanvasDblClick" @mousedown="onMouseDown" @contextmenu.prevent @wheel="onWheel">
    <div ref="contentRef" class="canvas-content" :style="contentStyle">
      <SelectionBorder :selecting="selecting" :x="x" :y="y" :width="width" :height="height" />
      <GraphRenderer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue';
import { useSelectionArea } from '@/composables/useSelectionArea';
import { useClearSelection } from '@/composables/useClearSelection';
import { useCanvasTransform } from '@/composables/useCanvasTransform';

import GraphRenderer from '@/components/graph/GraphRenderer.vue'
import SelectionBorder from '@/components/graph/SelectionBorder.vue'

const { onMouseDown: onSelMouseDown, selecting, x, y, width, height } = useSelectionArea();
const clearSelection = useClearSelection();

// pull in all pan/zoom refs & handlers
const {
  containerRef,
  contentRef,
  position,
  scale,
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
  clearSelection.onClickClearSelection(event);
  onSelMouseDown(event);
  onPanMouseDown(event);
}

function onCanvasDblClick(evt: MouseEvent) {
  // ex: reset viewport
  position.value.x = 0
  position.value.y = 0
  scale.value = 1

  console.log('double-clicked at', evt.clientX, evt.clientY)
}
</script>

<style lang="css" scoped>
.canvas-container {
  overflow: hidden;
}
</style>