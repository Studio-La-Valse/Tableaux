<template>
  <div class="modal">
    <div class="modal-content">
      <h2>{{ mode === 'create' ? 'Create Custom Node' : 'Edit Custom Node' }}</h2>

      <label>Node Name</label>
      <input v-model="nodeName" :disabled="mode === 'edit'" />

      <div class="io-columns">
        <!-- Inputs -->
        <div class="io-section">
          <h3>Inputs</h3>
          <div v-for="(input, index) in inputs" :key="index" class="io-row">
            <input v-model="input.name" :disabled="mode === 'edit'" />
            <select v-model="input.type" :disabled="mode === 'edit'">
              <option value="number">Number</option>
              <option value="string">String</option>
              <option value="object">Object</option>
              <option value="unknown">Unknown</option>
            </select>
            <button v-if="mode === 'create'" @click="removeInput(index)">🗑️</button>
          </div>
          <button v-if="mode === 'create'" @click="addInput">+ Add Input</button>
        </div>

        <!-- Outputs -->
        <div class="io-section">
          <h3>Outputs</h3>
          <div v-for="(output, index) in outputs" :key="index" class="io-row">
            <input v-model="output.name" :disabled="mode === 'edit'" />
            <select v-model="output.type" :disabled="mode === 'edit'">
              <option value="number">Number</option>
              <option value="string">String</option>
              <option value="object">Object</option>
              <option value="unknown">Unknown</option>
            </select>
            <button v-if="mode === 'create'" @click="removeOutput(index)">🗑️</button>
          </div>
          <button v-if="mode === 'create'" @click="addOutput">+ Add Output</button>
        </div>
      </div>

      <h3>solve() Code</h3>
      <textarea v-model="code" rows="15"></textarea>

      <div class="modal-actions">
        <button :disabled="!isValid" @click="saveNode">
          {{ mode === 'create' ? 'Create Node' : 'Update Node' }}
        </button>
        <button @click="close">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { CustomNodeDefinition, NodeIO } from '@/graph/graph-nodes/json/dynamic-graph-node';
  import { ref, computed, defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    initialData?: CustomNodeDefinition;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', payload: CustomNodeDefinition): void;
  }>();

  // Derived mode
  const mode = computed<'create' | 'edit'>(() => (props.initialData ? 'edit' : 'create'));

  // State
  const nodeName = ref(props.initialData?.name ?? 'Custom Node');
  const inputs = ref<Array<NodeIO>>(
    props.initialData?.inputs ?? [{ name: 'In1', type: 'unknown' }]
  );
  const outputs = ref<Array<NodeIO>>(
    props.initialData?.outputs ?? [{ name: 'Out1', type: 'unknown' }]
  );
  const code = ref(props.initialData?.code ?? 'outputs[0].next(inputs[0].peek(0) + 1)');

  // Validation
  const hasValidInputs = computed(() => {
    const names = inputs.value.map((i) => i.name.trim());
    const uniqueNames = new Set(names);
    return names.every((n) => n !== '') && uniqueNames.size === names.length;
  });
  const hasValidOutputs = computed(() => outputs.value.every((o) => o.name.trim() !== ''));
  const isValid = computed(
    () => nodeName.value.trim() !== '' && hasValidInputs.value && hasValidOutputs.value
  );

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
    emit('save', {
      name: nodeName.value,
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
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90vw;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .io-columns {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    margin-top: 1rem;
  }
  .io-section {
    flex: 1;
  }
  .io-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  textarea {
    width: 100%;
    resize: vertical;
    margin-top: 1rem;
    font-family: monospace;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .modal-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .error {
    color: red;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
</style>
