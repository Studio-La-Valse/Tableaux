import type { XY } from '@/models/geometry/xy'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useGraphNodeActivatorCollection } from './graph-node-activator-store'
import type { GraphNode } from '@/models/graph/core/graph-node'
import type { GraphEdge } from '@/models/graph/core/graph-edge'

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
  const graphNodes: Ref<GraphNode[]> = ref([])
  const graphEdges: Ref<GraphEdge[]> = ref([])

  const activators = useGraphNodeActivatorCollection()

  const clear = () => (graphNodes.value = [])

  const addNode = (nodePath: string[], position: XY) => {
    const activator = activators.getFromPath(nodePath)
    if (activator == undefined) {
      throw new Error()
    }

    const graphNode = activator.activate()
    graphNode.x = position.x
    graphNode.y = position.y
    graphNode.onInitialize()
    graphNodes.value.push(graphNode)

    return graphNode
  }

  const removeNode = (id: string) => {
    const existing = graphNodes.value.findIndex((e) => e.id == id)
    if (existing == -1) {
      return
    }

    graphNodes.value.splice(existing, 1)
  }

  const getNode = (nodeId: string) => {
    const node = graphNodes.value.find((e) => e.id == nodeId)
    if (!node) {
      const msg = `Node with id ${nodeId} not found!`
      throw new Error(msg)
    }

    return node
  }

  const nodes = () => {
    return [...graphNodes.value]
  }

  const connect = (
    leftNodeId: string,
    outputIndex: number,
    rightNodeId: string,
    inputIndex: number,
  ) => {
    removeEdge(rightNodeId, inputIndex)

    const leftNode = getNode(leftNodeId)
    const rightNode = getNode(rightNodeId)

    const edge = leftNode.outputAt(outputIndex).connectTo(rightNode.inputAt(inputIndex))
    graphEdges.value.push(edge)
    return edge
  }

  const removeEdge = (rightNodeId: string, inputIndex: number) => {
    const existingEdge = graphEdges.value.findIndex(
      (e) => e.rightGraphNodeId == rightNodeId && e.inputIndex == inputIndex,
    )
    if (existingEdge == -1) {
      return
    }

    const rightNode = getNode(rightNodeId);
    const input = rightNode.inputAt(inputIndex);
    input.closeConnection();
    graphEdges.value.splice(existingEdge, 1)
  }

  const edges = () => {
    return [...graphEdges.value]
  }

  const tick = () => {
    nodes()
      .filter((n) => n.numberOfInputs == 0 && n.numberOfOutputs >= 1)
      .forEach((n) => n.complete())
  }

  return {
    clear,
    getNode,
    addNode,
    removeNode,
    nodes,
    connect,
    removeEdge,
    edges,
    tick,
  }
})
