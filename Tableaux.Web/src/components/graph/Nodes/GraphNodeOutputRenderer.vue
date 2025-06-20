<template>
  <div class="node-port output-port" @mousedown.stop>
    <div class="label">
      <span>{{ output.outputIndex }}</span>
    </div>
    <HandleRenderer />
  </div>
</template>

<script setup lang="ts">
import { GraphNodeOutput } from '@/models/graph/core/graph-node-output';
import HandleRenderer from './HandleRenderer.vue';

defineProps<{
  output: GraphNodeOutput;
}>();
</script>

<style scoped>
.node-port {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 2px;
  box-sizing: border-box;
}

.output-port {
  flex-direction: row;
}

/* The label is maintained inside the port container */
.label {
  font-size: 10px;
  color: #333;
  margin-right: 4px;
}
</style>
