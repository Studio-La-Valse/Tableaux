import type { XY } from '@/models/geometry/xy'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useGraphNodeActivatorCollection } from './graph-node-activator-store'
import type { GraphNode } from '@/models/graph/core/graph-node'
import type { GraphEdge } from '@/models/graph/core/graph-edge'

export const useGraph = defineStore('graph', () => {
  const graphNodes: Ref<GraphNode[]> = ref([])
  const graphEdges: Ref<GraphEdge[]> = ref([])

  const activators = useGraphNodeActivatorCollection()

  const clear = () => (graphNodes.value = [])

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const activator = activators.getFromPath(nodePath)
    if (activator == undefined) {
      throw new Error()
    }

    const graphNode = activator.activate(id)
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

    const leftConnections = [...graphEdges.value.filter((e) => e.rightGraphNodeId == id)]
    leftConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNodeId, conn.inputIndex)
    })

    const rightConnections = [...graphEdges.value.filter((e) => e.leftGraphNodeId == id)]
    rightConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNodeId, conn.inputIndex)
    })

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

  const nodes = computed(() => graphNodes.value)

  const connect = (
    leftNodeId: string,
    outputIndex: number,
    rightNodeId: string,
    inputIndex: number,
  ) => {
    // we need to remove the existing edge after succesfull subscription, but dont call removeEdge because it will close the connection
    const existingEdge = graphEdges.value.findIndex(
      (e) => e.rightGraphNodeId == rightNodeId && e.inputIndex == inputIndex,
    )

    const leftNode = getNode(leftNodeId)
    const rightNode = getNode(rightNodeId)

    const edge = leftNode.outputAt(outputIndex).connectTo(rightNode.inputAt(inputIndex))
    graphEdges.value.push(edge)

    // seems like the subscription was succesful, so remove the existing edge.
    // we can do this by index because the new edge was pushed to the end of the array.
    if (existingEdge != -1) {
      graphEdges.value.splice(existingEdge, 1)
    }

    return edge
  }

  const removeEdge = (rightNodeId: string, inputIndex: number) => {
    const existingEdge = graphEdges.value.findIndex(
      (e) => e.rightGraphNodeId == rightNodeId && e.inputIndex == inputIndex,
    )
    if (existingEdge == -1) {
      return
    }

    const rightNode = getNode(rightNodeId)
    const input = rightNode.inputAt(inputIndex)
    input.replaceConnection(undefined)
    rightNode.arm()
    graphEdges.value.splice(existingEdge, 1)
  }

  const edges = computed(() => graphEdges.value)

  const tick = () => {
    nodes.value
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
