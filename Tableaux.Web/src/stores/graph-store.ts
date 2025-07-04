import type { XY } from '@/models/geometry/xy'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useGraphNodeActivatorCollection } from './graph-node-activator-store'
import { GraphNode } from '@/models/graph/core/graph-node'
import type { GraphEdge } from '@/models/graph/core/graph-edge'

export class GraphNodeWrapper {
  private _height = 30
  private _width = 100
  private _handlePad = 45;

  public x: number = 0
  public y: number = 0

  public get height(): number {
    return Math.max(this._height, this.minHeight)
  }

  public set height(val: number) {
    this._height = Math.max(val, this.minHeight)
  }

  public get width(): number {
    return Math.max(this._width, this.minWidth)
  }

  public set width(val: number) {
    this._width = Math.max(val, this.minWidth)
  }

  public get minHeight(): number {
    return Math.max(this.innerNode.numberOfInputs, this.innerNode.numberOfOutputs, 1) * this._handlePad
  }

  public get minWidth(): number {
    return 100
  }

  public get id() { return this.innerNode.id }

  public get path() { return this.innerNode.path }

  public get inputs() { return this.innerNode.inputs }

  public get outputs() { return this.innerNode.outputs }

  constructor(public readonly innerNode: GraphNode) {

  }

  /**
  * Computes relative position factor of a connector handle.
  */
  public calculateHandleFactor(index: number, of: number): number {
    if (index > of) {
      throw new RangeError(`The index ${index} cannot be greater than 'of' value ${of}.`)
    }

    const parts = of + 1
    return (1 / parts) * (index + 1)
  }

  /**
   * Calculates vertical position of a handle within the node.
   */
  public calculateHandleHeight(index: number, of: number): number {
    const factor = this.calculateHandleFactor(index, of)
    return factor * this.height
  }

  /**
   * Returns absolute Y-coordinate for a connector handle.
   */
  public calculateHandleCoordinate(index: number, of: number): number {
    const height = this.calculateHandleHeight(index, of)
    return this.y + height
  }

  public arm() {
    return this.innerNode.arm()
  }

  public complete() {
    return this.innerNode.complete()
  }

  public onDestroy() {
    return this.innerNode.onDestroy()
  }
}

export const useGraph = defineStore('graph', () => {
  const graphNodes: Ref<GraphNodeWrapper[]> = ref([])
  const graphEdges: Ref<GraphEdge[]> = ref([])

  const activators = useGraphNodeActivatorCollection()

  const clear = () => (graphNodes.value = [])

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
    graphNodes.value.push(wrapper)

    if (graphNode.inputs.length == 0) {
      graphNode.complete();
    }

    return wrapper
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

    const node = graphNodes.value[existing]
    node.onDestroy()

    graphNodes.value.splice(existing, 1)
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
    const node = graphNodes.value.find((e) => e.id == nodeId)
    return node
  }

  const nodes = computed(() => graphNodes.value)

  const duplicate = (nodeIds: string[]): GraphNodeWrapper[] => {
    // 1) grab originals & snapshot the current edges
    const originals = nodeIds.map(getNode)
    const allEdges = [...graphEdges.value] // snapshot so we don't iterate newly created edges

    // 2) clone each node & build origId→clone map
    const idMap: Record<string, GraphNodeWrapper> = {}
    const clones = originals.map((orig) => {
      const newId = crypto.randomUUID()
      const copy = addNode(orig.path, { x: orig.x + 10, y: orig.y + 10 }, newId)
      idMap[orig.id] = copy
      return copy
    })

    // 3) Re-create edges BETWEEN selected originals
    allEdges.forEach((edge) => {
      const Lclone = idMap[edge.leftGraphNodeId]
      const Rclone = idMap[edge.rightGraphNodeId]

      if (Lclone && Rclone) {
        // internal→internal
        connect(Lclone.id, edge.outputIndex, Rclone.id, edge.inputIndex)
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
        connect(Lorig, edge.outputIndex, Rclone.id, edge.inputIndex)
      }
    })

    return clones
  }

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

    const edge = leftNode.outputs[outputIndex].connectTo(rightNode.inputs[inputIndex])
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
    const input = rightNode.inputs[inputIndex]
    input.replaceConnection(undefined)
    rightNode.arm()
    graphEdges.value.splice(existingEdge, 1)
  }

  const edges = computed(() => graphEdges.value)

  const tick = () => {
    nodes.value
      .filter((n) => n.inputs.length == 0 && n.outputs.length >= 1)
      .forEach((n) => n.complete())
  }

  return {
    clear,
    nodes,
    findNode,
    getNode,
    addNode,
    removeNode,
    duplicate,
    connect,
    edges,
    removeEdge,
    tick,
  }
})
