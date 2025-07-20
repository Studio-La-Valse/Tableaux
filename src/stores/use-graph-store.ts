import type { XY } from '@/models/geometry/xy'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useGraphNodeActivatorStore } from './use-graph-node-activator-store'
import type { GraphEdge } from '@/models/graph/core/graph-edge'
import type { GraphNodeModel } from '@/models/graph/core/models/graph-node-model'
import type { GraphModel } from '@/models/graph/core/models/graph-model'
import type { GraphEdgeModel } from '@/models/graph/core/models/graph-edge-model'
import { GraphNodeWrapper } from '@/models/graph/core/graph-node-wrapper'
import { useGraphHistoryStore } from './use-graph-history-store'

const useGraphInternal = defineStore('graph', () => {
  const nodes: Ref<GraphNodeWrapper[]> = ref([])
  const edges: Ref<GraphEdge[]> = ref([])

  const activators = useGraphNodeActivatorStore()

  const clear = () => {
    nodes.value.splice(0)
    edges.value.splice(0)
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
    const existing = nodes.value.findIndex((e) => e.innerNode.id == id)
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
    node.innerNode.onDestroy()

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
    const node = nodes.value.find((e) => e.innerNode.id == nodeId)
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

    const edge = leftNode.innerNode.outputs[outputIndex].connectTo(
      rightNode.innerNode.inputs[inputIndex],
    )
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
    const input = rightNode.innerNode.inputs[inputIndex]
    input.replaceConnection(undefined)
    rightNode.innerNode.arm()
    edges.value.splice(existingEdge, 1)
  }

  const insertInput = (graphNodeId: string, index: number) => {
    const node = getNode(graphNodeId).innerNode
    node.insertInput(index)

    // adding input succesful, but maybe edges need to be moved.
    const allEdges = [...edges.value] // snapshot so we don't iterate newly created edges
    allEdges
      .filter((v) => v.rightGraphNodeId == graphNodeId)
      .filter((v) => v.inputIndex >= index)
      .forEach((v) => {
        v.inputIndex++
      })
  }

  const removeInput = (graphNodeId: string, index: number) => {
    const node = getNode(graphNodeId).innerNode
    node.removeInput(index)

    // removing input succesful, but maybe edges need to be moved.
    const allEdges = [...edges.value] // snapshot so we don't iterate newly created edges
    allEdges
      .filter((v) => v.rightGraphNodeId == graphNodeId)
      .filter((v) => v.inputIndex > index)
      .forEach((v) => {
        v.inputIndex--
      })
  }

  const duplicate = (nodeIds: string[], pasteEvents: number): GraphNodeWrapper[] => {
    // 1) grab originals & snapshot the current edges
    const originals = nodeIds.map(getNode)
    const allEdges = [...edges.value] // snapshot so we don't iterate newly created edges

    // 2) clone each node & build origId→clone map
    const idMap: Record<string, GraphNodeWrapper> = {}
    const clones = originals.map((orig) => {
      const newId = crypto.randomUUID()
      const model = orig.toModel()
      model.id = newId
      model.x += 10 * pasteEvents
      model.y += 10 * pasteEvents
      const copy = addNodeModel(model)
      idMap[orig.innerNode.id] = copy
      return copy
    })

    // 3) Re-create edges BETWEEN selected originals
    allEdges.forEach((edge) => {
      const Lclone = idMap[edge.leftGraphNodeId]
      const Rclone = idMap[edge.rightGraphNodeId]

      if (Lclone && Rclone) {
        // internal→internal
        connect(Lclone.innerNode.id, edge.outputIndex, Rclone.innerNode.id, edge.inputIndex)
      }
    })

    // 4) Mirror incoming edges: external→selected
    allEdges.forEach((edge) => {
      const Lorig = edge.leftGraphNodeId
      const Rorig = edge.rightGraphNodeId
      const Rclone = idMap[Rorig]

      // if the ORIGINAL right‐node was selected, but its left‐node was NOT,
      // we want to wire that same left→clone connection
      if (!idMap[Lorig] && Rclone) {
        connect(Lorig, edge.outputIndex, Rclone.innerNode.id, edge.inputIndex)
      }
    })

    return clones
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
    model.nodes.forEach((n) => addNodeModel(n))
    model.edges.forEach((e) => addEdgeModel(e))
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
    if (model.data) Object.assign(graphNode.data, JSON.parse(JSON.stringify(model.data)))

    const numberOfParams = graphNode.data?.params_length as number
    if (numberOfParams) {
      graphNode.setParamsLength(numberOfParams)
    }

    graphNode.onInitialize()
    nodes.value.push(wrapper)

    if (graphNode.inputs.length == 0) {
      graphNode.complete()
    }

    return wrapper
  }

  const addEdgeModel: (model: GraphEdgeModel) => GraphEdge = (model: GraphEdgeModel) => {
    return connect(model.leftId, model.output, model.rightId, model.input)
  }

  return {
    clear,

    nodes,
    findNode,
    getNode,
    addNode,
    removeNode,

    edges,
    connect,
    removeEdge,

    insertInput,
    removeInput,

    duplicate,

    toModel,
    fromModel,
    addNodeModel,
    addEdgeModel,
  }
})

export const useGraphStore = defineStore('graph-with-history', () => {
  const internalGraph = useGraphInternal()
  const history = useGraphHistoryStore()
  history.init(internalGraph.toModel())

  const nodes = computed(() => internalGraph.nodes)
  const edges = computed(() => internalGraph.edges)

  const clear = () => {
    const state = internalGraph.toModel()
    try {
      internalGraph.clear()
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.addNode(nodePath, position, id)
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const removeNodes = (ids: string[]) => {
    const state = internalGraph.toModel()
    try {
      ids.forEach((id) => internalGraph.removeNode(id))
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const connect = (
    leftNodeId: string,
    outputIndex: number,
    rightNodeId: string,
    inputIndex: number,
  ) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.connect(leftNodeId, outputIndex, rightNodeId, inputIndex)
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const removeEdges = (ids: string[]) => {
    const state = internalGraph.toModel()
    try {
      const edges = [...internalGraph.edges.filter((v) => ids.includes(v.id))]
      edges.forEach((v) => internalGraph.removeEdge(v.rightGraphNodeId, v.inputIndex))
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const insertInput = (graphNodeId: string, index: number) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.insertInput(graphNodeId, index)
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const removeInput = (graphNodeId: string, index: number) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.removeInput(graphNodeId, index)
      history.commit(internalGraph.toModel())
    } catch {
      internalGraph.fromModel(state)
    }
  }

  const addNodeModels = (models: GraphNodeModel[]) => {
    const state = internalGraph.toModel()
    try {
      models.forEach((model) => internalGraph.addNodeModel(model))
      history.commit(internalGraph.toModel())
    } catch (e) {
      internalGraph.fromModel(state)
      throw e
    }
  }

  const addEdgeModels = (models: GraphEdgeModel[]) => {
    const state = internalGraph.toModel()
    try {
      models.forEach((m) => internalGraph.addEdgeModel(m))
      history.commit(internalGraph.toModel())
    } catch (e) {
      internalGraph.fromModel(state)
      throw e
    }
  }

  const duplicate = (nodeIds: string[], pasteEvents: number) => {
    const state = internalGraph.toModel()
    try {
      const result = internalGraph.duplicate(nodeIds, pasteEvents)
      history.commit(internalGraph.toModel())
      return result
    } catch (e) {
      internalGraph.fromModel(state)
      throw e
    }
  }

  const fromModel = (model: GraphModel) => {
    internalGraph.fromModel(model)
    history.init(model)
  }

  const commit = () => {
    return history.commit(internalGraph.toModel())
  }

  const undo = () => {
    const model = history.undo()
    if (model) internalGraph.fromModel(model)
  }

  const redo = () => {
    const model = history.redo()
    if (model) internalGraph.fromModel(model)
  }

  return {
    clear,

    nodes,
    addNode,
    removeNodes,

    edges,
    connect,
    removeEdges,

    insertInput,
    removeInput,

    duplicate,

    fromModel,
    addNodeModels,
    addEdgeModels,

    toModel: internalGraph.toModel,
    getNode: internalGraph.getNode,

    getPresent: history.getPresent,
    commit,
    undo,
    redo,
  }
})
