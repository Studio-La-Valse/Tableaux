import { isGraphNodeDefinition } from '@/graph/graph-nodes/graph-node-definition';
import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry';

const useGraphNodeRegistrar = () => {
  return {
    async install() {
      const modules = import.meta.glob('@/graph/graph-nodes/**/*.ts');
      const registry = useGraphNodeRegistry();

      for (const path in modules) {
        const mod = (await modules[path]()) as { default?: unknown };
        if (mod.default && isGraphNodeDefinition(mod.default)) {
          registry.register(mod.default);
        }
      }
    },
  };
};

export default useGraphNodeRegistrar;
