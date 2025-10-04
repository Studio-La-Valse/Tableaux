<template>
  <div class="emitter-form" >
    <!-- Header with collapse toggle -->
    <div class="form-header">
      <span class="form-title">Emitters</span>

      <div class="header-actions">
        <button class="show-hidden-button" type="button" @click.stop="showHidden = !showHidden"
          :title="showHidden ? 'Hide hidden' : 'Show hidden'">
          <component :is="showHidden ? EyeIcon : EyeSlashIcon" class="icon" />
        </button>
      </div>
    </div>

    <div class="scroll-area">
      <ControlsList :show-hidden="showHidden" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ControlsList from './ControlsList.vue'

// Heroicons (outline)
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const showHidden = ref(false)
</script>

<style scoped>
.emitter-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background);
  padding: 8px;
  box-sizing: border-box;
  z-index: 1000;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  /* space between eye and arrow */
}

.icon {
  width: 20px;
  height: 20px;
  stroke: var(--color-text);
}

.show-hidden-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: transparent;
  padding: 0;
  border: none;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.collapse-icon {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  cursor: pointer;
  transform: rotate(90deg);
}

.collapse-icon.collapsed {
  transform: rotate(0deg);
}

.form-title {
  font-weight: bold;
  font-size: 0.95rem;
}

.collapse-icon {
  display: inline-block;
  transition: transform 0.2s ease;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

/* Smooth collapse animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.25s ease, opacity 0.25s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 1000px;
  /* large enough to fit content */
  opacity: 1;
}

.resize-thumb {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 14px;
  height: 14px;
  cursor: nesw-resize;
  z-index: 20;
}

.resize-thumb::after {
  content: '';
  position: absolute;
  left: 2px;
  bottom: 2px;
  width: 10px;
  height: 10px;
  border-left: 2px solid var(--color-border);
  border-bottom: 2px solid var(--color-border);
}

.scroll-area {
  overflow-y: auto;
}
</style>
