import { useGraph } from '@/stores/graph-store'
import { useSelectionStore } from '@/stores/selection-store'
import { onMounted, onUnmounted } from 'vue'

export const useCopyPaste = () => {
  const graph = useGraph()

  const clipboard: string[] = []

  const selection = useSelectionStore()

  const onKeyDown = (evt: KeyboardEvent) => {
    // Copy
    if (evt.ctrlKey && evt.key.toLowerCase() === 'c') {
      clipboard.length = 0
      clipboard.push(...selection.selectedNodes)
    }

    // Paste
    if (evt.ctrlKey && evt.key.toLowerCase() === 'v') {
      if (clipboard.length > 0) {
        // duplicate the nodes
        const newNodes = graph.duplicate(clipboard).map((e) => e.id)

        // set the selectoin to the new nodes
        selection.clearSelection()
        newNodes.forEach((e) => selection.selectNode(e))

        // set the clipboard to the new nodes.
        clipboard.length = 0
        clipboard.push(...newNodes)
      }
    }
  }

  onMounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
