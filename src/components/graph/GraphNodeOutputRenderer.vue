<template>
  <div class="node-port output-port" @mousedown.stop="handleMouseDown">
    <div class="label">
      <span>{{ output.description[0] }}</span>
    </div>
    <HandleRenderer :description="output.description"/>
  </div>
</template>

<script setup lang="ts">
import { useEdgeDrag } from '@/composables/useEdgeDrag';
import HandleRenderer from './HandleRenderer.vue';
import type { GraphNodeOutput } from '@/models/graph/core/graph-node-output';

const props = defineProps<{
  output: GraphNodeOutput; // assumed properties: nodeId and outputIndex
}>();

const { startEdgeDrag } = useEdgeDrag();

function handleMouseDown(e: MouseEvent) {
  // Start the drag using the node's id and the output index.
  startEdgeDrag(props.output.graphNode.id, props.output.index, e);
}
</script>

<style scoped>
.node-port {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
}

.output-port {
  flex-direction: row;
}

.label {
  font-size: 10px;
  padding-right: 3px;
  color: var(--color-text);
}
</style>
