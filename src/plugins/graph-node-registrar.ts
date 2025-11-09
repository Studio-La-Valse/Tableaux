import { graphNodeTypes } from '@/graph/graph-nodes/decorators'
import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry'

function useGraphNodeRegistrar() {
  return {
    async install() {
      import.meta.glob('@/graph/graph-nodes/**/*.ts', { eager: true })
      const registry = useGraphNodeRegistry()

      for (const definition of graphNodeTypes) {
        registry.register(definition)
      }
    },
  }
}

export default useGraphNodeRegistrar
