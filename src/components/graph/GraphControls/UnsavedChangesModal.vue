<template>
  <div
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="unsaved-title"
    tabindex="0"
    @keydown.esc.prevent="$emit('cancel')"
  >
    <div
      ref="modalRef"
      class="modal"
    >
      <header class="modal-header">
        <h3 id="unsaved-title">
          Unsaved Changes
        </h3>

        <button
          type="button"
          class="close-btn"
          aria-label="Close"
          @click="$emit('cancel')"
        >
          <XMarkIcon class="icon" />
        </button>
      </header>

      <p>You have unsaved changes. Save before continuing?</p>

      <div class="actions">
        <button
          type="button"
          class="btn save"
          @click="$emit('save')"
        >
          <ArrowDownTrayIcon class="icon" />
          Save
        </button>

        <button
          type="button"
          class="btn discard"
          @click="$emit('discard')"
        >
          <NoSymbolIcon class="icon" />
          Discard
        </button>

        <button
          type="button"
          class="btn cancel"
          @click="$emit('cancel')"
        >
          <XCircleIcon class="icon" />
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownTrayIcon, NoSymbolIcon, XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import { onMounted, useTemplateRef } from 'vue'

defineEmits<{
  (e: 'cancel'): void
  (e: 'save'): void
  (e: 'discard'): void
}>()

const modalRef = useTemplateRef<HTMLElement>('modalRef')

onMounted(() => {
  const firstButton = modalRef.value?.querySelector('button') as HTMLButtonElement | null
  firstButton?.focus()
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: var(--color-background);
  color: var(--color-text);
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--color-border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-heading);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text);
  border-radius: 4px;
  width: 30px;
  height: 30px;
  padding: 0.25rem;
  transition:
    background-color 0.2s,
    transform 0.1s,
    color 0.2s;
}

.close-btn:hover {
  background: var(--color-background-mute);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s,
    color 0.2s;
}

.btn:hover {
  background: var(--color-background-mute);
  color: var(--color-accent);
}

.btn:active {
  transform: scale(0.97);
}

/* Keep all three buttons plain/neutral */
.btn.save,
.btn.discard,
.btn.cancel {
  border-color: var(--color-border-hover);
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.actions .btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
</style>
