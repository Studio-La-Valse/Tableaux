<template>
  <div class="node graph-node" :class="{ selected: isSelected }" @mousedown="onMouseDown"
    :style="{ transform: `translate(${localPos.x}px, ${localPos.y}px)` }">
    <PanelRenderer :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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

.selected {
  border-radius: 10px;
  box-shadow:
    0 0 0 2px var(--color-accent),
    0 0 12px 4px var(--color-accent)
}
</style>
