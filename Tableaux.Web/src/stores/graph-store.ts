import type { XY } from '@/models/geometry/xy'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useGraphNodeActivatorCollection } from './graph-node-activator-store'
import type { GraphNode } from '@/models/graph/core/graph-node'

// export interface Graph {
//   clear(): void

//   addNode(nodeDescriptor: GraphNodeDescriptor, position: XY): GraphNode
//   remove(graphNodeId: string): void
//   nodes(): GraphNode[]

//   getPosition(graphNodeId: string): XY
//   setPosition(graphNodeId: string, position: XY): void

//   connect(output: GraphNodeOutput, input: GraphNodeInput): void
//   remove(graphNodeEdge: GraphEdge): void
//   edges(): GraphEdge[]
// }

export const useGraph = defineStore('graph', () => {
  const graphNodes: Ref<{ graphNode: GraphNode; position: XY }[]> = ref([])

  const activators = useGraphNodeActivatorCollection()

  const clear = () => (graphNodes.value = [])

  const addNode = (nodePath: string[], position: XY) => {
    const activator = activators.getFromPath(nodePath)
    if (activator == undefined){
      throw new Error();
    }

    const graphNode = activator.activate()
    graphNode.onInitialize();
    graphNodes.value.push({ graphNode, position })

    return graphNode
  }

  const remove = (id: string) => {
    const existing = graphNodes.value.findIndex((e) => e.graphNode.id == id)
    if (existing == -1) {
      return
    }

    graphNodes.value.splice(existing, 1)
  }

  const nodes = () => {
    return graphNodes.value;
  }

  return { clear, addNode, remove, nodes }
})
