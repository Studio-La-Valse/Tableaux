// stores/contextMenu.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useGraphStore } from './use-graph-store';
import { useGraphCanvasStore } from './use-graph-canvas-store';
import { nanoid } from 'nanoid';

export const useContextMenuStore = defineStore('contextMenu', () => {
  const graph = useGraphStore();
  const canvasTransform = useGraphCanvasStore();

  // state
  const visible = ref(false);
  const xViewPort = ref(0);
  const yViewport = ref(0);
  const xCanvas = ref(0);
  const yCanvas = ref(0);

  // actions
  function open(event: MouseEvent) {
    event.preventDefault();

    visible.value = true;

    // We transport the context menu to body, so no transformation needed
    // If we dont want this, use canvasTransform.clientToViewport(event)
    xViewPort.value = event.clientX;
    yViewport.value = event.clientY;

    const canvasCoords = canvasTransform.clientToCanvas(event);
    xCanvas.value = canvasCoords.x;
    yCanvas.value = canvasCoords.y;
  }

  function close() {
    visible.value = false;
  }

  function onActivate(name: string[]) {
    graph.addNode(name, { x: xCanvas.value, y: yCanvas.value }, nanoid(11));
    close();
  }

  return { visible, x: xViewPort, y: yViewport, open, close, onActivate };
});
