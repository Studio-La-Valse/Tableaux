import type { XY } from '@/geometry/xy';
import { defineStore } from 'pinia';
import { computed, reactive, ref, type Ref } from 'vue';
import { useGraphNodeActivatorStore } from './use-graph-node-activator-store';
import { GraphEdge, type GraphEdgePrototype } from '@/graph/core/graph-edge';
import type { GraphNodeModel } from '@/graph/core/models/graph-node-model';
import type { GraphModel } from '@/graph/core/models/graph-model';
import type { GraphEdgeModel } from '@/graph/core/models/graph-edge-model';
import {
  type IGraphNodeWrapper,
  GraphNodeWrapper,
} from '@/graph/core/graph-node-wrapper';
import { useGraphHistoryStore } from './use-graph-history-store';
import { nanoid } from 'nanoid';

const useGraphInternal = defineStore('graph', () => {
  const nodeMap: Ref<Record<string, IGraphNodeWrapper>> = ref({});
  const nodes = computed(() => [...Object.values(nodeMap.value)]);
  const edges: Ref<GraphEdge[]> = ref([]);

  const activators = useGraphNodeActivatorStore();

  const clear = () => {
    const nodeIds = Object.keys(nodeMap.value);
    nodeIds.forEach((v) => {
      removeNode(v);
    });
  };

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const activator = activators.getFromPath(nodePath);
    if (activator == undefined) {
      throw new Error();
    }

    const graphNode = activator.activate(id);
    const wrapper = reactive<IGraphNodeWrapper>(
      new GraphNodeWrapper(graphNode)
    );
    wrapper.xy = { x: position.x, y: position.y };
    wrapper.innerNode.onInitialize();
    wrapper.innerNode.arm();
    wrapper.innerNode.complete();

    nodeMap.value[id] = wrapper;
    return wrapper;
  };

  const removeNode = (id: string) => {
    const existing = findNode(id);
    if (!existing) {
      return;
    }

    const leftConnections = [
      ...edges.value.filter((e) => e.rightGraphNode.nodeId == id),
    ];
    leftConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNode.nodeId, conn.inputIndex);
    });

    const rightConnections = [
      ...edges.value.filter((e) => e.leftGraphNode.nodeId == id),
    ];
    rightConnections.forEach((conn) => {
      removeEdge(conn.rightGraphNode.nodeId, conn.inputIndex);
    });

    existing.innerNode.onDestroy();
    delete nodeMap.value[existing.nodeId];
  };

  const getNode = (nodeId: string) => {
    const node = findNode(nodeId);
    if (!node) throw new Error(`Node with id ${nodeId} not found!`);
    return node;
  };

  const findNode = (nodeId: string) => nodeMap.value[nodeId] ?? null;

  const connect = (
    leftNodeId: string,
    outputIndex: number,
    rightNodeId: string,
    inputIndex: number
  ): GraphEdge | undefined => {
    // we need to remove the existing edge after succesfull subscription, but dont call removeEdge because it will close the connection
    const existingEdge = edges.value.findIndex(
      (e) =>
        e.rightGraphNode.nodeId == rightNodeId && e.inputIndex == inputIndex
    );

    const leftNode = getNode(leftNodeId);
    const rightNode = getNode(rightNodeId);

    const output = leftNode.innerNode.outputs[outputIndex];
    const input = rightNode.innerNode.inputs[inputIndex];

    try {
      input.connectTo(output);
    } catch {
      return undefined;
    }

    input.arm();
    if (leftNode.innerNode.componentState === 'complete') input.complete();

    const edge = new GraphEdge(leftNode, outputIndex, rightNode, inputIndex);
    edges.value.push(edge);

    // seems like the subscription was succesful, so remove the existing edge.
    // we can do this by index because the new edge was pushed to the end of the array.
    if (existingEdge != -1) {
      edges.value.splice(existingEdge, 1);
    }

    return edge;
  };

  const removeEdge = (rightNodeId: string, inputIndex: number) => {
    const existingEdge = edges.value.findIndex(
      (e) =>
        e.rightGraphNode.nodeId == rightNodeId && e.inputIndex == inputIndex
    );
    if (existingEdge == -1) {
      return;
    }

    const rightNode = getNode(rightNodeId);
    const input = rightNode.innerNode.inputs[inputIndex];
    input.unsubscribe();
    input.arm();
    input.complete();
    edges.value.splice(existingEdge, 1);
  };

  const insertInput = (graphNodeId: string, index: number) => {
    const node = getNode(graphNodeId);
    node.insertInput(index);

    // adding input succesful, but maybe edges need to be moved.
    const allEdges = [...edges.value]; // snapshot so we don't iterate newly created edges
    allEdges
      .filter((v) => v.rightGraphNode.nodeId == graphNodeId)
      .filter((v) => v.inputIndex >= index)
      .forEach((v) => {
        v.inputIndex++;
      });
  };

  const removeInput = (graphNodeId: string, index: number) => {
    const node = getNode(graphNodeId);
    node.removeInput(index);

    // removing input succesful, but maybe edges need to be moved.
    const allEdges = [...edges.value]; // snapshot so we don't iterate newly created edges
    allEdges
      .filter((v) => v.rightGraphNode.nodeId == graphNodeId)
      .filter((v) => v.inputIndex > index)
      .forEach((v) => {
        v.inputIndex--;
      });
  };

  const duplicate = (
    nodeIds: string[],
    pasteEvents: number
  ): IGraphNodeWrapper[] => {
    // 1) grab originals & snapshot the current edges
    const originals = nodeIds.map(getNode);
    const allEdges = [...edges.value]; // snapshot so we don't iterate newly created edges

    // 2) clone each node & build origId→clone map
    const idMap: Record<string, IGraphNodeWrapper> = {};
    const clones = originals.map((orig) => {
      const newId = nanoid(11);
      const model = orig.toModel();
      model.id = newId;
      model.x += 10 * pasteEvents;
      model.y += 10 * pasteEvents;
      addNodeModel(model);
      const copy = findNode(model.id);
      idMap[orig.nodeId] = copy;
      return copy;
    });

    // 3) Re-create edges BETWEEN selected originals
    allEdges.forEach((edge) => {
      const Lclone = idMap[edge.leftGraphNode.nodeId];
      const Rclone = idMap[edge.rightGraphNode.nodeId];

      if (Lclone && Rclone) {
        // internal→internal
        connect(
          Lclone.nodeId,
          edge.outputIndex,
          Rclone.nodeId,
          edge.inputIndex
        );
      }
    });

    // 4) Mirror incoming edges: external→selected
    allEdges.forEach((edge) => {
      const Lorig = edge.leftGraphNode.nodeId;
      const Rorig = edge.rightGraphNode.nodeId;
      const Rclone = idMap[Rorig];

      // if the ORIGINAL right‐node was selected, but its left‐node was NOT,
      // we want to wire that same left→clone connection
      if (!idMap[Lorig] && Rclone) {
        connect(Lorig, edge.outputIndex, Rclone.nodeId, edge.inputIndex);
      }
    });

    // 5) Emit the emitters
    clones
      .map((v) => v.innerNode)
      .filter((v) => v.inputs.length == 0)
      .forEach((v) => {
        v.arm();
        v.complete();
      });

    return clones;
  };

  const toModel: () => GraphModel = () => {
    const nodeModels = nodes.value.map((v) => v.toModel());
    const edgeModels = edges.value.map((v) => v.toModel());

    return {
      nodes: nodeModels,
      edges: edgeModels,
    };
  };

  const fromModel: (model: GraphModel) => void = (model: GraphModel) => {
    clear();

    model.nodes.forEach((v) => addNodeModel(v));
    model.edges.forEach((v) => addEdgeModel(v));

    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v.inputs.length == 0)
      .forEach((v) => {
        v.arm();
        v.complete();
      });
  };

  const addNodeModel: (model: GraphNodeModel) => void = (
    model: GraphNodeModel
  ) => {
    const activator = activators.getFromPath(model.path);
    if (activator == undefined) {
      throw new Error(`Cannot find node with path: ${model.path}`);
    }

    const graphNode = activator.activate(model.id);
    const wrapper = reactive<IGraphNodeWrapper>(
      new GraphNodeWrapper(graphNode)
    );
    wrapper.xy = { x: model.x, y: model.y };
    if (model.width) wrapper.width = model.width;
    if (model.height) wrapper.height = model.height;
    if (model.data)
      Object.assign(graphNode.data, JSON.parse(JSON.stringify(model.data)));

    const numberOfParams = graphNode.data?.params_length as number;
    if (numberOfParams) {
      graphNode.setParamsLength(numberOfParams);
    }

    graphNode.onInitialize();
    nodeMap.value[wrapper.nodeId] = wrapper;
  };

  const addEdgeModel: (model: GraphEdgeModel) => void = (
    model: GraphEdgeModel
  ) => {
    const rightNodeId = model.rightId;
    const inputIndex = model.input;
    const leftNodeId = model.leftId;
    const outputIndex = model.output;

    connect(leftNodeId, outputIndex, rightNodeId, inputIndex);
  };

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
  };
});

export const useGraphStore = defineStore('graph-with-history', () => {
  const internalGraph = useGraphInternal();
  const history = useGraphHistoryStore();

  const nodes = computed(() => internalGraph.nodes);
  const edges = computed(() => internalGraph.edges);

  const init = () => {
    internalGraph.clear();
    history.init(internalGraph.toModel());
  };

  const clear = () => {
    const state = internalGraph.toModel();
    try {
      internalGraph.clear();
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const addNode = (nodePath: string[], position: XY, id: string) => {
    const state = internalGraph.toModel();
    try {
      internalGraph.addNode(nodePath, position, id);
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const getNode = (id: string) => internalGraph.getNode(id);

  const removeNodes = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    const state = internalGraph.toModel();
    try {
      ids.forEach((id) => internalGraph.removeNode(id));
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const connect = (edges: GraphEdgePrototype[]) => {
    const state = internalGraph.toModel();
    try {
      edges.forEach((v) => {
        internalGraph.connect(
          v.fromNodeId,
          v.fromOutputIndex,
          v.toNodeId,
          v.toInputIndex
        );
      });
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const removeEdges = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    const state = internalGraph.toModel();
    try {
      const edges = [...internalGraph.edges.filter((v) => ids.includes(v.id))];
      edges.forEach((v) =>
        internalGraph.removeEdge(v.rightGraphNode.nodeId, v.inputIndex)
      );
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const insertInput = (graphNodeId: string, index: number) => {
    const state = internalGraph.toModel();
    try {
      internalGraph.insertInput(graphNodeId, index);
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const removeInput = (graphNodeId: string, index: number) => {
    const state = internalGraph.toModel();
    try {
      internalGraph.removeInput(graphNodeId, index);
      commit();
    } catch {
      internalGraph.fromModel(state);
    }
  };

  const duplicate = (nodeIds: string[], pasteEvents: number) => {
    const state = internalGraph.toModel();
    try {
      const result = internalGraph.duplicate(nodeIds, pasteEvents);
      commit();
      return result;
    } catch (e) {
      internalGraph.fromModel(state);
      throw e;
    }
  };

  const fromModel = (model: GraphModel) => {
    const state = internalGraph.toModel();
    try {
      internalGraph.fromModel(model);
      history.init(model);
    } catch (e) {
      internalGraph.fromModel(state);
      throw e;
    }
  };

  const toModel = () => internalGraph.toModel();

  const commit = () => {
    const model = internalGraph.toModel();
    return history.commit(model);
  };

  const undo = () => {
    const model = history.undo();
    if (model !== null) internalGraph.fromModel(model);
  };

  const redo = () => {
    const model = history.redo();
    if (model !== null) internalGraph.fromModel(model);
  };

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
  };
});
