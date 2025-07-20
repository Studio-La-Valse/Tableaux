<template>
  <div class="node" @mousedown="onMouseDown" :style="style">
    <PanelRenderer :graphNode="graphNode" :panel-style="panelStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from "vue";
import PanelRenderer from "./PanelRenderer.vue";
import { useNodeSelectionAndDrag } from "@/composables/use-node-selection-and-drag";
import { XY } from "@/models/geometry/xy";
import { useGraph } from "@/stores/graph-store";

const groupDrag = useNodeSelectionAndDrag();

const props = defineProps<{ graphNodeId: string }>();
const graphNode = useGraph().getNode(props.graphNodeId);

// Node position is kept in sync with the graph node.
const localPos = computed<XY>({
  get: () => new XY(graphNode.x, graphNode.y),
  set: (pos: XY) => {
    graphNode.x = pos.x;
    graphNode.y = pos.y;
  },
});

const style = computed<StyleValue>(() => ({
  transform: `translate(${localPos.value.x}px, ${localPos.value.y}px)`,
  borderRadius: '10px',
}))

const panelStyle = computed<StyleValue>(() => ({
  width: graphNode.width + "px",
  height: graphNode.height + "px",
}));

// Determines visual styling based on whether the node is selected.
const onMouseDown = (evt: MouseEvent) => {
  groupDrag.onMouseDown(evt, props.graphNodeId)
}
</script>

<style scoped>
.node {
  position: absolute;
  user-select: none;
}
</style>
