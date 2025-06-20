<template>
  <div class="node-port input-port" @mousedown.stop>
    <HandleRenderer />
    <div class="label">
      <span>{{ input.inputIndex }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GraphNodeInput } from '@/models/graph/core/graph-node-input';
import HandleRenderer from './HandleRenderer.vue';

defineProps<{
  input: GraphNodeInput;
}>();
</script>

<style scoped>
.node-port {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 2px;
  box-sizing: border-box;
}

.input-port {
  flex-direction: row;
}

/* The label is now snug within the port’s container */
.label {
  font-size: 10px;
  color: #333;
  margin-left: 4px;
}
</style>
