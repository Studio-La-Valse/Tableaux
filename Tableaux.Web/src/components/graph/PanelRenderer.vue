<template>
  <div ref="resizableRef" class="resizable" :style="style">

    <!-- Main Content Panel -->
    <div class="content">
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

    <!-- Resizer for the bottom right corner -->
    <div class="resizer" @pointerdown="initResize"></div>
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
import { GraphNodeWrapper, useGraph } from "@/stores/graph-store";
import { useResizable } from "@/composables/useResizable";

const { getNode } = useGraph();
const props = defineProps({
  graphNode: {
    type: Object as () => GraphNodeWrapper,
    required: true,
  },
});

const borderColor = computed(() => {
  switch (props.graphNode.innerNode.componentState) {
    case "armed":
      return "linear-gradient(90deg, #fc8803, #ecfc03)"
    case "error":
      return "linear-gradient(90deg, #fc2003, #fc8403)"
    case "complete":
      return "linear-gradient(90deg, #a9fc03, #03fc90)"
    case "calculating":
      return "linear-gradient(90deg, #03fcc6, #03fcc6)"
    default:
      return "#ccc"
  }
})

const style = computed<StyleValue>(() => ({
  width: width.value + 'px',
  height: height.value + 'px',
  background: borderColor.value
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

// Create computed reactive dimensions that read/write the graph node's properties.
const width = computed({
  get: () => graphNode.width,
  set: (val) => {
    graphNode.width = val;
  },
});
const height = computed({
  get: () => graphNode.height,
  set: (val) => {
    graphNode.height = val;
  },
});

// Integrate the resizable composable.
const { initResize } = useResizable(width, height);

// (The onUnmounted cleanup in the composable will handle any lingering event listeners.)
</script>

<style scoped>
.resizable {
  position: relative;
  box-sizing: border-box;
  overflow: visible;
  background: var(--color-background-mute);
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 10px;
}

/* Place the input ports inside the node on the left side */
.inputs {
  position: absolute;
  left: -12px;
  top: 0;
  width: 30px;
  height: 100%;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/* Place the output ports inside the node on the right side */
.outputs {
  position: absolute;
  right: -12px;
  top: 0;
  width: 30px;
  height: 100%;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/* Adjust the main content to account for the port panels */
.content {
  position: relative;
  margin: 0 2px;
  width: calc(100% - 4x);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--color-background-mute);
}

/* Resizer styling remains unchanged */
.resizer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background-color: 'transparant';
  cursor: se-resize;
  border-radius: 6px;
}
</style>
