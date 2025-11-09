<template>
  <div class="modal">
    <div class="modal-container">
      <header class="modal-header">
        <h2>{{ mode === "create" ? "Create Custom Node" : "Edit Custom Node" }}</h2>
        <button class="close-btn" @click="close">
          ×
        </button>
      </header>

      <section class="modal-body">
        <div v-if="errors.length" class="error-panel">
          <ul>
            <li v-for="(e, i) in errors" :key="i">
              {{ e }}
            </li>
          </ul>
        </div>

        <!-- Node Name -->
        <div class="form-group">
          <label>Node Name</label>
          <input v-model="nodeName" :disabled="mode === 'edit'" placeholder="Enter node name..." />
        </div>

        <!-- Inputs & Outputs -->
        <div class="io-container">
          <div class="io-card">
            <h3>Inputs</h3>
            <div v-for="(input, idx) in inputs" :key="idx" class="io-row">
              <input v-model="input.name" placeholder="Input Name" :disabled="mode === 'edit'" />
              <select v-model="input.type" :disabled="mode === 'edit'">
                <option v-for="type in IOTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <button v-if="mode === 'create'" class="remove-btn" @click="removeInput(idx)">
                🗑️
              </button>
            </div>
            <button v-if="mode === 'create'" class="add-btn" @click="addInput">
              + Add Input
            </button>
          </div>

          <div class="io-card">
            <h3>Outputs</h3>
            <div v-for="(output, idx) in outputs" :key="idx" class="io-row">
              <input v-model="output.name" placeholder="Output Name" :disabled="mode === 'edit'" />
              <select v-model="output.type" :disabled="mode === 'edit'">
                <option v-for="type in IOTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <button v-if="mode === 'create'" class="remove-btn" @click="removeOutput(idx)">
                🗑️
              </button>
            </div>
            <button v-if="mode === 'create'" class="add-btn" @click="addOutput">
              + Add Output
            </button>
          </div>
        </div>

        <!-- Code Editor -->
        <div class="form-group">
          <label>solve() Code</label>
          <textarea v-model="code" rows="12" placeholder="Enter your node logic here..."></textarea>
        </div>
      </section>

      <footer class="modal-footer">
        <button :disabled="!isValid" class="save-btn" @click="saveNode">
          {{ mode === "create" ? "Create Node" : "Update Node" }}
        </button>
        <button class="cancel-btn" @click="close">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import type { CustomNodeDefinition, NodeIO } from '@/graph/graph-nodes/json/dynamic-graph-node';
import { IOTypes } from '@/graph/graph-nodes/json/dynamic-graph-node';
import { validateFullNodePath } from '@/graph/core/graph-node-path';

const props = defineProps<{
  mode: 'create' | 'edit'; // Explicit mode
  initialDef?: CustomNodeDefinition; // Optional node to edit
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: CustomNodeDefinition): void;
}>();

// State
const nodeName = ref(props.initialDef?.path.join('/') ?? 'My Collection/Custom Node');
const inputs = ref<Array<NodeIO>>(props.initialDef?.inputs ?? [{ name: 'In1', type: 'unknown' }]);
const outputs = ref<Array<NodeIO>>(
  props.initialDef?.outputs ?? [{ name: 'Out1', type: 'unknown' }],
);
const code = ref(props.initialDef?.code ?? 'outputs[0].next(inputs[0].peek(0) + 1)');

const isValid = computed(() => errors.value.length === 0);

const errors = computed(() => {
  const list: string[] = [];

  const { errors } = validateFullNodePath(nodeName.value);
  for (const error of errors) {
    list.push(`Invalid path part: ${error}`);
  }

  if (nodeName.value.trim() === '') list.push('Node name cannot be empty.');

  const names = inputs.value.map((i) => i.name.trim());
  const uniqueNames = new Set(names);

  if (names.some((n) => !n)) list.push('All input names must be filled in.');

  if (uniqueNames.size !== names.length) list.push('Input names must be unique.');

  if (outputs.value.some((o) => !o.name.trim())) list.push('All output names must be filled in.');

  return list;
});

// Methods
function addInput() {
  inputs.value.push({ name: '', type: 'unknown' });
}
function removeInput(i: number) {
  inputs.value.splice(i, 1);
}
function addOutput() {
  outputs.value.push({ name: '', type: 'unknown' });
}
function removeOutput(i: number) {
  outputs.value.splice(i, 1);
}

function saveNode() {
  if (!isValid.value) return;
  const { sanitized } = validateFullNodePath(nodeName.value);
  emit('save', {
    path: sanitized,
    inputs: inputs.value,
    outputs: outputs.value,
    code: code.value,
  });
  emit('close');
}

function close() {
  emit('close');
}
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: var(--color-background);
  border-radius: 12px;
  width: 85vw;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.error-panel {
  background: #ffefef;
  border: 1px solid #ffbdbd;
  color: #a70000;
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-heading);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-family: monospace;
  background: var(--color-background-soft);
  color: var(--color-text);
}

.io-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.io-card {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--color-background-soft);
}

.io-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.io-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.io-row input,
.io-row select {
  flex: 1;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
}

.add-btn,
.remove-btn {
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  border: 1px solid var(--color-border);
  color: var(--color-background);
}

.add-btn {
  background: var(--color-accent);
}
.remove-btn {
  background: var(--color-background-mute);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
}

.save-btn {
  background: var(--color-accent);
  color: var(--color-background);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}
.save-btn:disabled {
  background: var(--color-border);
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--vt-c-white-mute);
  color: var(--color-text);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
