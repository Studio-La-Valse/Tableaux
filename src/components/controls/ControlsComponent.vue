<template>
  <div class="emitter-form">
    <!-- Header with collapse toggle -->
    <div class="form-header">
      <span class="form-title">Emitters</span>

      <div class="header-actions">
        <button
          class="show-hidden-button"
          type="button"
          :title="showHidden ? 'Hide hidden' : 'Show hidden'"
          @click.stop="showHidden = !showHidden"
        >
          <component
            :is="showHidden ? EyeIcon : EyeSlashIcon"
            class="icon"
          />
        </button>
      </div>
    </div>

    <div class="scroll-area">
      <ControlsList :show-hidden="showHidden" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Heroicons (outline)
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import ControlsList from './ControlsList.vue'

const showHidden = ref(false)
</script>

<style scoped>
.emitter-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background);
  padding: 8px;
  pointer-events: auto;
  color: var(--color-text);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--color-background-soft);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  user-select: none;
}

.form-title {
  font-weight: bold;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.show-hidden-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  padding: 0;
  border: none;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.icon {
  width: 20px;
  height: 20px;
  stroke: var(--color-text);
}

.scroll-area {
  overflow-y: auto;
  padding-top: 5px;
}
</style>
