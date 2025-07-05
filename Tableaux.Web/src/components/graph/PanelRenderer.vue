<template>
  <div class="background" :style="borderStyle">
    <!-- Title -->
    <div class="title">
      <p>{{ graphNode.path[graphNode.path.length - 1] }}</p>
    </div>

    <!-- Main Content Panel -->
    <div class="content" :style="contentStyle">
      <component :is="getGraphNodePanel(graphNode.innerNode)" :graphNode="graphNode.innerNode" />
    </div>

    <!-- Input Ports rendered via our renderer component -->
    <div class="inputs" v-if="graphNode.inputs && graphNode.inputs.length">
      <GraphNodeInputRenderer v-for="(input, index) in graphNode.inputs" :key="'input-' + index" :input="input" />
    </div>

    <!-- Output Ports rendered via our renderer component -->
    <div class="outputs" v-if="graphNode.outputs && graphNode.outputs.length">
      <GraphNodeOutputRenderer v-for="(output, index) in graphNode.outputs" :key="'output-' + index" :output="output" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type StyleValue, type Component } from "vue";
import NumberEmitterPanel from "./Nodes/NumberEmitter.vue";
import TextEmitterPanel from "./Nodes/TextEmitter.vue";
import GraphNodePanel from "./GraphNodePanel.vue";
import LoggerPanel from "./Nodes/LoggerPanel.vue";
import GraphNodeInputRenderer from "./GraphNodeInputRenderer.vue";
import GraphNodeOutputRenderer from "./GraphNodeOutputRenderer.vue";
import type { GraphNode } from "@/models/graph/core/graph-node";
import { useGraph } from "@/stores/graph-store";
import { useSelectionStore } from "@/stores/selection-store";
import type { GraphNodeWrapper } from "@/models/graph/core/graph-node-wrapper";

const { getNode } = useGraph();
const { isSelected } = useSelectionStore()

const props = defineProps({
  graphNode: {
    type: Object as () => GraphNodeWrapper,
    required: true,
  },
});

const borderColor = computed(() => {
  switch (props.graphNode.innerNode.componentState) {
    case "armed":
      return "linear-gradient(90deg, var(--vt-armed-1), var(--vt-armed-2))"
    case "error":
      return "linear-gradient(90deg, var(--vt-error-1), var(--vt-error-2))"
    case "complete":
      return "linear-gradient(90deg, var(--vt-complete-1), var(--vt-complete-2))"
    case "calculating":
      return "linear-gradient(90deg, var(--vt-calculating-1), var(--vt-calculating-2))"
    default:
      return "linear-gradient(90deg, var(--vt-error-1), var(--vt-error-2))"
  }
})

const shadowColor = computed(() => {
  switch (graphNode.innerNode.componentState) {
    case "armed":
      return "--vt-armed-1"
    case "error":
      return "--vt-error-1"
    case "complete":
      return "--vt-complete-1"
    case "calculating":
      return "--vt-calculating-1"
    default:
      return "#ccc"
  }
})

// Determines visual styling based on whether the node is selected.
const _isSelected = computed(() => isSelected(props.graphNode.id));

const borderStyle = computed(() => ({
  '--gradient-border': borderColor.value,
    boxShadow: _isSelected.value ? `0 0 12px 4px var(${shadowColor.value})` : ''

}))

const contentStyle = computed<StyleValue>(() => ({
  minWidth: graphNode.minWidth + 'px',
  minHeight: graphNode.minHeight + 'px',
  width: graphNode.width + 'px',
  height: graphNode.height + 'px'
}))

// Get the reactive graph node instance.
const graphNode = getNode(props.graphNode.id);

// Registry to resolve the proper node panel based on the graph node type.
const registry: Record<string, Component> = {
  NumberEmitter: NumberEmitterPanel,
  TextEmitter: TextEmitterPanel,
  Logger: LoggerPanel,
  // Other emitter types can be added here.
};

const getGraphNodePanel = (emitter: GraphNode) => {
  // Identifying the type via the constructor name.
  const type = emitter.constructor.name;
  return registry[type] || GraphNodePanel;
};
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
  inset: -2px; /* expands the area OUTSIDE by 2px */
  border-radius: 10px; /* should be slightly more than the .background's radius */
  background: var(--gradient-border);
}

/* Place the input ports inside the node on the left side */
.inputs, .outputs {
  position: absolute;
  top: 0;
  width: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-top: 8px;
  padding-bottom: 8px;
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
</style>
