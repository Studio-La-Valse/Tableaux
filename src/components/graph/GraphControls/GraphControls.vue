<template>
  <div class="canvas-toolbar">
    <div class="button-group">
      <button type="button" @click="zoomAll" :disabled="!nodes.length" title="Zoom Selected">🌐</button>
      <button type="button" @click="zoomSelected" :disabled="!selectedNodes.size" title="Zoom Selected">🖼️</button>
      <button type="button" @click="toggleControls" title="Controls">🛠</button>
      <button type="button" @click="undo" :disabled="!hasUndo" title="Undo">⏮️</button>
      <button type="button" @click="redo" :disabled="!hasRedo" title="Redo">⏭️</button>
      <button type="button" @click="save" title="Save">💾</button>
      <button type="button" @click="load" title="Load">📂</button>
      <button type="button" @click="newDocument" title="New">📄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGraphHistoryStore } from '@/stores/use-graph-history-store'
import { useGraphStore } from '@/stores/use-graph-store'
import { ref } from 'vue'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useZoomToNodes } from '@/composables/use-zoom-to-nodes'

const history = useGraphHistoryStore()
const { hasUndo, hasRedo } = storeToRefs(history)

const graphStore = useGraphStore()
const { init, toModel, fromModel, undo, redo } = graphStore
const { nodes } = storeToRefs(graphStore)

const selectionStore = useGraphNodeSelectionStore()
const { selectedNodes } = storeToRefs(selectionStore)

const { zoomToNodes } = useZoomToNodes()

const lastSavedModel = ref(toModel())
const hasUnsavedChanges = () => {
  return hasUndo || hasRedo || JSON.stringify(lastSavedModel.value) !== JSON.stringify(toModel())
}

const emit = defineEmits<{
  (e: 'toggle-controls'): void
}>()

const toggleControls = () => emit('toggle-controls')

/** --- File I/O helpers --- */
const saveToFile = async (filename: string, content: string) => {
  try {
    const opts: SaveFilePickerOptions = {
      types: [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }],
      suggestedName: filename
    }
    const handle = await window.showSaveFilePicker(opts)
    const writable = await handle.createWritable()
    await writable.write(content)
    await writable.close()
    return true
  } catch (err) {
    if ((err as Error).name === 'AbortError') return false
    alert('Failed to save file: ' + err)
    return false
  }
}

const loadFromFile = async () => {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }],
      multiple: false
    })
    const file = await fileHandle.getFile()
    return await file.text()
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      alert('Failed to load file: ' + err)
    }
  }
}

/** --- Core actions --- */
const save = async () => {
  const modelString = JSON.stringify(toModel(), null, 2)
  const saved = await saveToFile('graph-model.json', modelString)
  if (saved) {
    lastSavedModel.value = toModel()
  }
  return saved
}

const loadModel = async () => {
  const fileContent = await loadFromFile()
  if (!fileContent) return
  init()
  fromModel(JSON.parse(fileContent))
  lastSavedModel.value = toModel()
}

/** --- Unsaved changes guard --- */
const confirmUnsavedChanges = async (proceed: () => void) => {
  if (!hasUnsavedChanges()) return proceed()

  const saveFirst = window.confirm(
    'You have unsaved changes.\n\nWould you like to save before continuing?\n\nPress OK to save, Cancel to choose another action.'
  )

  if (saveFirst) {
    const saved = await save()
    if (saved) proceed()
    return
  }

  const ignore = window.confirm(
    'Do you want to ignore unsaved changes and continue anyway?'
  )
  if (ignore) proceed()
}

/** --- Public handlers --- */
const load = async () => confirmUnsavedChanges(loadModel)
const newDocument = async () => {
  await confirmUnsavedChanges(() => {
    init()
    lastSavedModel.value = toModel()
  })
}

/** --- Zoom to selected --- */
const zoomSelected = () => {
  const selectedIds = selectedNodes.value
  if (!selectedIds.size) return

  zoomToNodes(selectedIds)
}


/** --- Zoom to all --- */
const zoomAll = () => {
  const selectedIds = nodes.value.map((v) => v.nodeId)
  if (!selectedIds.length) return

  zoomToNodes(selectedIds)
}

</script>

<style scoped>
.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  white-space: nowrap;
  height: 80px;
}

.button-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-group button {
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-group button:hover {
  background: var(--color-background-soft);
}

.button-group button:active {
  transform: scale(0.97);
}

.button-group button:disabled {
  background-color: #888c91;
  color: #d0d0d0;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
