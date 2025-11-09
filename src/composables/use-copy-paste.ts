import { useGraphStore } from '@/stores/use-graph-store';
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store';
import { onMounted, onUnmounted } from 'vue';

export const useCopyPaste = () => {
  const { duplicate } = useGraphStore();

  const clipboard: string[] = [];

  const selection = useGraphNodeSelectionStore();

  let pasteEvents = 0;

  const onKeyDown = (evt: KeyboardEvent) => {
    // Copy
    if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'c') {
      clipboard.length = 0;
      clipboard.push(...selection.selectedNodes);
      pasteEvents = 0;
    }

    // Paste
    if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'v' && clipboard.length) {
      pasteEvents += 1;

      // duplicate the nodes
      const newNodes = duplicate(clipboard, pasteEvents);

      // set the selectoin to the new nodes
      selection.clearSelection();
      newNodes.forEach((e) => {
        selection.selectNode(e.modelId);
      });
    }
  };

  onMounted(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.addEventListener('keydown', onKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
  });
};
