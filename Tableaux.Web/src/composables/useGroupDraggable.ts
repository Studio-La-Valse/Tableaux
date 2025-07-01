import { ref } from 'vue'
import { useTransformToCanvas } from '@/composables/useTransformToCanvas'
import { useSelectionStore } from '@/stores/selection-store'
import { useGraph } from '@/stores/graph-store'
import type { XY } from '@/models/geometry/xy'

export function useGroupDraggable() {
  const { getLocalMousePos, getCanvasContent } = useTransformToCanvas()
  const selectionStore = useSelectionStore()
  const graphStore = useGraph()

  const dragging = ref(false)
  const wasDragged = ref(false)
  const threshold = 5

  let containerEl: HTMLElement | null = null
  let startPointerPos: XY = { x: 0, y: 0 }

  // maps nodeId → position at start of THIS drag‐or‐duplication cycle
  let startPositions: Record<string, XY> = {}
  // maps nodeId → offset from pointer to node at start
  let dragOffsetMap: Record<string, XY> = {}

  // guard so holding Alt doesn’t retrigger keydown floods
  let altKeyDown = false

  function onMouseDown(event: MouseEvent, nodeId: string) {
    if (event.button !== 0) return

    // ——— selection logic ———
    if (event.shiftKey) {
      if (!selectionStore.isSelected(nodeId)) {
        selectionStore.selectNode(nodeId)
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (selectionStore.isSelected(nodeId)) {
        selectionStore.unselectNode(nodeId)
      }
    } else {
      if (!selectionStore.isSelected(nodeId)) {
        selectionStore.clearSelection()
        selectionStore.selectNode(nodeId)
      }
    }
    // ————————————————

    containerEl = getCanvasContent(event.currentTarget)
    if (!containerEl) return

    // record anchor point & initial node positions
    startPointerPos = getLocalMousePos(event, containerEl)
    startPositions = {}
    dragOffsetMap = {}

    selectionStore.selectedNodes.forEach((id) => {
      const n = graphStore.getNode(id)
      startPositions[id] = { x: n.x, y: n.y }
      dragOffsetMap[id] = {
        x: startPointerPos.x - n.x,
        y: startPointerPos.y - n.y,
      }
    })

    wasDragged.value = false
    dragging.value = true
    altKeyDown = false

    if (containerEl) {
      window.addEventListener('mousemove', onMouseMove)
    }

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    event.preventDefault()
    event.stopPropagation()
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value || !containerEl) return

    const cur = getLocalMousePos(event, containerEl)
    const dx = cur.x - startPointerPos.x
    const dy = cur.y - startPointerPos.y

    if (!wasDragged.value && Math.hypot(dx, dy) > threshold) {
      wasDragged.value = true
    }

    // move whatever is selected
    selectionStore.selectedNodes.forEach((id) => {
      const n = graphStore.getNode(id)
      const offs = dragOffsetMap[id] || { x: 0, y: 0 }
      n.x = cur.x - offs.x
      n.y = cur.y - offs.y
    })

    event.preventDefault()
    event.stopPropagation()
  }

  function onMouseUp() {
    if (!dragging.value) return

    dragging.value = false
    containerEl = null

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)

    // reset drag-flag for next cycle
    setTimeout(() => (wasDragged.value = false), 0)
  }

  function onKeyDown(e: KeyboardEvent) {
    // only trigger once per physical press
    if (e.key === 'Alt' && dragging.value && !altKeyDown) {
      altKeyDown = true
      duplicateSelection()
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Alt') altKeyDown = false
  }

  function duplicateSelection() {
    // 1) which nodes are we duplicating right now?
    const origIds = [...selectionStore.selectedNodes]

    // 2) matter‐of‐factly snap them back to their start-of-cycle pos
    origIds.forEach((id) => {
      const saved = startPositions[id]
      if (saved) {
        const n = graphStore.getNode(id)
        n.x = saved.x
        n.y = saved.y
      }
    })

    // 3) ask the graph store to clone that subgraph (nodes + their inter‐edges)
    const clones = graphStore.duplicate(origIds)

    // 4) re-select the clones
    selectionStore.clearSelection()
    clones.forEach((n) => selectionStore.selectNode(n.id))

    // 5) re-anchor drag: record new start positions & offsets for these clones
    startPositions = {}
    dragOffsetMap = {}
    clones.forEach((n) => {
      startPositions[n.id] = { x: n.x, y: n.y }
      dragOffsetMap[n.id] = {
        x: startPointerPos.x - n.x,
        y: startPointerPos.y - n.y,
      }
    })
  }

  return {
    dragging,
    wasDragged,
    onMouseDown,
  }
}
