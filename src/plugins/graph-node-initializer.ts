import { useGraphStore } from '@/stores/use-graph-store'

function useGraphInitializer() {
  return {
    async install() {
      const graph = useGraphStore()
      graph.init()
    },
  }
}

export default useGraphInitializer
