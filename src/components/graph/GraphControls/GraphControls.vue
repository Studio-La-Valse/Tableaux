<template>
  <div class="canvas-toolbar">
    <div class="button-group">
      <button
        type="button"
        :class="{ active: mode === 'split' }"
        @click="mode = 'split'"
      >
        <ArrowsRightLeftIcon class="icon" />
      </button>

      <button
        type="button"
        :class="{ active: mode === 'graph' }"
        @click="mode = 'graph'"
      >
        <CodeBracketIcon class="icon" />
      </button>

      <button
        type="button"
        :class="{ active: mode === 'controls' }"
        @click="mode = 'controls'"
      >
        <AdjustmentsHorizontalIcon class="icon" />
      </button>

      <button
        type="button"
        :disabled="!nodes.length"
        title="Zoom All"
        @click="zoomAll"
      >
        <DocumentMagnifyingGlassIcon class="icon" />
      </button>

      <button
        type="button"
        :disabled="!selectedNodes.size"
        title="Zoom Selected"
        @click="zoomSelected"
      >
        <MagnifyingGlassIcon class="icon" />
      </button>

      <button
        type="button"
        @click="() => (showCustomNodeModal = true)"
      >
        <BeakerIcon class="icon" />
      </button>

      <button
        type="button"
        :disabled="!hasUndo"
        title="Undo"
        @click="undo"
      >
        <ArrowUturnLeftIcon class="icon" />
      </button>

      <button
        type="button"
        :disabled="!hasRedo"
        title="Redo"
        @click="redo"
      >
        <ArrowUturnRightIcon class="icon" />
      </button>

      <button
        type="button"
        title="Save"
        @click="save"
      >
        <ArrowDownOnSquareIcon class="icon" />
      </button>

      <button
        type="button"
        title="Load"
        @click="load"
      >
        <FolderOpenIcon class="icon" />
      </button>

      <button
        type="button"
        title="New Document"
        @click="newDocument"
      >
        <DocumentIcon class="icon" />
      </button>
    </div>
  </div>

  <Teleport to="body">
    <UnsavedChangesModal
      v-if="showUnsavedModal"
      @save="onSave"
      @discard="onDiscard"
      @cancel="onCancel"
    />
  </Teleport>

  <Teleport to="body">
    <CustomNodeComponent
      v-if="showCustomNodeModal"
      mode="create"
      @close="() => (showCustomNodeModal = false)"
      @save="addDynamic"
    />
  </Teleport>
</template>

<script setup lang="ts">
import type { CustomNodeDefinition } from '@/graph/graph-nodes/json/dynamic-graph-node'

import {
  AdjustmentsHorizontalIcon,
  ArrowDownOnSquareIcon,
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CodeBracketIcon,
  DocumentIcon,
  DocumentMagnifyingGlassIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import { BeakerIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useAlert } from '@/composables/use-alert'
import { useZoomToNodes } from '@/composables/use-zoom-to-nodes'
import {
  createAndRegisterCustomNode,

} from '@/graph/graph-nodes/json/dynamic-graph-node'
import { useGraphCanvasStore } from '@/stores/use-graph-canvas-store'
import { useGraphHistoryStore } from '@/stores/use-graph-history-store'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useGraphStore } from '@/stores/use-graph-store'
import CustomNodeComponent from '../CustomNode/CustomNodeModal.vue'
import UnsavedChangesModal from './UnsavedChangesModal.vue'

const alert = useAlert()

const history = useGraphHistoryStore()
const { hasUndo, hasRedo } = storeToRefs(history)

const graphStore = useGraphStore()
const { init, toModel, fromModel, undo, redo } = graphStore
const { nodes } = storeToRefs(graphStore)

const canvasStore = useGraphCanvasStore()
const { mode } = storeToRefs(canvasStore)

const selectionStore = useGraphNodeSelectionStore()
const { selectedNodes } = storeToRefs(selectionStore)

const { zoomToNodes } = useZoomToNodes()

const lastSavedModel = ref(toModel())
function hasUnsavedChanges() {
  return hasRedo.value || JSON.stringify(lastSavedModel.value) !== JSON.stringify(toModel())
}

/** --- Custom Node Modal --- */
const showCustomNodeModal = ref(false)

function addDynamic(def: CustomNodeDefinition) {
  createAndRegisterCustomNode(def)
  graphStore.commit()
}

/** --- Modal state --- */
const showUnsavedModal = ref(false)
let pendingAction: null | (() => void) = null

function requestAction(action: () => void) {
  if (hasUnsavedChanges()) {
    pendingAction = action
    showUnsavedModal.value = true
  }
  else {
    action()
  }
}

async function onSave() {
  const saved = await save()
  if (saved && pendingAction)
    pendingAction()
  closeModal()
}
function onDiscard() {
  if (pendingAction)
    pendingAction()
  closeModal()
}
const onCancel = () => closeModal()
function closeModal() {
  showUnsavedModal.value = false
  pendingAction = null
}

/** --- File I/O helpers --- */
async function saveToFile(filename: string, content: string) {
  try {
    const opts: SaveFilePickerOptions = {
      types: [
        {
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        },
      ],
      suggestedName: filename,
    }
    const handle = await window.showSaveFilePicker(opts)
    const writable = await handle.createWritable()
    await writable.write(content)
    await writable.close()
    return true
  }
  catch (err) {
    if ((err as Error).name === 'AbortError')
      return false
    await alert.show(`Failed to save file: ${err}`)
    return false
  }
}

async function save() {
  const modelString = JSON.stringify(toModel(), null, 2)
  const saved = await saveToFile('graph-model.json', modelString)
  if (saved)
    lastSavedModel.value = toModel()
  return saved
}

/** --- Core actions --- */
async function load() {
  return requestAction(async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          },
        ],
        multiple: false,
      })
      const file = await fileHandle.getFile()
      const content = await file.text()
      init()
      fromModel(JSON.parse(content))
      lastSavedModel.value = toModel()
    }
    catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await alert.show(`Failed to load file: ${err}`)
      }
    }
  })
}

function newDocument() {
  return requestAction(() => {
    init()
    lastSavedModel.value = toModel()
  })
}

/** --- Zoom --- */
function zoomSelected() {
  const selectedIds = selectedNodes.value
  if (selectedIds.size)
    zoomToNodes(selectedIds, 250)
}

function zoomAll() {
  const allIds = nodes.value.map(v => v.modelId)
  if (allIds.length)
    zoomToNodes(allIds, 100)
}
</script>

<style scoped>
.canvas-toolbar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-background-mute);
  border-bottom: 1px solid var(--color-border);

  /* temp width hack */
  overflow-x: hidden;
  white-space: nowrap;

  height: 85px;
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
  transition:
    background 0.2s,
    transform 0.1s;
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

button.active {
  border: 2px solid var(--color-accent);
  background: var(--color-background-strong);
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
