<template>
  <div class="outer" :style="style">
    <slot></slot>

    <!-- Resizer for the bottom right corner -->
    <div class="resizer" @pointerdown="initResize"></div>
  </div>
</template>

<script setup lang="ts">
import { useNodeResize } from "@/composables/use-node-resize";
import { computed, type StyleValue } from 'vue';
import { useGraphStore } from '@/stores/use-graph-store';

// `defineProps` gives you a typed `graphNode` in your template
const props = defineProps<{
  graphNodeId: string
}>()

const graphNode = useGraphStore().getNode(props.graphNodeId)

// Create computed reactive dimensions that read/write the graph node's properties.
const width = computed({
  get: () => graphNode.width,
  set: (val) => {
    graphNode.width = val;
  },
});
const height = computed({
  get: () => graphNode.height,
  set: (val) => {
    graphNode.height = val;
  },
});

const style = computed<StyleValue>(() => ({
  width: width.value + 'px',
  height: height.value + 'px',
}))

// Integrate the resizable composable.
const { initResize } = useNodeResize(width, height);
</script>

<style>
.outer {
  /* Fill available space in the parent */
  height: 100%;
  width: 100%;
  overflow-y: auto;

  /* Flex layout helps with centering */
  display: flex;
  flex-direction: column;
  padding: 8px;
}

/* Resizer styling remains unchanged */
.resizer {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background-color: transparent;
  cursor: se-resize;
  z-index: 1
}
</style>
