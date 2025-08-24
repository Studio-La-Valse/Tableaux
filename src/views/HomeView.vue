<template>
  <div>
    <!-- Floating button group -->
    <div class="button-group">
      <!-- Toggle direction button -->
      <button @click="toggleDirection" :class="['toggle-btn', direction]"
        :aria-label="`Switch to ${direction === 'horizontal' ? 'vertical' : 'horizontal'} mode`">
        <svg class="icon" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <polyline points="17 11 21 15 17 19" />
          <polyline points="7 11 3 15 7 19" />
          <line x1="21" y1="15" x2="3" y2="15" />
        </svg>
      </button>

      <!-- Add Google link button -->
      <button class="toggle-btn" @click="navigateToGithub" aria-label="Add Google Link">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 .297a12 12 0 0 0-3.79 23.4c.6.113.82-.26.82-.577v-2.02c-3.34.726-4.04-1.61-4.04-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.304-.536-1.527.117-3.18 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.876.12 3.18.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.476 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576A12 12 0 0 0 12 .297z" />
        </svg>
      </button>
    </div>


    <!-- Your split area -->
    <div class="split-container" :class="direction">
      <GraphCanvas class="graph" />
      <CanvasComponent class="design" />
    </div>

    <!-- Footer -->
    <div class="fixed-footer">
      {{ lastError || '✅ All clear' }}
    </div>


  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Split from 'split.js'
import GraphCanvas from '@/components/graph/GraphComponent.vue'
import CanvasComponent from '@/components/design/CanvasComponent.vue'

import { lastError } from '@/stores/use-error-log-store'

// derive the instance type from the default export:
type SplitInstance = ReturnType<typeof Split>

const direction = ref<'horizontal' | 'vertical'>('vertical')
let splitInstance: SplitInstance | null = null

function createSplit() {
  if (splitInstance) {
    splitInstance.destroy()
    splitInstance = null
  }

  // pick the pane order based on the current direction
  const panes =
    direction.value === 'horizontal'
      ? ['.graph', '.design']   // graph on the left, design on the right
      : ['.design', '.graph']   // design on top, graph below

  splitInstance = Split(panes, {
    direction: direction.value,
    sizes: [50, 50],
    minSize: [150, 150],
    gutterSize: 4,
    gutter: () => {
      const g = document.createElement('div')
      // Split.js will add both 'gutter' + 'gutter-horizontal' or 'gutter-vertical'
      g.className = 'gutter'
      return g
    }
  })
}


function toggleDirection() {
  direction.value =
    direction.value === 'horizontal' ? 'vertical' : 'horizontal'
}

function navigateToGithub() {
  window.open('https://github.com/Studio-La-Valse/Tableaux/', '_blank')
}

onMounted(() => {
  createSplit()
})

// whenever `direction` changes, rebuild the split
watch(direction, createSplit)
</script>

<style lang="css" scoped>
.button-group {
  position: fixed;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 1000;
}

.toggle-btn {
  width: 50px;
  height: 50px;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.3s;
  z-index: 1000;
}

.toggle-btn:hover {
  background: var(--color-background-mute);
}

.toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

.icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
  transform: rotate(0deg);
}

/* Rotate arrow when in vertical mode */
.toggle-btn.vertical .icon {
  transform: rotate(90deg);
}

.split-container {
  display: flex;
  width: 100vw;
  height: calc(100vh - 30px);
}

.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  font-size: 14px;
}
</style>
