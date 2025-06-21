<!-- src/components/GraphNodeInputRenderer.vue -->
<template>
  <div class="node-port input-port">
    <HandleRenderer />
    <div class="label">
      <span>{{ input.inputIndex }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import HandleRenderer from './HandleRenderer.vue';
import type { GraphNodeInput } from '@/models/graph/core/graph-node-input';

defineProps<{
  input: GraphNodeInput; // Expected to include nodeId and inputIndex
}>();

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
