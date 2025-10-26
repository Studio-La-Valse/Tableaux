<template>
  <div class="node" @mousedown="(e) => onMouseDown(e, graphNode.nodeId)" :style="style">
    <PanelRenderer :graphNode="graphNode" :panel-style="panelStyle" />
  </div>
</template>

<script setup lang="ts">
  import { computed, type StyleValue } from 'vue';
  import PanelRenderer from './PanelRenderer.vue';
  import { useNodeSelectionAndDrag } from '@/composables/use-node-selection-and-drag';
  import { type XY } from '@/geometry/xy';
  import type { IGraphNodeWrapper } from '@/graph/core/graph-node-wrapper';

  const props = defineProps<{ graphNode: IGraphNodeWrapper }>();
  const { onMouseDown } = useNodeSelectionAndDrag();

  const localPos = computed<XY>(() => props.graphNode.xy);

  const style = computed<StyleValue>(() => ({
    transform: `translate(${localPos.value.x}px, ${localPos.value.y}px)`,
    borderRadius: '10px',
  }));

  const panelStyle = computed<StyleValue>(() => ({
    width: props.graphNode.width + 'px',
    height: props.graphNode.height + 'px',
  }));
</script>

<style scoped>
  .node {
    position: absolute;
    user-select: none;
  }
</style>
