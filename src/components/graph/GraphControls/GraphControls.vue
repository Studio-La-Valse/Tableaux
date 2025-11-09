<template>
  <div class="canvas-toolbar">
    <div class="button-group">
      <button @click="layout.mode = 'split'" :class="{ active: layout.mode === 'split' }">
        <ArrowsRightLeftIcon class="icon" />
      </button>

      <button @click="layout.mode = 'graph'" :class="{ active: layout.mode === 'graph' }">
        <CodeBracketIcon class="icon" />
      </button>

      <button @click="layout.mode = 'controls'" :class="{ active: layout.mode === 'controls' }">
        <AdjustmentsHorizontalIcon class="icon" />
      </button>

      <button type="button"
              @click="zoomAll"
              :disabled="!nodes.length"
              title="Zoom All">
        <DocumentMagnifyingGlassIcon class="icon" />
      </button>

      <button
        type="button"
        @click="zoomSelected"
        :disabled="!selectedNodes.size"
        title="Zoom Selected"
      >
        <MagnifyingGlassIcon class="icon" />
      </button>

      <button type="button" @click="() => (showCustomNodeModal = true)">
        <BeakerIcon class="icon" />
      </button>

      <button type="button"
              @click="undo"
              :disabled="!hasUndo"
              title="Undo">
        <ArrowUturnLeftIcon class="icon" />
      </button>

      <button type="button"
              @click="redo"
              :disabled="!hasRedo"
              title="Redo">
        <ArrowUturnRightIcon class="icon" />
      </button>

      <button type="button" @click="save" title="Save">
        <ArrowDownOnSquareIcon class="icon" />
      </button>

      <button type="button" @click="load" title="Load">
        <FolderOpenIcon class="icon" />
      </button>

      <button type="button" @click="newDocument" title="New Document">
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
      :mode="'create'"
      @close="() => (showCustomNodeModal = false)"
      @save="addDynamic"
    />
  </Teleport>
</template>

<script setup lang="ts">
import {
  ArrowsRightLeftIcon,
  CodeBracketIcon,
  AdjustmentsHorizontalIcon,
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowDownOnSquareIcon,
  FolderOpenIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline';

import { storeToRefs } from 'pinia';
import { useGraphHistoryStore } from '@/stores/use-graph-history-store';
import { useGraphStore } from '@/stores/use-graph-store';
import { ref } from 'vue';
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store';
import { useZoomToNodes } from '@/composables/use-zoom-to-nodes';
import UnsavedChangesModal from './UnsavedChangesModal.vue';
import { useGraphLayoutStore } from '@/stores/use-graph-layout-store';
import CustomNodeComponent from '../CustomNode/CustomNodeModal.vue';
import {
  createAndRegisterCustomNode,
  type CustomNodeDefinition,
} from '@/graph/graph-nodes/json/dynamic-graph-node';
import { BeakerIcon } from '@heroicons/vue/24/solid';

const layout = useGraphLayoutStore();

const history = useGraphHistoryStore();
const { hasUndo, hasRedo } = storeToRefs(history);

const graphStore = useGraphStore();
const { init, toModel, fromModel, undo, redo } = graphStore;
const { nodes } = storeToRefs(graphStore);

const selectionStore = useGraphNodeSelectionStore();
const { selectedNodes } = storeToRefs(selectionStore);

const { zoomToNodes } = useZoomToNodes();

const lastSavedModel = ref(toModel());
const hasUnsavedChanges = () =>
  hasRedo.value || JSON.stringify(lastSavedModel.value) !== JSON.stringify(toModel());

/** --- Custom Node Modal --- */
const showCustomNodeModal = ref(false);

const addDynamic = (def: CustomNodeDefinition) => {
  createAndRegisterCustomNode(def);
  graphStore.commit();
};

/** --- Modal state --- */
const showUnsavedModal = ref(false);
let pendingAction: null | (() => void) = null;

const requestAction = (action: () => void) => {
  if (hasUnsavedChanges()) {
    pendingAction = action;
    showUnsavedModal.value = true;
  } else {
    action();
  }
};

const onSave = async () => {
  const saved = await save();
  if (saved && pendingAction) pendingAction();
  closeModal();
};
const onDiscard = () => {
  if (pendingAction) pendingAction();
  closeModal();
};
const onCancel = () => closeModal();
const closeModal = () => {
  showUnsavedModal.value = false;
  pendingAction = null;
};

/** --- File I/O helpers --- */
const saveToFile = async (filename: string, content: string) => {
  try {
    const opts: SaveFilePickerOptions = {
      types: [
        {
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        },
      ],
      suggestedName: filename,
    };
    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (err) {
    if ((err as Error).name === 'AbortError') return false;
    alert('Failed to save file: ' + err);
    return false;
  }
};

const save = async () => {
  const modelString = JSON.stringify(toModel(), null, 2);
  const saved = await saveToFile('graph-model.json', modelString);
  if (saved) lastSavedModel.value = toModel();
  return saved;
};

/** --- Core actions --- */
const load = () =>
  requestAction(async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          },
        ],
        multiple: false,
      });
      const file = await fileHandle.getFile();
      const content = await file.text();
      init();
      fromModel(JSON.parse(content));
      lastSavedModel.value = toModel();
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        alert('Failed to load file: ' + err);
      }
    }
  });

const newDocument = () =>
  requestAction(() => {
    init();
    lastSavedModel.value = toModel();
  });

/** --- Zoom --- */
const zoomSelected = () => {
  const selectedIds = selectedNodes.value;
  if (selectedIds.size) zoomToNodes(selectedIds, 250);
};

const zoomAll = () => {
  const allIds = nodes.value.map((v) => v.modelId);
  if (allIds.length) zoomToNodes(allIds, 100);
};
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
