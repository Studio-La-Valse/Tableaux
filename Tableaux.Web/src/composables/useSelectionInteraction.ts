// src/composables/useSelectionInteraction.ts
import { onMounted, onUnmounted } from "vue";
import { useSelectionStore } from "@/stores/selection-store";

export function useSelectionInteraction() {
  const selectionStore = useSelectionStore();

  // Global click handler using capture phase.
  function onGlobalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Clear selection if the click is not inside a node.
    if (!target.closest(".graph-node")) {
      selectionStore.clearSelection();
    }
  }

  // Global keydown handler.
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      selectionStore.clearSelection();
    }
  }

  onMounted(() => {
    // Listen in capture mode to catch events before they are stopped.
    window.addEventListener("click", onGlobalClick, true);
    window.addEventListener("keydown", onKeyDown, true);
  });

  onUnmounted(() => {
    window.removeEventListener("click", onGlobalClick, true);
    window.removeEventListener("keydown", onKeyDown, true);
  });

  return selectionStore;
}
