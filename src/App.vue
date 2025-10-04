<script setup lang="ts">
  import { onMounted } from 'vue';
  import { RouterView } from 'vue-router';

  import { useGraphNodeActivatorStore } from '@/stores/use-graph-node-activator-store';
  import { graphNodeTypes } from '@/graph/graph-nodes/decorators';
  import { useGraphNodePanelStore } from './stores/use-graph-node-panel-store';
  import { useEmitterInputStore } from './stores/use-emitter-input-store';
  import { useGraphStore } from './stores/use-graph-store';
  import type { GraphModel } from './graph/core/models/graph-model';
  import { useZoomToNodes } from './composables/use-zoom-to-nodes';
  import { storeToRefs } from 'pinia';

  import.meta.glob('@/graph/graph-nodes/**/*.ts', { eager: true });

  const graphStore = useGraphStore();
  const { init, fromModel } = graphStore;
  const { nodes } = storeToRefs(graphStore);

  const { register } = useGraphNodeActivatorStore();
  const { registerPanel } = useGraphNodePanelStore();
  const { registerInput } = useEmitterInputStore();
  const { zoomToNodes } = useZoomToNodes();

  onMounted(() => {
    for (const { category, ctor } of graphNodeTypes) {
      register(category, (id, path) => new ctor(id, path));

      if (ctor.__graphNodePanel) {
        registerPanel(ctor, ctor.__graphNodePanel);
      }

      if (ctor.__emitterInput) {
        registerInput(ctor, ctor.__emitterInput);
      }
    }

    init();

    fetch('default-graph.json')
      .then((res) => res.text())
      .then((res) => JSON.parse(res) as GraphModel)
      .then((res) => fromModel(res))
      .then(() => {
        zoomToNodes(nodes.value.map((v) => v.nodeId), 50);
      });
  });
</script>

<template>
  <RouterView />
</template>
