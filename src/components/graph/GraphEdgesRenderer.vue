<template>
  <div class="edges-container">
    <!-- Permanent edges -->
    <GraphEdgeRenderer
      v-for="edge in graph.edges"
      :key="edge.id"
      :edge="edge"
    />

    <!-- Temporary (drag) edge -->
    <GraphEdgePathRenderer
      v-if="tempEdge"
      class="temp-edge-svg"
      :x1="dragStart.x"
      :y1="dragStart.y"
      :x2="dragEnd.x"
      :y2="dragEnd.y"
      stroke="grey"
      :stroke-width="1"
    />

    <!-- Temporary (reconnect) edges -->
    <div v-for="tempReconnect in tempEdges" :key="tempReconnect.toNodeId">
      <GraphEdgePathRenderer
        class="temp-edge-svg"
        :x1="tempReconnect.currentX"
        :y1="tempReconnect.currentY"
        :x2="endX(tempReconnect.toNodeId)"
        :y2="endY(tempReconnect.toNodeId, tempReconnect.toInputIndex)"
        stroke="grey"
        :stroke-width="1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import GraphEdgeRenderer from './GraphEdgeRenderer.vue';
  import GraphEdgePathRenderer from './GraphEdgePathRenderer.vue';
  import { useGraphStore } from '@/stores/use-graph-store';
  import { useEdgeDrag } from '@/composables/use-edge-drag'; // your new unified composable
  import { useEdgeReconnect } from '@/composables/use-edge-reconnect';

  const graph = useGraphStore();
  const { tempEdge } = useEdgeDrag();

  const edgeReconnect = useEdgeReconnect();
  const tempEdges = edgeReconnect.tempEdges;

  // Helpers to get port coordinates
  function getOutputX(nodeId: string) {
    const node = graph.getNode(nodeId);
    return node.xy.x + (node.width ?? 150);
  }
  function getOutputY(nodeId: string, outputIndex: number) {
    const node = graph.getNode(nodeId);
    return node.calculateHandleCoordinate(
      outputIndex,
      node.innerNode.outputs.length
    );
  }
  function getInputX(nodeId: string) {
    return graph.getNode(nodeId).xy.x;
  }
  function getInputY(nodeId: string, inputIndex: number) {
    const node = graph.getNode(nodeId);
    return node.calculateHandleCoordinate(
      inputIndex,
      node.innerNode.inputs.length
    );
  }

  // Compute drag start/end points based on direction
  const dragStart = computed(() => {
    if (!tempEdge.value) return { x: 0, y: 0 };
    if (tempEdge.value.direction === 'forward') {
      return {
        x: getOutputX(tempEdge.value.fromNodeId!),
        y: getOutputY(
          tempEdge.value.fromNodeId!,
          tempEdge.value.fromOutputIndex!
        ),
      };
    } else {
      return {
        x: tempEdge.value.currentX,
        y: tempEdge.value.currentY,
      };
    }
  });

  const dragEnd = computed(() => {
    if (!tempEdge.value) return { x: 0, y: 0 };
    if (tempEdge.value.direction === 'forward') {
      return {
        x: tempEdge.value.currentX,
        y: tempEdge.value.currentY,
      };
    } else {
      return {
        x: getInputX(tempEdge.value.toNodeId!),
        y: getInputY(tempEdge.value.toNodeId!, tempEdge.value.toInputIndex!),
      };
    }
  });

  // Still used for tempEdges (plural)
  const endX = (targetNodeId: string) => getInputX(targetNodeId);
  const endY = (targetNodeId: string, targetInputIndex: number) =>
    getInputY(targetNodeId, targetInputIndex);
</script>

<style scoped>
  .edges-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .temp-edge-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
</style>
