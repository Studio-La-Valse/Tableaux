<template>
  <div class="emitter-graph">
    <component v-for="(graphNode, index) in emitters" :key="index" :is="getGraphNodePanel(graphNode)"
      :graphNode="graphNode" />
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue';
import NumberEmitterPanel from './Nodes/NumberEmitter.vue';
import TextEmitterPanel from './Nodes/TextEmitter.vue';
import GraphNodePanel from './Nodes/GraphNodePanel.vue';
import type { GraphNode } from '@/models/graph/core/graph-node';
import LoggerPanel from './Nodes/LoggerPanel.vue';

defineProps({
  emitters: {
    type: Array as () => GraphNode[],
    required: true,
  }
})

const registry: Record<string, Component> = {
      NumberEmitter: NumberEmitterPanel,
      TextEmitter: TextEmitterPanel,
      Logger: LoggerPanel
      // Other emitter types can be added here.
    };

const getGraphNodePanel = (emitter: GraphNode) => {
      // constructor.name may fail when minimized.. We'll see. :) 
      const type = emitter.constructor.name;
      return registry[type] || GraphNodePanel;
    }

</script>
