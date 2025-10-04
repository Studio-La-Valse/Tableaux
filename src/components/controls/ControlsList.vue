<template>
  <div class="controls-list" ref="wrapperRef">
    <div v-for="emitter in emitters" :key="emitter.id" class="emitter-row">
      <!-- Left: buttons + name -->
      <div class="name-cell">
        <div class="button-group">
          <button type="button" class="ctrl-btn" @click="zoom(emitter)">
            <MagnifyingGlassIcon class="icon" />
          </button>
          <button type="button" class="ctrl-btn" @click="toggleVisible(emitter)">
            <component :is="emitter.data.hidden ? EyeSlashIcon : EyeIcon" class="icon" />
          </button>
        </div>
        <input type="text" :placeholder="emitter.id" :value="emitter.data.name" @input="updateName(emitter, $event)"
          @keydown="handleKeyDown" @mousedown.stop />
      </div>

      <!-- Right: dynamic emitter component -->
      <div class="value-cell">
        <component :is="emitterComponents[emitter.type]" :graph-node="emitter" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import { MagnifyingGlassIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

import { Emitter } from '@/graph/core/emitter'
import type { JsonValue } from '@/graph/core/models/json-value'
import { useGraphStore } from '@/stores/use-graph-store'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useZoomToNodes } from '@/composables/use-zoom-to-nodes'

// Emitter components
import ButtonEmitter from '../emitters/ButtonEmitter.vue'
import ToggleEmitter from '../emitters/ToggleEmitter.vue'
import NumberEmitter from '../emitters/NumberEmitter.vue'
import TextEmitter from '../emitters/TextEmitter.vue'
import RangeEmitter from '../emitters/RangeEmitter.vue'
import ColorEmitter from '../emitters/ColorEmitter.vue'

const props = defineProps<{ showHidden: boolean }>()

const { selectNode } = useGraphNodeSelectionStore()
const { zoomToNodes } = useZoomToNodes()
const graphStore = useGraphStore()
const graph = storeToRefs(graphStore)

const wrapperRef = ref<HTMLElement | null>(null)
let changed = false

// Map emitter types to components
const emitterComponents: Record<string, Component> = {
  text: TextEmitter,
  number: NumberEmitter,
  toggle: ToggleEmitter,
  button: ButtonEmitter,
  range: RangeEmitter,
  color: ColorEmitter,
}

// Filter emitters based on visibility
const emitters = computed(() =>
  graph.nodes.value
    .filter(v => v.innerNode instanceof Emitter)
    .map(v => v.innerNode as Emitter<JsonValue>)
    .filter(e => props.showHidden || !e.data.hidden)
)

// --- Input handlers ---
const updateName = (graphNode: Emitter<JsonValue>, event: Event) => {
  graphNode.assignName((event.target as HTMLInputElement).value)
  changed = true
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') (event.target as HTMLElement).blur()
}

// --- Commit changes on outside click ---
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    wrapperRef.value
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select, button')
      .forEach(el => el.blur())
    commitIfChanged()
  }
}

const commitIfChanged = () => {
  if (changed) graphStore.commit()
  changed = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside, { capture: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside, { capture: true })
})

// --- Control buttons ---
const zoom = (emitter: Emitter<JsonValue>) => {
  zoomToNodes([emitter.id])
  selectNode(emitter.id)
}

const toggleVisible = (emitter: Emitter<JsonValue>) => {
  emitter.data.hidden = !emitter.data.hidden
}
</script>

<style scoped>
.controls-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
}

.emitter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  min-height: 32px;
  box-sizing: border-box;
}

/* Left and right halves stretch to row height */
.name-cell,
.value-cell {
  flex: 1 1 0;
  display: flex;
  align-items: stretch; /* children fill vertical space */
  gap: 4px;
  min-width: 0;
  height: 100%;
}

/* Button group stays compact but fills row height */
.button-group {
  display: flex;
  gap: 4px;
  height: 100%;
}

/* Control buttons: square, full-height */
.ctrl-btn {
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: var(--color-background);
  border-radius: 4px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  box-sizing: border-box;
}
.ctrl-btn:hover {
  background-color: var(--color-background-mute);
}

/* Text input and textarea stretch to fill row */
.name-cell input[type="text"],
.value-cell .text-input {
  flex: 1 1 auto;
  height: 100%;
  min-width: 0;
  padding: 0 6px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  box-sizing: border-box;
  line-height: 1.4;
  resize: none;          /* keep consistent height */
  overflow-y: hidden;    /* no scrollbars in 40px row */
}

/* Icons scale nicely inside buttons */
.icon {
  width: 20px;
  height: 20px;
  color: var(--color-text);
  pointer-events: none;
}

</style>
