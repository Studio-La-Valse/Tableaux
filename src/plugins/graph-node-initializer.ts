import { useGraphStore } from '@/stores/use-graph-store';

const useGraphInitializer = () => {
  return {
    async install() {
      const graph = useGraphStore();
      graph.init();
    },
  };
};

export default useGraphInitializer;
