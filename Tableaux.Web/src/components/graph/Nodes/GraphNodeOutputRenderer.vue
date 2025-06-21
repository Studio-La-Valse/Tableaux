<!-- src/components/GraphNodeOutputRenderer.vue -->
<template>
  <div class="node-port output-port">
    <div class="label">
      <span>{{ output.outputIndex }}</span>
    </div>
    <HandleRenderer />
  </div>
</template>

<script setup lang="ts">
import HandleRenderer from './HandleRenderer.vue';
import type { GraphNodeOutput } from '@/models/graph/core/graph-node-output';

defineProps<{
  output: GraphNodeOutput; // Expected to include properties: nodeId and outputIndex
}>();

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
  color: #333;
}
</style>
