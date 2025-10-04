import { useGraphStore } from '@/stores/use-graph-store';
import { useCanvasTransform } from './use-canvas-transform';

export const useZoomToNodes = () => {
  const { getNode } = useGraphStore();
  const { position, scale, canvasSize } = useCanvasTransform();

  const zoomToNodes = (nodeIds: Iterable<string>, padding: number = 200) => {
    // Convert to array so we can check length
    const ids = Array.from(nodeIds);
    if (!ids.length) return;

    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (const id of ids) {
      const wrapper = getNode(id);
      minX = Math.min(wrapper.xy.x, minX);
      minY = Math.min(wrapper.xy.y, minY);
      maxX = Math.max(wrapper.xy.x + wrapper.width, maxX);
      maxY = Math.max(wrapper.xy.y + wrapper.height, maxY);
    }

    const _canvasSize = canvasSize.value;

    // Bounding box dimensions
    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;

    // Calculate zoom so the selection fits in view (with a small margin)
    const zoomX = (_canvasSize.width - padding * 2) / boxWidth;
    const zoomY = (_canvasSize.height - padding * 2) / boxHeight;
    const minScale = 0.2;
    const maxScale = 5;
    let newZoom = Math.min(zoomX, zoomY);
    newZoom = Math.max(newZoom, minScale);
    newZoom = Math.min(newZoom, maxScale);

    // Center of the selection
    const centerX = minX + boxWidth / 2;
    const centerY = minY + boxHeight / 2;

    // Position so that the selection center is in the middle of the canvas
    const newPosition = {
      x: _canvasSize.width / 2 - centerX * newZoom,
      y: _canvasSize.height / 2 - centerY * newZoom,
    };

    position.value = newPosition;
    scale.value = newZoom;
  };

  return {
    zoomToNodes,
  };
};
