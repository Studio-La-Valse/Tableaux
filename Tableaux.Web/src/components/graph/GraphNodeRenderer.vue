<template>
  <div class="node graph-node" @mousedown="onMouseDown"
    :style="style">
    <PanelRenderer :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from "vue";
import PanelRenderer from "./PanelRenderer.vue";
import { useSelectionStore } from "@/stores/selection-store";
import { useGroupDraggable } from "@/composables/useGroupDraggable";
import { XY } from "@/models/geometry/xy";
import { useGraph } from "@/stores/graph-store";

const groupDrag = useGroupDraggable();
const selectionStore = useSelectionStore();

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

const borderColor = computed(() => {
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

const style = computed<StyleValue>(() => ({
  transform: `translate(${localPos.value.x}px, ${localPos.value.y}px)`,
  borderRadius: '10px',
  boxShadow: isSelected.value ? `0 0 12px 4px var(${borderColor.value})` : ''
}))

// Determines visual styling based on whether the node is selected.
const isSelected = computed(() => selectionStore.isSelected(props.graphNodeId));
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
