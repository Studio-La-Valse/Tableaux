<template>

  <PanelGroup direction="horizontal" class="emitter-panels">

    <!-- New control buttons column -->
    <Panel :default-size="40" :min-size="10">
      <div class="column">
        <div v-for="emitter in emitters" :key="emitter.id" class="emitter-row name-with-buttons name-cell">
          <div class="button-group">
            <button type="button" class="ctrl-btn" @click="zoom(emitter)">
              🔍
            </button>
            <button type="button" class="ctrl-btn" @click="toggleVisible(emitter)">
              {{ emitter.data.hidden ? '🙈' : '👀' }}
            </button>
          </div>
          <input type="text" :placeholder="emitter.id" :value="emitter.data.name"
            @input="handleNameInputFor(emitter, $event)" @keydown="handleKeyDown" @mousedown.stop />
        </div>
      </div>
    </Panel>

    <!-- Handle -->
    <PanelResizeHandle with-handle class="resize-handle">
      <div class="handle-grip"></div>
    </PanelResizeHandle>

    <!-- Value column -->
    <Panel :default-size="60" :min-size="10">
      <div class="column">
        <div v-for="emitter in emitters" :key="emitter.id" class="emitter-row value-cell">
          <!-- text -->
          <input v-if="emitter.type === 'text'" type="text" :value="(emitter.data.value as string)"
            @input="handleValueInputFor(emitter, emitter.type, $event)" @keydown="handleKeyDown" @mousedown.stop />

          <!-- number -->
          <input v-else-if="emitter.type === 'number'" type="number" :value="(emitter.data.value as number)"
            @input="handleValueInputFor(emitter, emitter.type, $event)" @keydown="handleKeyDown" @mousedown.stop />

          <!-- toggle (boolean) -->
          <input v-else-if="emitter.type === 'toggle'" type="checkbox" :checked="(emitter.data.value as boolean)"
            @change="handleValueInputFor(emitter, emitter.type, $event)" @mousedown.stop />

          <!-- button -->
          <button v-else-if="emitter.type === 'button'" type="button"
            :class="['momentary-btn', { active: pressedId === emitter.id }]" @mousedown.stop="onButtonDown(emitter)"
            @touchstart.stop.prevent="onButtonTouchStart(emitter)">
            {{ emitter.data.value ? '🟩' : '⭕' }}
          </button>

          <!-- range -->
          <input v-else-if="emitter.type === 'range'" type="range" min="0" max="1" step="0.01"
            :value="(emitter.data.value as number)" @input="handleValueInputFor(emitter, emitter.type, $event)"
            @mousedown.stop @mouseup="commitIfChanged" />

          <!-- color -->
          <input v-else-if="emitter.type === 'color'" type="color" :value="(emitter.data.value as number)"
            @input="handleValueInputFor(emitter, emitter.type, $event)" @keydown="handleKeyDown" @mousedown.stop />
        </div>
      </div>
    </Panel>
  </PanelGroup>


</template>

<script setup lang="ts">
import { PanelGroup, Panel, PanelResizeHandle } from 'vue-resizable-panels'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { Emitter } from '@/graph/core/emitter'
import type { JsonValue } from '@/graph/core/models/json-value'
import { useGraphStore } from '@/stores/use-graph-store'
import { storeToRefs } from 'pinia'
import { useGraphNodeSelectionStore } from '@/stores/use-graph-node-selection-store'
import { useZoomToNodes } from '@/composables/use-zoom-to-nodes'

const props = defineProps<{ showHidden: boolean }>()

const { selectNode } = useGraphNodeSelectionStore()
const { zoomToNodes } = useZoomToNodes()

const graphStore = useGraphStore()
const graph = storeToRefs(graphStore)
const emitters = computed(() =>
  props.showHidden
    ? graph.nodes.value
      .filter(v => v.innerNode instanceof Emitter)
      .map(v => v.innerNode as Emitter<JsonValue>)
    : graph.nodes.value
      .filter(v => v.innerNode instanceof Emitter && !v.innerNode.data.hidden)
      .map(v => v.innerNode as Emitter<JsonValue>)
)

const wrapperRef = ref<HTMLElement | null>(null)
let changed = false

// Track which button emitter is currently pressed (momentary)
const pressedId = ref<string | null>(null)

// --- Field input handlers ---
const handleNameInputFor = (graphNode: Emitter<JsonValue>, event: Event) => {
  graphNode.assignName((event.target as HTMLInputElement).value)
  changed = true
}

const handleValueInputFor = (
  graphNode: Emitter<JsonValue>,
  type: string,
  event: Event
) => {
  const target = event.target as HTMLInputElement
  let value: JsonValue

  if (type === 'number' || type === 'range') {
    value = target.valueAsNumber
  } else if (type === 'toggle') {
    value = target.checked
  } else {
    value = target.value
  }

  graphNode.onChange(value)
  changed = true
}

// --- Button: momentary behavior ---
const onButtonDown = (graphNode: Emitter<JsonValue>) => {
  pressedId.value = graphNode.id
  graphNode.onChange(true)
  // listen for release anywhere
  window.addEventListener('mouseup', onGlobalButtonRelease, { once: true, capture: true })
  window.addEventListener('touchend', onGlobalButtonRelease, { once: true, capture: true })
  window.addEventListener('touchcancel', onGlobalButtonRelease, { once: true, capture: true })
}

const onButtonTouchStart = (graphNode: Emitter<JsonValue>) => {
  pressedId.value = graphNode.id
  graphNode.onChange(true)
  window.addEventListener('mouseup', onGlobalButtonRelease, { once: true, capture: true })
  window.addEventListener('touchend', onGlobalButtonRelease, { once: true, capture: true })
  window.addEventListener('touchcancel', onGlobalButtonRelease, { once: true, capture: true })
}

const onGlobalButtonRelease = () => {
  if (!pressedId.value) return
  const e = emitters.value.find(x => x.id === pressedId.value)
  if (e) {
    e.onChange(false)
    graphStore.commit()
  }
  pressedId.value = null
  changed = false
}

// --- Commit on outside click ---
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    // Blur all focusable inputs inside the form
    const inputs = wrapperRef.value.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select, button'
    )
    inputs.forEach(el => el.blur())

    commitIfChanged()
  }
}

const commitIfChanged = () => {
  if (changed) {
    graphStore.commit()
  }
  changed = false
}

// --- Escape key blur ---
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    (event.target as HTMLElement).blur()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside, { capture: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside, { capture: true })
})


// --- Control buttons stuff ---
const zoom = (emitter: Emitter<JsonValue>) => {
  zoomToNodes([emitter.id])
  selectNode(emitter.id)
}

const toggleVisible = (emitter: Emitter<JsonValue>) => {
  emitter.data.hidden = !emitter.data.hidden
}
</script>

<style lang="css" scoped>
.emitter-panels {
  display: grid;
  grid-template-columns: subgrid;
  /* modern browsers */
}

.column {
  display: grid;
  grid-auto-rows: 1fr;
  /* every row same height in this column */
}

.emitter-row {
  display: flex;
  align-items: stretch;
  /* make input/button fill height */
}

.emitter-row>* {
  flex: 1;
  height: 24px;
}

.name-with-buttons {
  display: flex;
  align-items: center;
}

.button-group {
  display: flex;
  flex: 0 0 auto;
  /* fixed width, no shrinking */
}

.ctrl-btn {
  width: 24px;
  padding: 0;
  text-align: center;
  background-color: var(--color-background);
  border-radius: 2px;
  border: 1px solid var(--color-border);
}

.ctrl-btn:hover {
  background-color: var(--color-background-mute);
  cursor: pointer;
}

.name-cell input,
.value-cell input[type="text"],
.value-cell input[type="number"],
.value-cell input[type="range"],
.value-cell button {
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
}

.value-cell input[type="checkbox"] {
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid var(--color-textborder);
  border-radius: 4px;
  background: var(--color-background);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  /* for the symbol */
}

/* Default (unchecked) state shows ✕ */
.value-cell input[type="checkbox"]::after {
  content: "✕";
  color: var(--color-text);
}

/* Checked state shows ✓ */
.value-cell input[type="checkbox"]:checked::after {
  content: "✓";
}

/* Optional: background change when checked */
.value-cell input[type="checkbox"]:checked {
  background: var(--color-background-soft);
}

.resize-handle {
  position: relative;
  z-index: 10;
  pointer-events: auto !important;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: transparent;
  cursor: col-resize;
}

.handle-grip {
  width: 8px;
  margin: 0 -2px;
  background: transparent;
  position: relative;
}

.handle-grip::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: var(--color-border);
  border-radius: 1px;
}

.handle-grip:hover::before {
  background: var(--color-accent);
}
</style>
