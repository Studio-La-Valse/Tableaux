<template>
  <div class="emitter-form" ref="wrapperRef" @mousedown.stop>
    <!-- Header with collapse toggle -->
    <div class="form-header" @click="collapsed = !collapsed">
      <span class="form-title">Emitters</span>
      <span class="collapse-icon" :class="{ collapsed }">
        ▶
      </span>
    </div>

    <transition name="collapse">
      <div v-show="!collapsed" class="form-body">
        <PanelGroup direction="horizontal" class="emitter-panels">
          <!-- Name column -->
          <Panel :min-size="10">
            <div class="column name-column">
              <div v-for="emitter in emitters" :key="emitter.id" class="emitter-row name-cell">
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
          <Panel :min-size="10">
            <div class="column value-column">
              <div v-for="emitter in emitters" :key="emitter.id" class="emitter-row value-cell">
                <!-- text -->
                <input v-if="emitter.type === 'text'" type="text" :value="(emitter.data.value as string)"
                  @input="handleValueInputFor(emitter, emitter.type, $event)" @keydown="handleKeyDown"
                  @mousedown.stop />

                <!-- number -->
                <input v-else-if="emitter.type === 'number'" type="number" :value="(emitter.data.value as number)"
                  @input="handleValueInputFor(emitter, emitter.type, $event)" @keydown="handleKeyDown"
                  @mousedown.stop />

                <!-- toggle (boolean) -->
                <input v-else-if="emitter.type === 'toggle'" type="checkbox" :checked="(emitter.data.value as boolean)"
                  @change="handleValueInputFor(emitter, emitter.type, $event)" @mousedown.stop />

                <!-- button -->
                <button v-else-if="emitter.type === 'button'" type="button"
                  :class="['momentary-btn', { active: pressedId === emitter.id }]"
                  @mousedown.stop="onButtonDown(emitter)" @touchstart.stop.prevent="onButtonTouchStart(emitter)">
                  {{ emitter.data.value ? 'pressed' : 'released' }}
                </button>

                <!-- range -->
                <input v-else-if="emitter.type === 'range'" type="range" :value="(emitter.data.value as number)"
                  @input="handleValueInputFor(emitter, emitter.type, $event)" @mousedown.stop />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </transition>


  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { Emitter } from '@/graph/core/emitter'
import type { JsonValue } from '@/graph/core/models/json-value'
import { useGraphStore } from '@/stores/use-graph-store'
import { storeToRefs } from 'pinia'
import { PanelGroup, Panel, PanelResizeHandle } from 'vue-resizable-panels'

const graphStore = useGraphStore()
const graph = storeToRefs(graphStore)

const wrapperRef = ref<HTMLElement | null>(null)
let changed = false

// Track which button emitter is currently pressed (momentary)
const pressedId = ref<string | null>(null)
const collapsed = ref(false)

const emitters = computed(() =>
  graph.nodes.value
    .filter(v => v.innerNode instanceof Emitter)
    .map(v => v.innerNode as Emitter<JsonValue>)
)

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

    if (changed) {
      graphStore.commit()
    }
    changed = false
  }
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
</script>

<style scoped>
.emitter-form {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 560px;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px;
  box-sizing: border-box;
  z-index: 1000;
  pointer-events: auto;
  color: #e9e9e9;
}

/* Header and also collapse */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: #222;
  border-bottom: 1px solid #333;
  cursor: pointer;
  user-select: none;
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

.emitter-panels {
  position: relative;
  isolation: isolate;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.emitter-row {
  display: flex;
  align-items: center;
  padding: 2px;
}

.name-cell input,
.value-cell input[type="text"],
.value-cell input[type="number"],
.value-cell input[type="range"],
.value-cell button {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #3a3a3a;
  background: #151515;
  color: #e9e9e9;
}

.value-cell input[type="checkbox"] {
  /* Match height and width to other inputs */
  width: 100%;
  height: 28px;
  /* same as your text/number input height */
  box-sizing: border-box;

  /* Remove native appearance so we can style it */
  -webkit-appearance: none;
  appearance: none;

  /* Custom look */
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background: #151515;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

}

.value-cell input[type="checkbox"]:checked {
  background: #3a3a3a;
}

.value-cell input[type="checkbox"]::after {
  content: "✓";
  color: #e9e9e9;
  font-size: 16px;
  display: none;
}

.value-cell input[type="checkbox"]:checked::after {
  display: block;
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
  background: #3a3a3a;
  border-radius: 1px;
}

.handle-grip:hover::before {
  background: #5a5a5a;
}
</style>
