// useDraggable.ts
import { ref, type Ref } from "vue";
import type { XY } from "@/models/geometry/xy";
import { useTransformToCanvas } from "@/composables/useTransformToCanvas";

export function useDraggable(localPos: Ref<XY>) {
  const dragging = ref(false);
  const dragOffset = ref<XY>({ x: 0, y: 0 });
  const containerEl = ref<HTMLElement | null>(null);
  const { getLocalMousePos, getCanvasContent } = useTransformToCanvas();

  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    event.stopPropagation();

    const container = getCanvasContent(event.currentTarget);
    if (!container) return;
    containerEl.value = container;

    const mousePos = getLocalMousePos(event, container);
    // Save the offset between the current panel position and the mouse position.
    dragOffset.value = {
      x: mousePos.x - localPos.value.x,
      y: mousePos.y - localPos.value.y,
    };

    dragging.value = true;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value || !containerEl.value) return;
    event.stopPropagation();

    const mousePos = getLocalMousePos(event, containerEl.value);
    // Update the reactive position.
    localPos.value = {
      x: mousePos.x - dragOffset.value.x,
      y: mousePos.y - dragOffset.value.y,
    };
  }

  function onMouseUp() {
    dragging.value = false;
    containerEl.value = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  return { dragging, onMouseDown };
}
