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
import type { IGraphNodeOutput } from '@/graph/core/graph-node-output';
import { useEdgeReconnect } from '@/composables/use-edge-reconnect';

const props = defineProps<{
  output: IGraphNodeOutput;
  positionY: number;
}>();

const { startConnect, finishConnect, tempEdge } = useEdgeDrag();
const { tempEdges, startReconnect, finishReconnect } = useEdgeReconnect();

function handleMouseDown(e: MouseEvent) {
  const fromId = props.output.graphNodeId
  const outputIndex = props.output.index

  if (tempEdges.value.length) {
    // Finish the reconnect has heighest priority
    finishReconnect(fromId, outputIndex, e)
  }
  else if (tempEdge.value) {
    finishConnect(fromId, outputIndex, e)
  }
  else if (e.ctrlKey || e.metaKey) {
    // Start the reconnect of existing edges
    startReconnect(fromId, outputIndex, e)
  } else {
    // Start the drag using the node's id and the output index.
    startConnect('forward', fromId, outputIndex, e);
  }
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
