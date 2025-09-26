<template>
  <div
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="unsaved-title"
    @keydown.esc.prevent="$emit('cancel')"
    tabindex="0"
  >
    <div class="modal" ref="modalRef">
      <header class="modal-header">
        <h3 id="unsaved-title">Unsaved Changes</h3>
        <button class="close-btn" @click="$emit('cancel')" aria-label="Close">✖</button>
      </header>

      <p>You have unsaved changes. Save before continuing?</p>

      <div class="actions">
        <button class="btn save" @click="$emit('save')">💾 Save</button>
        <button class="btn discard" @click="$emit('discard')">🚫 Discard</button>
        <button class="btn cancel" @click="$emit('cancel')">❌ Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const modalRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const firstButton = modalRef.value?.querySelector('button') as HTMLButtonElement | null
  firstButton?.focus()
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: var(--color-background);
  color: var(--color-text);
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
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
  transition: background-color 0.2s, transform 0.1s, color 0.2s;
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
  transition: background 0.2s, transform 0.1s, color 0.2s;
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
</style>
