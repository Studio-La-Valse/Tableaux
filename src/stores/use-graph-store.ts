import type { Ref } from 'vue'
import type { XY } from '@/geometry/xy'
import type { GraphEdgePrototype } from '@/graph/core/graph-edge'
import type { IGraphNodeWrapper } from '@/graph/core/graph-node-wrapper'
import type { GraphEdgeModel } from '@/graph/core/models/graph-edge-model'
import type { GraphModel } from '@/graph/core/models/graph-model'
import type { GraphNodeModel } from '@/graph/core/models/graph-node-model'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { GraphEdge } from '@/graph/core/graph-edge'
import { GraphNodeWrapper } from '@/graph/core/graph-node-wrapper'
import { useGraphHistoryStore } from './use-graph-history-store'
import { useGraphNodeRegistry } from './use-graph-node-registry'

const useGraphInternal = defineStore('graph', () => {
  const nodeMap: Ref<Record<string, IGraphNodeWrapper>> = ref({})
  const nodes = computed(() => [...Object.values(nodeMap.value)])
  const edges: Ref<GraphEdge[]> = ref([])

  const graphNodeRegistry = useGraphNodeRegistry()

  // ---------------------------------------------------------------------------
  // Remove Node
  // ---------------------------------------------------------------------------
  const removeNode = (id: string) => {
    const node = nodeMap.value[id]
    if (!node)
      return

    // remove inbound/outbound edges
    edges.value = edges.value.filter((e) => {
      if (e.rightGraphNode.modelId === id) {
        e.rightGraphNode.innerNode.inputs[e.inputIndex].unsubscribe()
        return false
      }
      if (e.leftGraphNode.modelId === id) {
        return false
      }
      return true
    })

    node.innerNode.onDestroy()
    delete nodeMap.value[id]
  }

  const getNode = (id: string) => {
    const node = nodeMap.value[id]
    if (!node)
      throw new Error(`Node ${id} not found.`)
    return node
  }

  // ---------------------------------------------------------------------------
  // Clear Graph
  // ---------------------------------------------------------------------------
  const clear = () => {
    const ids = Object.keys(nodeMap.value)
    ids.forEach(removeNode)
    edges.value.splice(0)
  }

  // ---------------------------------------------------------------------------
  // Add Node
  // ---------------------------------------------------------------------------
  const addNode = (path: string[], position: XY, modelId: string) => {
    const graphNode = graphNodeRegistry.activate(path, modelId)
    const wrapper = reactive(new GraphNodeWrapper(graphNode))

    wrapper.xy = { x: position.x, y: position.y }

    wrapper.innerNode.onInitialize()
    wrapper.innerNode.arm()
    wrapper.innerNode.complete()

    nodeMap.value[graphNode.modelId] = wrapper
    return wrapper
  }

  // ---------------------------------------------------------------------------
  // Connect Nodes
  // ---------------------------------------------------------------------------
  const connect = (leftId: string, outputIndex: number, rightId: string, inputIndex: number) => {
    const left = getNode(leftId)
    const right = getNode(rightId)

    const output = left.innerNode.outputs[outputIndex]
    const input = right.innerNode.inputs[inputIndex]

    try {
      input.connectTo(output)
    }
    catch {
      return undefined
    }

    input.arm()
    if (left.innerNode.componentState === 'complete')
      input.complete()

    const edge = new GraphEdge(left, outputIndex, right, inputIndex)

    // remove existing edge to same input
    edges.value = edges.value.filter(
      e => !(e.rightGraphNode.modelId === rightId && e.inputIndex === inputIndex),
    )
    edges.value.push(edge)

    return edge
  }

  const removeEdge = (rightNodeId: string, inputIndex: number) => {
    const idx = edges.value.findIndex(
      e => e.rightGraphNode.modelId === rightNodeId && e.inputIndex === inputIndex,
    )
    if (idx === -1)
      return

    const rightNode = getNode(rightNodeId)
    rightNode.innerNode.inputs[inputIndex].unsubscribe()
    rightNode.innerNode.inputs[inputIndex].arm()
    rightNode.innerNode.inputs[inputIndex].complete()

    edges.value.splice(idx, 1)
  }

  // ---------------------------------------------------------------------------
  // Node Input Shifts
  // ---------------------------------------------------------------------------
  const insertInput = (nodeId: string, index: number) => {
    const node = getNode(nodeId)
    node.insertInput(index)

    edges.value.forEach((e) => {
      if (e.rightGraphNode.modelId === nodeId && e.inputIndex >= index) {
        e.inputIndex++
      }
    })
  }

  const removeInput = (nodeId: string, index: number) => {
    const node = getNode(nodeId)
    node.removeInput(index)

    edges.value.forEach((e) => {
      if (e.rightGraphNode.modelId === nodeId && e.inputIndex > index) {
        e.inputIndex--
      }
    })
  }

  // ---------------------------------------------------------------------------
  // Add Node From Model
  // ---------------------------------------------------------------------------
  const addNodeModel = (model: GraphNodeModel) => {
    const node = graphNodeRegistry.activate(model.path, model.id)
    const wrapper = reactive(new GraphNodeWrapper(node))

    wrapper.xy = { x: model.x, y: model.y }
    if (model.width)
      wrapper.width = model.width
    if (model.height)
      wrapper.height = model.height
    if (model.data)
      Object.assign(wrapper.innerNode.data, JSON.parse(JSON.stringify(model.data)))
    if (model.data?.params_length)
      node.setParamsLength(Number(wrapper.innerNode.data.params_length))

    wrapper.innerNode.onInitialize()
    nodeMap.value[wrapper.modelId] = wrapper
  }

  // ---------------------------------------------------------------------------
  // Duplicate Nodes
  // ---------------------------------------------------------------------------
  const duplicate = (nodeIds: string[], pasteEvents: number) => {
    const originals = nodeIds.map(getNode)
    const oldEdges = [...edges.value]
    const idMap: Record<string, IGraphNodeWrapper> = {}

    const clones = originals.map((orig) => {
      const newId = nanoid(10)
      const model = orig.toModel()
      model.id = newId
      model.x += 10 * pasteEvents
      model.y += 10 * pasteEvents

      addNodeModel(model)

      const copy = getNode(newId)
      idMap[orig.modelId] = copy
      return copy
    })

    oldEdges.forEach((e) => {
      const L = idMap[e.leftGraphNode.modelId]
      const R = idMap[e.rightGraphNode.modelId]
      if (L && R) {
        connect(L.modelId, e.outputIndex, R.modelId, e.inputIndex)
      }
    })

    oldEdges.forEach((e) => {
      const targetClone = idMap[e.rightGraphNode.modelId]
      if (!idMap[e.leftGraphNode.modelId] && targetClone) {
        connect(e.leftGraphNode.modelId, e.outputIndex, targetClone.modelId, e.inputIndex)
      }
    })

    clones.forEach((v) => {
      if (v.innerNode.inputs.length === 0) {
        v.innerNode.arm()
        v.innerNode.complete()
      }
    })

    return clones
  }

  // ---------------------------------------------------------------------------
  // ✅ GRAPH SERIALIZATION (updated for custom defs)
  // ---------------------------------------------------------------------------
  const toModel = (): GraphModel => {
    return {
      defs: graphNodeRegistry.getCustomDefinitions(),
      nodes: nodes.value.map(n => n.toModel()),
      edges: edges.value.map(e => e.toModel()),
    }
  }

  // ---------------------------------------------------------------------------
  // Add Edge From Model
  // ---------------------------------------------------------------------------
  const addEdgeModel = (model: GraphEdgeModel) => {
    connect(model.leftId, model.output, model.rightId, model.input)
  }

  // ---------------------------------------------------------------------------
  // ✅ GRAPH DESERIALIZATION (updated for custom defs)
  // ---------------------------------------------------------------------------
  const fromModel = (model: GraphModel) => {
    clear()

    // Load custom definitions before creating any nodes
    if (model.defs) {
      graphNodeRegistry.loadCustomDefinitions(model.defs)
    }

    model.nodes.forEach(addNodeModel)
    model.edges.forEach(addEdgeModel)

    // Run emitters
    nodes.value.forEach((v) => {
      if (v.innerNode.inputs.length === 0) {
        v.innerNode.arm()
        v.innerNode.complete()
      }
    })
  }

  return {
    clear,
    nodes,
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
  }
})

export { useGraphInternal }

export const useGraphStore = defineStore('graph-with-history', () => {
  const internalGraph = useGraphInternal()
  const history = useGraphHistoryStore()

  const nodes = computed(() => internalGraph.nodes)
  const edges = computed(() => internalGraph.edges)

  const commit = () => {
    const model = internalGraph.toModel()
    return history.commit(model)
  }

  const undo = () => {
    const model = history.undo()
    if (model !== null)
      internalGraph.fromModel(model)
  }

  const redo = () => {
    const model = history.redo()
    if (model !== null)
      internalGraph.fromModel(model)
  }

  const init = () => {
    internalGraph.clear()
    history.init(internalGraph.toModel())
  }

  const clear = () => {
    const state = internalGraph.toModel()
    try {
      internalGraph.clear()
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.addNode(nodePath, position, id)
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const getNode = (id: string) => internalGraph.getNode(id)

  const removeNodes = (ids: string[]) => {
    if (ids.length === 0) {
      return
    }

    const state = internalGraph.toModel()
    try {
      ids.forEach(id => internalGraph.removeNode(id))
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const connect = (edges: GraphEdgePrototype[]) => {
    const state = internalGraph.toModel()
    try {
      edges.forEach((v) => {
        internalGraph.connect(v.fromNodeId, v.fromOutputIndex, v.toNodeId, v.toInputIndex)
      })
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const removeEdges = (ids: string[]) => {
    if (ids.length === 0) {
      return
    }

    const state = internalGraph.toModel()
    try {
      const edges = [...internalGraph.edges.filter(v => ids.includes(v.id))]
      edges.forEach(v => internalGraph.removeEdge(v.rightGraphNode.modelId, v.inputIndex))
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const insertInput = (graphNodeId: string, index: number) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.insertInput(graphNodeId, index)
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const removeInput = (graphNodeId: string, index: number) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.removeInput(graphNodeId, index)
      commit()
    }
    catch {
      internalGraph.fromModel(state)
    }
  }

  const duplicate = (nodeIds: string[], pasteEvents: number) => {
    const state = internalGraph.toModel()
    try {
      const result = internalGraph.duplicate(nodeIds, pasteEvents)
      commit()
      return result
    }
    catch (e) {
      internalGraph.fromModel(state)
      throw e
    }
  }

  const fromModel = (model: GraphModel) => {
    const state = internalGraph.toModel()
    try {
      internalGraph.fromModel(model)
      history.init(model)
    }
    catch (e) {
      internalGraph.fromModel(state)
      throw e
    }
  }

  const toModel = () => internalGraph.toModel()

  return {
    init,
    clear,

    nodes,
    addNode,
    removeNodes,
    getNode,

    edges,
    connect,
    removeEdges,

    insertInput,
    removeInput,

    duplicate,

    fromModel,
    toModel,

    commit,
    undo,
    redo,
  }
})
