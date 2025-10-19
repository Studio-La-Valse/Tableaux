<script setup lang="ts">
  import { onMounted } from 'vue';
  import { RouterView } from 'vue-router';

  import { useGraphNodeActivatorStore } from '@/stores/use-graph-node-activator-store';
  import { graphNodeTypes } from '@/graph/graph-nodes/decorators';
  import { useGraphNodePanelStore } from './stores/use-graph-node-panel-store';
  import { useEmitterInputStore } from './stores/use-emitter-input-store';
  import { useGraphStore } from './stores/use-graph-store';

  import.meta.glob('@/graph/graph-nodes/**/*.ts', { eager: true });

  const graphStore = useGraphStore();
  const { init } = graphStore;

  const { register } = useGraphNodeActivatorStore();
  const { registerPanel } = useGraphNodePanelStore();
  const { registerInput } = useEmitterInputStore();

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
  });
</script>

<template>
  <RouterView />
</template>
