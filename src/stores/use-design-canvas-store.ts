import type { XY } from '@/geometry/xy';
import { defineStore, storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { useGraphStore } from './use-graph-store';
import { CanvasClick } from '@/graph/graph-nodes/canvas/canvas-click';
import { MouseMove } from '@/graph/graph-nodes/canvas/mouse-move';
import { Viewport } from '@/graph/graph-nodes/canvas/viewport';
import { KeyPress } from '@/graph/graph-nodes/canvas/key-press';
import { Canvas } from '@/graph/graph-nodes/canvas/canvas';

export const useDesignCanvasStore = defineStore('canvas-props', () => {
  let initCounter = 0
  const canvasRef = ref<HTMLCanvasElement | undefined>();
  const dimensions = ref<XY>({ x: 1920, y: 1080 });
  const lastClick = ref<XY | undefined>();
  const graph = useGraphStore();
  const { nodes } = storeToRefs(graph);

  const attachCanvas = (canvas: HTMLCanvasElement) => {
    canvasRef.value = canvas

    canvasRef.value.addEventListener('click', click)
    canvasRef.value.addEventListener('mousemove', mousemove)

    // The very first time the canvas is attached, we dont need a redraw
    // because that will happen because of the graph invalidation
    if (initCounter > 0) {
      redraw()
    }

    initCounter ++;
  }

  onMounted(() => {
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
  });

  const click = (ev: MouseEvent) => {
    const point = clientToCanvas(ev);
    lastClick.value = point;

    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v instanceof CanvasClick)
      .forEach((v) => v.onChange(point));
  };

  const mousemove = (ev: MouseEvent) => {
    const point = clientToCanvas(ev);
    lastClick.value = point;

    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v instanceof MouseMove)
      .forEach((v) => v.onChange(point));
  };

  const keydown = (ev: KeyboardEvent) => {
    if (ev.repeat) return;
    const key = ev.key;

    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v instanceof KeyPress)
      .forEach((v) => v.keyDown(key));
  };

  const keyup = (ev: KeyboardEvent) => {
    const key = ev.key;

    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v instanceof KeyPress)
      .forEach((v) => v.keyUp(key));
  };

  function clientToCanvas(event: MouseEvent): XY {
    if (!canvasRef.value) throw new Error('Canvas has not been set.');

    const rect = canvasRef.value.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvasRef.value.width / rect.width;
    const scaleY = canvasRef.value.height / rect.height;

    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    return { x: canvasX, y: canvasY };
  }

  const setDimensions = (_dimensions: XY) => {
    dimensions.value = _dimensions;

    if (!canvasRef.value) {
      throw new Error('A canvas has not yet been set!');
    }

    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v instanceof Viewport)
      .forEach((v) => v.onChange(_dimensions));
  };

  const redraw = () => {
    nodes.value
      .map((v) => v.innerNode)
      .filter((v) => v instanceof Canvas)
      .forEach((v) => {
        v.arm();
        v.complete();
      });
  };

  onUnmounted(() => {
    canvasRef.value?.removeEventListener('click', click);
    canvasRef.value?.removeEventListener('mousemove', mousemove);
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
  });

  return { dimensions, setDimensions, lastClick, canvasRef, attachCanvas };
});
