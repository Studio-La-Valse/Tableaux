<template>
  <div>
    <!-- Floating toggle button -->
    <button @click="toggleDirection" :class="['toggle-btn', direction]"
      :aria-label="`Switch to ${direction === 'horizontal' ? 'vertical' : 'horizontal'} mode`">
      <!-- two‐headed arrow, will rotate when vertical -->
      <svg class="icon" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <polyline points="17 11 21 15 17 19" />
        <polyline points="7 11 3 15 7 19" />
        <line x1="21" y1="15" x2="3" y2="15" />
      </svg>
    </button>

    <!-- Your split area -->
    <div class="split-container" :class="direction">
      <GraphCanvas class="graph" />
      <CanvasComponent class="design" />
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Split from 'split.js'
import GraphCanvas from '@/components/graph/GraphComponent.vue'
import CanvasComponent from '@/components/design/CanvasComponent.vue'

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

onMounted(createSplit)

// whenever `direction` changes, rebuild the split
watch(direction, createSplit)
</script>

<style>
.toggle-btn {
  position: fixed;
  bottom: 16px;
  left: 16px;
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
  height: 100vh;
}

/* 1) Base orientation */
.horizontal {
  flex-direction: row;
}

.vertical {
  flex-direction: column;
}

/* 2) Force explicit ordering */
.horizontal .graph {
  order: 0;
}

.horizontal .gutter {
  order: 1;
}

.horizontal .design {
  order: 2;
}

.vertical .design {
  order: 0;
}

.vertical .gutter {
  order: 1;
}

.vertical .graph {
  order: 2;
}

/* 3) Match cursor to orientation */
.gutter {
  background-color: var(--color-border);
}

.gutter:hover {
  background: var(--color-border-hover);
}

.horizontal .gutter {
  cursor: col-resize;
}

.vertical .gutter {
  cursor: row-resize;
}
</style>
