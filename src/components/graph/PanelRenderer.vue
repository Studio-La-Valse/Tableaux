<template>
  <div class="background" :style="[borderStyle, panelStyle]" :title="graphNode.innerNode.errorMessage || ''">
    <!-- Title -->
    <div class="title">
      <p>{{ graphNode.innerNode.path[graphNode.innerNode.path.length - 1] }}</p>
    </div>

    <!-- Main Content Panel -->
    <div class="content" :style="contentStyle">
      <component :is="getGraphNodePanel(graphNode.innerNode)" :graphNode="graphNode.innerNode" />

      <div class="inputs">
        <GraphNodeInputRenderer v-for="(input, index) in graphNode.innerNode.inputs" :key="'input-' + index"
          :input="input" :positionY="getRelativePosition(input).y" :graphNode="graphNode.innerNode" />
      </div>

      <div class="outputs">
        <GraphNodeOutputRenderer v-for="(output, index) in graphNode.innerNode.outputs" :key="'output-' + index"
          :output="output" :positionY="getRelativePosition(output).y" />
      </div>
    </div>


  </div>
  <details v-if="graphNode.innerNode.errorMessage" class="error-details" @mousedown.stop>
    <summary>⚠️ Error</summary>
    <p>{{ graphNode.innerNode.errorMessage }}</p>
  </details>
</template>

<script setup lang="ts">
import { computed, type Component, type StyleValue } from "vue";

import GraphNodeInputRenderer from "./GraphNodeInputRenderer.vue";
import GraphNodeOutputRenderer from "./GraphNodeOutputRenderer.vue";

import { useGraphNodeSelectionStore } from "@/stores/use-graph-node-selection-store";

import type { GraphNode } from "@/graph/core/graph-node";
import type { GraphNodeWrapper } from "@/graph/core/graph-node-wrapper";
import { GraphNodeInput } from "@/graph/core/graph-node-input";
import { GraphNodeOutput } from "@/graph/core/graph-node-output";
import { useGraphNodePanelStore } from "@/stores/use-graph-node-panel-store";

const { isSelected } = useGraphNodeSelectionStore()
const { getPanel } = useGraphNodePanelStore()

const props = defineProps<{
  graphNode: GraphNodeWrapper,
  panelStyle: StyleValue
}>();

const borderColor = computed(() => {
  switch (props.graphNode.innerNode.componentState) {
    case "armed":
      return "linear-gradient(90deg, var(--vt-armed-1), var(--vt-armed-2))"
    case "error":
      return "linear-gradient(90deg, var(--vt-error-1), var(--vt-error-2))"
    case "complete":
      return "linear-gradient(90deg, var(--vt-complete-1), var(--vt-complete-2))"
    default:
      return "linear-gradient(90deg, var(--vt-error-1), var(--vt-error-2))"
  }
})

const shadowColor = computed(() => {
  switch (props.graphNode.innerNode.componentState) {
    case "armed":
      return "--vt-armed-1"
    case "error":
      return "--vt-error-1"
    case "complete":
      return "--vt-complete-1"
    default:
      return "#ccc"
  }
})

// Determines visual styling based on whether the node is selected.
const _isSelected = computed(() => isSelected(props.graphNode.innerNode.id));

const borderStyle = computed(() => ({
  '--gradient-border': borderColor.value,
  boxShadow: _isSelected.value ? `0 0 12px 4px var(${shadowColor.value})` : ''

}))

const contentStyle = computed<StyleValue>(() => ({
  minWidth: props.graphNode.minWidth + 'px',
  minHeight: props.graphNode.minHeight + 'px',
  width: props.graphNode.width + 'px',
  height: props.graphNode.height + 'px'
}))

const getGraphNodePanel = (node: GraphNode): Component => {
  return getPanel(node);
};

const getRelativePosition = (handle: GraphNodeInput | GraphNodeOutput) => {
  const x = handle instanceof GraphNodeInput ? props.graphNode.xy.x : props.graphNode.xy.x + props.graphNode.width;
  const number = handle instanceof GraphNodeInput ? props.graphNode.innerNode.inputs.length : props.graphNode.innerNode.outputs.length;
  const y = props.graphNode.calculateHandleHeight(handle.index, number);
  return { x, y }
}
</script>

<style scoped>
.title {
  position: absolute;
  top: -25px;
  left: 25px
}

.background {
  position: relative;
  box-sizing: border-box;
  overflow: visible;
  border-radius: 10px;
}

.background::before {
  content: "";
  position: absolute;
  inset: -2px;
  /* expands the area OUTSIDE by 2px */
  border-radius: 10px;
  /* should be slightly more than the .background's radius */
  background: var(--gradient-border);
}

/* Place the input ports inside the node on the left side */
.inputs,
.outputs {
  position: absolute;
  top: 0;
  width: 30px;
  height: 100%;
}

.inputs {
  left: -12px;
}

/* Place the output ports inside the node on the right side */
.outputs {
  right: -12px;
}

/* Adjust the main content to account for the port panels */
.content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: visible;
  border-radius: 8px;
  background-color: var(--color-background-mute);
}

.error-details {
  max-width: 100%;
  width: 100%;
  padding: 6px 10px;
  box-sizing: border-box;
  color: var(--color-text);
  font-size: 14px;
  margin-top: 8px;
  border: 1px solid var(--color-border-hover);
  border-radius: 4px;
}

.error-details summary {
  cursor: pointer;
  font-weight: bold;
  outline: none;
}
</style>
