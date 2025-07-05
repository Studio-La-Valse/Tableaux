import type { GraphNodeWrapper } from '@/models/graph/core/graph-node-wrapper'
import { useGraph } from '@/stores/graph-store'
import { useSelectionStore } from '@/stores/selection-store'
import { onMounted, onUnmounted } from 'vue'

export const useCopyPaste = () => {
  const { getNode, addNodeModel, edges, connect } = useGraph()

  const clipboard: string[] = []

  const selection = useSelectionStore()

  let pasteEvents = 0

  const onKeyDown = (evt: KeyboardEvent) => {
    // Copy
    if (evt.ctrlKey && evt.key.toLowerCase() === 'c') {
      clipboard.length = 0
      clipboard.push(...selection.selectedNodes)
      pasteEvents = 0
    }

    // Paste
    if (evt.ctrlKey && evt.key.toLowerCase() === 'v' && clipboard.length) {
       pasteEvents += 1

        // duplicate the nodes
        const newNodes = duplicate(clipboard)

        // set the selectoin to the new nodes
        selection.clearSelection()
        newNodes.forEach((e) => {
          e.x += 10 * pasteEvents
          e.y += 10 * pasteEvents
          selection.selectNode(e.id)
        })
    }
  }

  const duplicate = (nodeIds: string[]): GraphNodeWrapper[] => {
    // 1) grab originals & snapshot the current edges
    const originals = nodeIds.map(getNode)
    const allEdges = [...edges] // snapshot so we don't iterate newly created edges

    // 2) clone each node & build origId→clone map
    const idMap: Record<string, GraphNodeWrapper> = {}
    const clones = originals.map((orig) => {
      const newId = crypto.randomUUID()
      const model = orig.toModel()
      model.id = newId
      const copy = addNodeModel(model)
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

  onMounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
