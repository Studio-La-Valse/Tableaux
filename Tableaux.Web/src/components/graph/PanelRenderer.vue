<template>
  <div
    ref="resizableRef"
    class="resizable"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <!-- Input Ports rendered via our renderer component -->
    <div class="inputs" v-if="graphNode.inputs && graphNode.inputs.length">
      <GraphNodeInputRenderer
        v-for="(input, index) in graphNode.inputs"
        :key="'input-' + index"
        :input="input"
      />
    </div>

    <!-- Output Ports rendered via our renderer component -->
    <div class="outputs" v-if="graphNode.outputs && graphNode.outputs.length">
      <GraphNodeOutputRenderer
        v-for="(output, index) in graphNode.outputs"
        :key="'output-' + index"
        :output="output"
      />
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
import { onUnmounted, computed, type Component } from "vue";
import NumberEmitterPanel from "./Nodes/NumberEmitter.vue";
import TextEmitterPanel from "./Nodes/TextEmitter.vue";
import GraphNodePanel from "./Nodes/GraphNodePanel.vue";
import LoggerPanel from "./Nodes/LoggerPanel.vue";
import GraphNodeInputRenderer from "./Nodes/GraphNodeInputRenderer.vue";
import GraphNodeOutputRenderer from "./Nodes/GraphNodeOutputRenderer.vue";
import type { GraphNode } from "@/models/graph/core/graph-node";
import { useGraph } from "@/stores/graph-store";
import { useResizable } from "@/composables/useResizable";

const { getNode } = useGraph();
const props = defineProps({
  graphNode: {
    type: Object as () => GraphNode,
    required: true,
  },
});

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
  border: 2px solid #ccc;
  box-sizing: border-box;
  overflow: visible;
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
  overflow: hidden;
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
