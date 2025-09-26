<template>
  <div class="emitter-form" @mousedown.stop @scroll.stop :style="{ width: width + 'px' }">


    <!-- Header with collapse toggle -->
    <div class="form-header">
      <span class="form-title">Emitters</span>

      <div class="header-actions">
        <button class="show-hidden-button" type="button" @click.stop="showHidden = !showHidden">
          {{ showHidden ? 'showing hidden 👀' : 'hiding hidden 🙈' }}
        </button>
        <span class="collapse-icon" :class="{ collapsed }" @click.stop="collapsed = !collapsed">
          ▶
        </span>
      </div>
    </div>



    <div class="scroll-area">

      <transition name="collapse">
        <div v-show="!collapsed" class="form-body">
          <ControlsList :show-hidden="showHidden" />
        </div>
      </transition>

    </div>

    <!-- Resize thumb -->
    <div class="resize-thumb" @mousedown.prevent="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ControlsList from './ControlsList.vue'

const collapsed = ref(false)
const showHidden = ref(false)

// --- Resizing state ---
const width = ref(300)   // initial width
let resizing = false
let startX = 0
let startWidth = 0

const startResize = (e: MouseEvent) => {
  resizing = true
  startX = e.clientX
  startWidth = width.value
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)
}

const onMouseMove = (e: MouseEvent) => {
  if (!resizing) return
  // Horizontal: anchored right, so drag left increases width, drag right decreases
  width.value = Math.max(200, startWidth - (e.clientX - startX))
}

const stopResize = () => {
  resizing = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.emitter-form {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 200px);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 8px;
  box-sizing: border-box;
  z-index: 1000;
  pointer-events: auto;
  color: var(--color-text);
}

.scroll-area {
  flex: 1;
  overflow: auto;
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
  gap: 6px; /* space between eye and arrow */
}

.show-hidden-button {
  background-color: transparent;
  padding: 0;
  border: none;
  font-size: 1rem; /* match icon size */
  line-height: 1;
  cursor: pointer;
}

.collapse-icon {
  display: inline-block;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
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

.form-body {
  overflow: hidden;
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
</style>
