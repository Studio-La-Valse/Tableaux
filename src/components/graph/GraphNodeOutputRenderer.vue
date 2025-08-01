<template>
  <div class="node-port output-port" :style="{ top: positionY + 'px' }" @mousedown.stop="handleMouseDown">
    <div class="label">
      <span>{{ output.description[0] }}</span>
    </div>
    <HandleRenderer :description="output.description" />
  </div>
</template>

<script setup lang="ts">
import { useEdgeDrag } from '@/composables/use-edge-drag';
import HandleRenderer from './HandleRenderer.vue';
import type { GraphNodeOutput } from '@/graph/core/graph-node-output';

const props = defineProps<{
  output: GraphNodeOutput;
  positionY: number;
}>();

const { startConnect } = useEdgeDrag();

function handleMouseDown(e: MouseEvent) {
  // Start the drag using the node's id and the output index.
  startConnect(props.output.graphNode.id, props.output.index, e);
}
</script>

<style scoped>
.node-port {
  position: absolute;
  transform: translate(0%, -50%);
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
