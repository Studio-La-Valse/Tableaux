<template>
  <div
    class="node graph-node"
    :class="{ selected: isSelected }"
    @mousedown="onMouseDown"
    :style="{ transform: `translate(${localPos.x}px, ${localPos.y}px)` }"
  >
    <PanelRenderer :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PanelRenderer from "./PanelRenderer.vue";
import type { GraphNode } from "@/models/graph/core/graph-node";
import { useSelectionStore } from "@/stores/selection-store";
import { useGroupDraggable } from "@/composables/useGroupDraggable";
import { XY } from "@/models/geometry/xy";

const props = defineProps<{ graphNode: GraphNode }>();

const selectionStore = useSelectionStore();

// Node position is kept in sync with the graph node.
const localPos = computed<XY>({
  get: () => new XY(props.graphNode.x, props.graphNode.y),
  set: (pos: XY) => {
    props.graphNode.x = pos.x;
    props.graphNode.y = pos.y;
  },
});

// Determines visual styling based on whether the node is selected.
const isSelected = computed(() => selectionStore.isSelected(props.graphNode.id));

// Use the updated group draggable composable; it now handles modifier-based selection on mousedown.
const { onMouseDown } = useGroupDraggable(props.graphNode.id);
</script>

<style scoped>
.node {
  position: absolute;
  user-select: none;
}

.selected {
  outline: 2px solid blue;
}
</style>
