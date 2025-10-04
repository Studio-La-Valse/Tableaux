<template>
  <div class="home-container">
    <!-- Floating button group -->
    <div class="button-group">
      <!-- Direction toggle -->
      <button @click="toggleDirection" :class="['toggle-btn', direction]"
        :aria-label="`Switch to ${direction === 'horizontal' ? 'vertical' : 'horizontal'} mode`">
        <ArrowsRightLeftIcon v-if="direction === 'horizontal'" class="icon" />
        <ArrowsUpDownIcon v-else class="icon" />
      </button>

      <!-- GitHub link -->
      <button class="toggle-btn" @click="navigateToGithub" aria-label="Open GitHub">
        <!-- keep the GitHub SVG, since Heroicons doesn’t provide it -->
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 .297a12 12 0 0 0-3.79 23.4c.6.113.82-.26.82-.577v-2.02c-3.34.726-4.04-1.61-4.04-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.304-.536-1.527.117-3.18 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.876.12 3.18.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.476 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576A12 12 0 0 0 12 .297z" />
        </svg>
      </button>
    </div>

    <!-- Main resizable layout -->
    <PanelGroup :direction="direction" class="split-container">
      <Panel>
        <GraphCanvas class="panel-content" />
      </Panel>

      <PanelResizeHandle :class="['gutter', direction === 'horizontal' ? 'gutter-horizontal' : 'gutter-vertical']" />

      <Panel>
        <CanvasComponent class="panel-content" />
      </Panel>
    </PanelGroup>


    <!-- Footer -->
    <div class="fixed-footer">
      {{ lastError || '✅ All clear' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'

import { ref } from 'vue'
import { Panel, PanelGroup, PanelResizeHandle } from 'vue-resizable-panels'
import GraphCanvas from '@/components/graph/GraphComponent.vue'
import CanvasComponent from '@/components/canvas/CanvasComponent.vue'
import { lastError } from '@/stores/use-error-log-store'

const direction = ref<'horizontal' | 'vertical'>('horizontal')

function toggleDirection() {
  direction.value =
    direction.value === 'horizontal' ? 'vertical' : 'horizontal'
}

function navigateToGithub() {
  window.open('https://github.com/Studio-La-Valse/Tableaux/', '_blank')
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* test comment */
/* Split container fills all space above footer */
.split-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Deep selectors to style internal structure of vue-resizable-panels */
:deep(.PanelGroup) {
  display: flex;
  flex: 1;
  overflow: hidden;
}

:deep(.PanelGroup[direction='vertical']) {
  flex-direction: column;
}

:deep(.Panel) {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Horizontal handles */
:deep(.gutter-horizontal) {
  width: 2px;
  background-color: var(--color-border-hover);
  cursor: col-resize;
}

:deep(.gutter-horizontal:hover::before) {
  height: 4px;
}

/* Vertical handles */
:deep(.gutter-vertical) {
  height: 2px;
  background-color: var(--color-border-hover);
  cursor: row-resize;
}

:deep(.gutter-horizontal:hover::before) {
  height: 4px;
}

:deep(.gutter-horizontal:hover),
:deep(.gutter-vertical:hover) {
  background-color: var(--color-accent);
}

.panel-content {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* Gutters */
.gutter {
  flex-shrink: 0;
}

:deep(.PanelGroup[direction='horizontal'] .gutter) {
  cursor: col-resize;
  width: 4px;
}

:deep(.PanelGroup[direction='vertical'] .gutter) {
  cursor: row-resize;
  height: 4px;
}

/* Floating buttons */
.button-group {
  position: fixed;
  bottom: 40px;
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
}

.icon {
  width: 20px;
  height: 20px;
}

.toggle-btn.vertical .icon {
  transform: rotate(90deg);
}

/* Footer */
.fixed-footer {
  height: 30px;
  background-color: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
