<template>
  <div class="panel" @dblclick.stop="dblclick">
    <p>IIII</p>
  </div>

  <Teleport to="body">
    <CustomNodeComponent
      v-if="visible"
      :initial-data="graphNode.data as CustomNodeDefinition"
      @close="() => (visible = false)"
      @save="update"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CustomNodeComponent from '../CustomNode/CustomNodeComponent.vue';
  import { type CustomNodeDefinition } from '@/graph/graph-nodes/json/dynamic-graph-node';
  import { useGraphStore } from '@/stores/use-graph-store';
  import { useCustomNodeRegistry } from '@/stores/use-custom-node-registry-store';
  import type { GraphNode } from '@/graph/core/graph-node';

  const graphStore = useGraphStore();
  const customNodeRegistry = useCustomNodeRegistry();

  const props = defineProps<{
    graphNode: GraphNode;
  }>();

  const visible = ref(false);

  const dblclick = () => {
    visible.value = true;
  };

  const update = (def: CustomNodeDefinition) => {
    customNodeRegistry.updateCode(def.name, def.code);

    const instances = graphStore.nodes.filter((v) => v.nodePath === props.graphNode.path);
    instances.forEach((v) => v.innerNode.arm());
    instances.forEach((v) => v.innerNode.complete());

    graphStore.commit();
  };
</script>

<style lang="css" scoped></style>
