<template>
  <div class="page">
    <GraphControls />

    <!-- Split mode -->
    <PanelGroup
      v-if="mode === 'split'"
      direction="horizontal"
    >
      <Panel :default-size="70">
        <div
          ref="viewportRef"
          class="canvas-container"
          @contextmenu.prevent
          @dblclick.prevent="onCanvasDblClick"
          @mousedown="onMouseDown"
          @wheel="canvasTransform.onWheel"
        >
          <div
            ref="canvasRef"
            class="canvas-content"
            :style="contentStyle"
          >
            <GraphRenderer />

            <SelectionBorder />
          </div>

          <Teleport to="body">
            <ActivatorTree />
          </Teleport>
        </div>
      </Panel>

      <PanelResizeHandle class="gutter" />

      <Panel :default-size="30">
        <ControlsComponent />
      </Panel>
    </PanelGroup>

    <!-- Graph only -->
    <div
      v-else-if="mode === 'graph'"
      ref="viewportRef"
      class="canvas-container"
      @contextmenu.prevent
      @dblclick.prevent="onCanvasDblClick"
      @mousedown="onMouseDown"
      @wheel="canvasTransform.onWheel"
    >
      <div
        ref="canvasRef"
        class="canvas-content"
        :style="contentStyle"
      >
        <GraphRenderer />

        <SelectionBorder />
      </div>

      <Teleport to="body">
        <ActivatorTree />
      </Teleport>
    </div>

    <!-- Controls only -->
    <ControlsComponent
      v-else-if="mode === 'controls'"
      class="controls-only"
    />
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted } from 'vue'

import { Panel, PanelGroup, PanelResizeHandle } from 'vue-resizable-panels'
import GraphControls from '@/components/graph/GraphControls/GraphControls.vue'
import GraphRenderer from '@/components/graph/GraphRenderer.vue'
import ActivatorTree from '@/components/graph/NodeBrowser/ActivatorTree.vue'

import SelectionBorder from '@/components/graph/SelectionBorder.vue'
import { useCanvasTransform } from '@/composables/use-canvas-transform'
import { useClearSelection } from '@/composables/use-clear-selection'

import { useSelectionArea } from '@/composables/use-selection-area'
import { useContextMenuStore } from '@/stores/use-context-menu-store'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useGraphStore } from '@/stores/use-graph-store'
import ControlsComponent from '../controls/ControlsComponent.vue'

const selectionArea = useSelectionArea()
const clearSelection = useClearSelection()
const menu = useContextMenuStore()
const selection = useGraphNodeSelectionStore()
const graph = useGraphStore()
const canvasTransform = useCanvasTransform()
const canvasStore = useGraphCanvasStore()

const { mode, viewportRef, canvasRef } = storeToRefs(canvasStore)

// merge pointer‐events with zoomStyle
const contentStyle = computed<StyleValue>(() => ({
  ...canvasTransform.style.value,
  pointerEvents: selectionArea.selecting.value ? 'none' : 'all',
}))

function onMouseDown(event: MouseEvent) {
  canvasTransform.onMouseDown(event)
  selectionArea.onMouseDown(event)
  clearSelection.onMouseDown(event)

  menu.close()
}

function onCanvasDblClick(evt: MouseEvent) {
  if (evt.target !== viewportRef.value)
    return

  menu.open(evt)
}

function deleteSelectedNodes(evt: KeyboardEvent) {
  if (evt.key !== 'Delete')
    return

  graph.removeNodes([...selection.selectedNodes])
  selection.clearSelection()
}

onMounted(() => {
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
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Gutters */
.gutter {
  flex-shrink: 0;
}

/* Horizontal handles */
:deep(.gutter) {
  width: 2px;
  background-color: var(--color-border-hover);
  cursor: col-resize;
}

:deep(.gutter:hover) {
  background-color: var(--color-accent);
}

:deep(.PanelGroup[direction="horizontal"] .gutter) {
  cursor: col-resize;
  width: 8px;
}
</style>
