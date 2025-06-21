<!-- src/components/GraphNodeInputRenderer.vue -->
<template>
  <div class="node-port input-port" @mousedown.stop @mouseup="handleMouseUp">
    <HandleRenderer />
    <div class="label">
      <span>{{ input.inputIndex }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import HandleRenderer from './HandleRenderer.vue';
import type { GraphNodeInput } from '@/models/graph/core/graph-node-input';
import { useEdgeDrag } from '@/composables/useEdgeDrag';
import { useGraph } from '@/stores/graph-store';

const props = defineProps<{
  input: GraphNodeInput;
}>();

const { finishEdgeDrag } = useEdgeDrag();
const { connect } = useGraph();
const handleMouseUp = () => {
  const prototype = finishEdgeDrag(props.input.graphNode.id, props.input.inputIndex)
  if (prototype) {
    connect(
      prototype.fromNodeId,
      prototype.fromOutputIndex,
      prototype.toNodeId,
      prototype.toInputIndex
    )
  }
}
</script>

<style scoped>
.node-port {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.input-port {
  flex-direction: row;
}

.label {
  font-size: 10px;
  color: #333;
}
</style>
