import { useContextMenuStore } from '@/stores/use-context-menu-store';
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store';
import { useGraphStore } from '@/stores/use-graph-store';
import { ref } from 'vue';

export interface TempEdgeData {
  edgeId: string;
  toNodeId: string;
  toInputIndex: number;
  currentX: number;
  currentY: number;
}

const tempEdges = ref<TempEdgeData[]>([]);

export const useEdgeReconnect = () => {
  const { edges, connect, removeEdges } = useGraphStore();
  const { clientToCanvas } = useGraphCanvasStore();
  const { close } = useContextMenuStore();

  function startReconnect(fromNodeId: string, fromOutputIndex: number, ev: MouseEvent) {
    if (ev.button !== 0) return;

    ev.stopPropagation();
    ev.preventDefault();

    close();

    const { x, y } = clientToCanvas(ev);

    tempEdges.value = [];
    edges
      .filter((v) => v.leftGraphNode.nodeId == fromNodeId && v.outputIndex == fromOutputIndex)
      .map((v) => ({
        edgeId: v.id,
        toNodeId: v.rightGraphNode.nodeId,
        toInputIndex: v.inputIndex,
        currentX: x,
        currentY: y,
      }))
      .forEach((v) => tempEdges.value.push(v));

    if (tempEdges.value.length == 0) return;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onGlobalClick);
    window.addEventListener('keyup', onKeyUp);
  }

  function onMouseMove(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const { x, y } = clientToCanvas(ev);

    tempEdges.value.forEach((v) => {
      v.currentX = x;
      v.currentY = y;
    });
  }

  function onGlobalClick(ev: MouseEvent) {
    if (ev.button !== 0) return;

    ev.preventDefault();
    ev.stopPropagation();

    const ids = [...tempEdges.value.map((v) => v.edgeId)];
    removeEdges(ids);

    clear();
  }

  function onKeyUp(ev: KeyboardEvent) {
    if (ev.key == 'Escape') clear();

    ev.preventDefault();
    ev.stopPropagation();
  }

  function finishReconnect(fromNodeId: string, fromOutputIndex: number, ev: MouseEvent) {
    if (ev.button !== 0) return;

    ev.stopPropagation();
    ev.preventDefault();

    const prototypes = tempEdges.value.map((v) => {
      return {
        fromNodeId,
        fromOutputIndex,
        toNodeId: v.toNodeId,
        toInputIndex: v.toInputIndex,
      };
    });
    connect(prototypes);

    clear();
  }

  function clear() {
    tempEdges.value = [];

    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onGlobalClick);
    window.removeEventListener('keyup', onKeyUp);
  }

  return {
    tempEdges,
    startReconnect,
    finishReconnect,
    clear,
  };
};
