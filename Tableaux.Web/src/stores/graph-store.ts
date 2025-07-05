import type { XY } from '@/models/geometry/xy'
import { defineStore } from 'pinia'
import { nextTick, ref, type Ref } from 'vue'
import { useGraphNodeActivatorCollection } from './graph-node-activator-store'
import type { GraphEdge } from '@/models/graph/core/graph-edge'
import type { GraphNodeModel } from '@/models/graph/core/models/graph-node-model'
import type { GraphModel } from '@/models/graph/core/models/graph-model'
import type { GraphEdgeModel } from '@/models/graph/core/models/graph-edge-model'
import { GraphNodeWrapper } from '@/models/graph/core/graph-node-wrapper'

export const useGraph = defineStore('graph', () => {
  const nodes: Ref<GraphNodeWrapper[]> = ref([])
  const edges: Ref<GraphEdge[]> = ref([])

  const activators = useGraphNodeActivatorCollection()

  const clear = () => {
    nodes.value = []
    edges.value = []
  }

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const activator = activators.getFromPath(nodePath)
    if (activator == undefined) {
      throw new Error()
    }

    const graphNode = activator.activate(id)
    const wrapper = new GraphNodeWrapper(graphNode)
    wrapper.x = position.x
    wrapper.y = position.y
    graphNode.onInitialize()
    nodes.value.push(wrapper)

    if (graphNode.inputs.length == 0) {
      graphNode.complete()
    }

    return wrapper
  }

  const removeNode = (id: string) => {
    const existing = nodes.value.findIndex((e) => e.id == id)
    if (existing == -1) {
      return
    }

    const leftConnections = [...edges.value.filter((e) => e.rightGraphNodeId == id)]
    leftConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNodeId, conn.inputIndex)
    })

    const rightConnections = [...edges.value.filter((e) => e.leftGraphNodeId == id)]
    rightConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNodeId, conn.inputIndex)
    })

    const node = nodes.value[existing]
    node.onDestroy()

    nodes.value.splice(existing, 1)
  }

  const getNode = (nodeId: string) => {
    const node = findNode(nodeId)
    if (!node) {
      const msg = `Node with id ${nodeId} not found!`
      throw new Error(msg)
    }

    return node
  }

  const findNode = (nodeId: string) => {
    const node = nodes.value.find((e) => e.id == nodeId)
    return node
  }

  const connect = (
    leftNodeId: string,
    outputIndex: number,
    rightNodeId: string,
    inputIndex: number,
  ) => {
    // we need to remove the existing edge after succesfull subscription, but dont call removeEdge because it will close the connection
    const existingEdge = edges.value.findIndex(
      (e) => e.rightGraphNodeId == rightNodeId && e.inputIndex == inputIndex,
    )

    const leftNode = getNode(leftNodeId)
    const rightNode = getNode(rightNodeId)

    const edge = leftNode.outputs[outputIndex].connectTo(rightNode.inputs[inputIndex])
    edges.value.push(edge)

    // seems like the subscription was succesful, so remove the existing edge.
    // we can do this by index because the new edge was pushed to the end of the array.
    if (existingEdge != -1) {
      edges.value.splice(existingEdge, 1)
    }

    return edge
  }

  const removeEdge = (rightNodeId: string, inputIndex: number) => {
    const existingEdge = edges.value.findIndex(
      (e) => e.rightGraphNodeId == rightNodeId && e.inputIndex == inputIndex,
    )
    if (existingEdge == -1) {
      return
    }

    const rightNode = getNode(rightNodeId)
    const input = rightNode.inputs[inputIndex]
    input.replaceConnection(undefined)
    rightNode.arm()
    edges.value.splice(existingEdge, 1)
  }

  const toModel: () => GraphModel = () => {
    const nodeModels = nodes.value.map((v) => v.toModel())
    const edgeModels = edges.value.map((v) => v.toModel())

    return {
      nodes: nodeModels,
      edges: edgeModels,
    }
  }

  const fromModel: (model: GraphModel) => void = (model: GraphModel) => {
    clear()

    nextTick(() => {
      model.nodes.forEach((v) => addNodeModel(v))
      model.edges.forEach((v) => addEdgeModel(v))
    })
  }

  const addNodeModel: (model: GraphNodeModel) => GraphNodeWrapper = (model: GraphNodeModel) => {
    const activator = activators.getFromPath(model.path)
    if (activator == undefined) {
      throw new Error()
    }

    const graphNode = activator.activate(model.id)
    const wrapper = new GraphNodeWrapper(graphNode)
    wrapper.x = model.x
    wrapper.y = model.y
    if (model.width) wrapper.width = model.width
    if (model.height) wrapper.height = model.height
    if (model.data) wrapper.data = JSON.parse(JSON.stringify(model.data))

    graphNode.onInitialize()
    nodes.value.push(wrapper)

    if (graphNode.inputs.length == 0) {
      graphNode.complete()
    }

    return wrapper
  }

  const addEdgeModel: (model: GraphEdgeModel) => GraphEdgeModel = (model: GraphEdgeModel) => {
    return connect(
      model.leftGraphNodeId,
      model.outputIndex,
      model.rightGraphNodeId,
      model.inputIndex,
    )
  }

  return {
    clear,
    nodes,
    edges,
    findNode,
    getNode,
    addNode,
    removeNode,
    connect,
    removeEdge,
    toModel,
    fromModel,
    addNodeModel,
    addEdgeModel,
  }
})
