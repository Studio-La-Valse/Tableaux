<template>
  <div class="panel" @dblclick.stop="dblclick">
    <p>IIII</p>
  </div>

  <Teleport to="body">
    <CustomNodeComponent
      v-if="visible"
      :initial-data="initialData"
      :mode="'edit'"
      @close="() => (visible = false)"
      @save="update"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import CustomNodeComponent from '../CustomNode/CustomNodeModal.vue';
  import {
    createCustomNode,
    type CustomNodeDefinition,
  } from '@/graph/graph-nodes/json/dynamic-graph-node';
  import type { GraphNode } from '@/graph/core/graph-node';
  import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry';

  const graphNodeRegistry = useGraphNodeRegistry();

  const props = defineProps<{
    graphNode: GraphNode;
  }>();

  const visible = ref(false);
  const initialData = computed(
    () => graphNodeRegistry.getDefinition(props.graphNode.path)?.customTemplate
  );

  const dblclick = () => {
    visible.value = true;
  };

  const update = (def: CustomNodeDefinition) => {
    createCustomNode(def);
  };
</script>

<style lang="css" scoped></style>
