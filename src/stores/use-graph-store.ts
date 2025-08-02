import type { XY } from '@/geometry/xy'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useGraphNodeActivatorStore } from './use-graph-node-activator-store'
import { GraphEdge } from '@/graph/core/graph-edge'
import type { GraphNodeModel } from '@/graph/core/models/graph-node-model'
import type { GraphModel } from '@/graph/core/models/graph-model'
import type { GraphEdgeModel } from '@/graph/core/models/graph-edge-model'
import { GraphNodeWrapper } from '@/graph/core/graph-node-wrapper'
import { useGraphHistoryStore } from './use-graph-history-store'
import { nanoid } from 'nanoid'

const useGraphInternal = defineStore('graph', () => {
  const nodeMap: Ref<Record<string, GraphNodeWrapper>> = ref({})
  const nodes = computed(() => [...Object.values(nodeMap.value)])
  const edges: Ref<GraphEdge[]> = ref([])

  const activators = useGraphNodeActivatorStore()

  const clear = () => {
    nodeMap.value = {}
    edges.value = []
  }

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const activator = activators.getFromPath(nodePath)
    if (activator == undefined) {
      throw new Error()
    }

    const graphNode = activator.activate(id)
    const wrapper = new GraphNodeWrapper(graphNode)
    wrapper.xy = { x: position.x, y: position.y }
    graphNode.onInitialize()
    if (graphNode.inputs.length == 0) {
      graphNode.complete()
    }

    nodeMap.value[id] = wrapper
    return wrapper
  }

  const removeNode = (id: string) => {
    const existing = findNode(id)
    if (!existing) {
      return
    }

    const leftConnections = [...edges.value.filter((e) => e.rightGraphNode.innerNode.id == id)]
    leftConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNode.innerNode.id, conn.inputIndex)
    })

    const rightConnections = [...edges.value.filter((e) => e.leftGraphNode.innerNode.id == id)]
    rightConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNode.innerNode.id, conn.inputIndex)
    })

    existing.innerNode.onDestroy()
    delete nodeMap.value[existing.innerNode.id]
  }

  const getNode = (nodeId: string) => {
    const node = findNode(nodeId)
    if (!node) throw new Error(`Node with id ${nodeId} not found!`)
    return node
  }

  const findNode = (nodeId: string) => nodeMap.value[nodeId] ?? null

  const connect = (
    leftNodeId: string,
    outputIndex: number,
    rightNodeId: string,
    inputIndex: number,
  ) => {
    // we need to remove the existing edge after succesfull subscription, but dont call removeEdge because it will close the connection
    const existingEdge = edges.value.findIndex(
      (e) => e.rightGraphNode.innerNode.id == rightNodeId && e.inputIndex == inputIndex,
    )

    const leftNode = getNode(leftNodeId)
    const rightNode = getNode(rightNodeId)

    leftNode.innerNode.outputs[outputIndex].connectTo(rightNode.innerNode.inputs[inputIndex])
    const edge = new GraphEdge(leftNode, outputIndex, rightNode, inputIndex)
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
      (e) => e.rightGraphNode.innerNode.id == rightNodeId && e.inputIndex == inputIndex,
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
      .filter((v) => v.rightGraphNode.innerNode.id == graphNodeId)
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
      .filter((v) => v.rightGraphNode.innerNode.id == graphNodeId)
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
      const newId = nanoid(11)
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
      const Lclone = idMap[edge.leftGraphNode.innerNode.id]
      const Rclone = idMap[edge.rightGraphNode.innerNode.id]

      if (Lclone && Rclone) {
        // internal→internal
        connect(Lclone.innerNode.id, edge.outputIndex, Rclone.innerNode.id, edge.inputIndex)
      }
    })

    // 4) Mirror incoming edges: external→selected
    allEdges.forEach((edge) => {
      const Lorig = edge.leftGraphNode.innerNode.id
      const Rorig = edge.rightGraphNode.innerNode.id
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
    model.nodes
      .map((v) => createFromNodeModel(v))
      .forEach((v) => (nodeMap.value[v.innerNode.id] = v))

    const newEdges = model.edges.map((v) => createFromEdgeModel(v))
    edges.value = newEdges
  }

  const createFromNodeModel: (model: GraphNodeModel) => GraphNodeWrapper = (
    model: GraphNodeModel,
  ) => {
    const activator = activators.getFromPath(model.path)
    if (activator == undefined) {
      throw new Error()
    }

    const graphNode = activator.activate(model.id)
    const wrapper = new GraphNodeWrapper(graphNode)
    wrapper.xy = { x: model.x, y: model.y }
    if (model.width) wrapper.width = model.width
    if (model.height) wrapper.height = model.height
    if (model.data) Object.assign(graphNode.data, JSON.parse(JSON.stringify(model.data)))

    const numberOfParams = graphNode.data?.params_length as number
    if (numberOfParams) {
      graphNode.setParamsLength(numberOfParams)
    }

    graphNode.onInitialize()

    if (graphNode.inputs.length == 0) {
      graphNode.complete()
    }

    return wrapper
  }

  const addNodeModel: (model: GraphNodeModel) => GraphNodeWrapper = (model: GraphNodeModel) => {
    const wrapper = createFromNodeModel(model)
    nodeMap.value[wrapper.innerNode.id] = wrapper
    return wrapper
  }

  const createFromEdgeModel: (model: GraphEdgeModel) => GraphEdge = (model: GraphEdgeModel) => {
    const rightNodeId = model.rightId
    const inputIndex = model.input
    const leftNodeId = model.leftId
    const outputIndex = model.output

    const leftNode = getNode(leftNodeId)
    const rightNode = getNode(rightNodeId)

    leftNode.innerNode.outputs[outputIndex].connectTo(rightNode.innerNode.inputs[inputIndex])
    const edge = new GraphEdge(leftNode, outputIndex, rightNode, inputIndex)
    return edge
  }

  const addEdgeModel: (model: GraphEdgeModel) => GraphEdge = (model: GraphEdgeModel) => {
    const edge = createFromEdgeModel(model)
    edges.value.push(edge)
    return edge
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
    if (ids.length === 0) {
      return
    }

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
    if (ids.length === 0) {
      return
    }

    const state = internalGraph.toModel()
    try {
      const edges = [...internalGraph.edges.filter((v) => ids.includes(v.id))]
      edges.forEach((v) => internalGraph.removeEdge(v.rightGraphNode.innerNode.id, v.inputIndex))
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
    getNode: internalGraph.getNode,

    edges,
    connect,
    removeEdges,

    insertInput,
    removeInput,

    duplicate,

    fromModel,
    toModel: internalGraph.toModel,

    getPresent: history.getPresent,
    commit,
    undo,
    redo,
  }
})
