<template>
  <div class="canvas-toolbar">
    <!-- Presets dropdown -->
    <div class="field-group">
      <label for="preset">Preset</label>
      <select id="preset" v-model="selectedPreset">
        <option value="custom">Custom</option>
        <optgroup v-for="group in presetGroups" :key="group.label" :label="group.label">
          <option v-for="p in group.items" :key="p.label" :value="p.label">
            {{ p.label }}
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Zoom mode -->
    <div class="field-group">
      <label for="zoom-mode">Zoom</label>
      <select id="zoom-mode" v-model="mode">
        <optgroup label="Auto">
          <option value="fit">Fit</option>
        </optgroup>
        <optgroup label="Scale">
          <option value="50">50 %</option>
          <option value="75">75 %</option>
          <option value="100">100 %</option>
          <option value="150">150 %</option>
          <option value="200">200 %</option>
        </optgroup>
      </select>
    </div>

    <!-- Width input -->
    <div class="field-group">
      <label for="canvas-width">Width</label>
      <input id="canvas-width" type="number" required min="1" step="1" pattern="\d+" :value="innerWidth"
        @input="onWidthInput(($event.target as HTMLInputElement).value)" />
    </div>

    <!-- Lock ratio toggle + display -->
    <div class="field-group lock-group">
      <label>Lock Ratio</label>
      <div class="lock-header">
        <button type="button" :class="{ locked: aspectLocked }" :aria-pressed="aspectLocked" @click="toggleLock" :title="aspectLocked
          ? `Locked at ${displayRatio}`
          : 'Unlock ratio control'">
          {{ aspectLocked ? '🔒' : '🔓' }}
        </button>
        <span class="ratio-display">{{ displayRatio }}</span>
      </div>
    </div>

    <!-- Height input -->
    <div class="field-group">
      <label for="canvas-height">Height</label>
      <input id="canvas-height" type="number" required min="1" step="1" pattern="\d+" :value="innerHeight"
        @input="onHeightInput(($event.target as HTMLInputElement).value)" />
    </div>

    <!-- Flip & Full-screen buttons -->
    <div class="button-group">
      <button type="button" class="btn-flip" @click="onFlip" title="Swap Width ↔ Height">
        🔄
      </button>

      <button type="button" class="btn-fullscreen" @click="onFullScreen" title="Toggle Full Screen">
        ⛶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'

type optionItem = { label: string; w: number; h: number }
type option = { label: string; items: optionItem[] }
type ZoomMode = 'fit' | '50' | '75' | '100' | '150' | '200'

// Props & Emits
const props = defineProps<{
  width: number
  height: number
  zoomMode: ZoomMode
}>()
const emit = defineEmits<{
  (e: 'update:width', v: number): void
  (e: 'update:height', v: number): void
  (e: 'update:zoomMode', v: ZoomMode): void
  (e: 'fullScreen'): void
}>()

// Preset data
const presetGroups: option[] = [
  {
    label: '4:3',
    items: [
      { label: '640×480', w: 640, h: 480 },
      { label: '800×600', w: 800, h: 600 },
      { label: '1024×768', w: 1024, h: 768 },
      { label: '1280×960', w: 1280, h: 960 },
      { label: '1600×1200', w: 1600, h: 1200 }
    ]
  },
  {
    label: '16:10',
    items: [
      { label: '1280×800', w: 1280, h: 800 },
      { label: '1440×900', w: 1440, h: 900 },
      { label: '1680×1050', w: 1680, h: 1050 },
      { label: '1920×1200', w: 1920, h: 1200 }
    ]
  },
  {
    label: '16:9',
    items: [
      { label: '1280×720', w: 1280, h: 720 },
      { label: '1366×768', w: 1366, h: 768 },
      { label: '1600×900', w: 1600, h: 900 },
      { label: '1920×1080', w: 1920, h: 1080 },
      { label: '2560×1440', w: 2560, h: 1440 },
      { label: '3840×2160', w: 3840, h: 2160 }
    ]
  },
  {
    label: '21:9',
    items: [
      { label: '2560×1080', w: 2560, h: 1080 },
      { label: '3440×1440', w: 3440, h: 1440 },
      { label: '5120×2160', w: 5120, h: 2160 }
    ]
  },
  {
    label: 'Square',
    items: [
      { label: '256×256', w: 256, h: 256 },
      { label: '512×512', w: 512, h: 512 },
      { label: '1024×1024', w: 1024, h: 1024 },
      { label: '2048×2048', w: 2048, h: 2048 }
    ]
  }
] as const
const allPresets = computed(() =>
  presetGroups.flatMap(g => g.items)
)

// Reactive state
const { width, height, zoomMode } = toRefs(props)
const innerWidth = ref(width.value)
const innerHeight = ref(height.value)
const mode = ref<ZoomMode>(zoomMode.value)
const selectedPreset = ref('custom')

// Aspect-ratio lock
const aspectLocked = ref(false)
const ratio = ref(innerWidth.value / innerHeight.value)
const displayRatio = computed(() => {
  const w = innerWidth.value
  const h = innerHeight.value
  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b)
  const g = gcd(w, h)
  return `${w / g}:${h / g}`
})


// Toggle lock and capture current ratio
function toggleLock() {
  aspectLocked.value = !aspectLocked.value
  if (aspectLocked.value) {
    ratio.value = innerWidth.value / innerHeight.value
  }
}

// Input handlers that clamp to >=1 integer
function onWidthInput(val: string) {
  let n = Math.round(Number(val))
  if (isNaN(n) || n < 1) n = 1
  innerWidth.value = n
  if (aspectLocked.value) {
    innerHeight.value = Math.max(1, Math.round(n / ratio.value))
  }
}
function onHeightInput(val: string) {
  let n = Math.round(Number(val))
  if (isNaN(n) || n < 1) n = 1
  innerHeight.value = n
  if (aspectLocked.value) {
    innerWidth.value = Math.max(1, Math.round(n * ratio.value))
  }
}

// Flip and Full-Screen
function onFlip() {
  ;[innerWidth.value, innerHeight.value] = [
    innerHeight.value,
    innerWidth.value
  ]
  if (aspectLocked.value) {
    ratio.value = innerWidth.value / innerHeight.value
  }
}
function onFullScreen() {
  emit('fullScreen')
}

// Preset watcher (also re-compute ratio if locked)
watch(selectedPreset, label => {
  if (label === 'custom') return
  const p = allPresets.value.find(x => x.label === label)
  if (!p) return
  innerWidth.value = p.w
  innerHeight.value = p.h
  if (aspectLocked.value) {
    ratio.value = p.w / p.h
  }
})

// Emit updates outward
watch(innerWidth, v => emit('update:width', v))
watch(innerHeight, v => emit('update:height', v))
watch(mode, v => emit('update:zoomMode', v))

// Sync if parent prop changes
watch(width, v => { innerWidth.value = v; selectedPreset.value = 'custom' })
watch(height, v => { innerHeight.value = v; selectedPreset.value = 'custom' })
watch(zoomMode, v => (mode.value = v))

// Detect manual “custom” dims
watch([innerWidth, innerHeight], ([w, h]) => {
  const m = allPresets.value.find(x => x.w === w && x.h === h)
  selectedPreset.value = m ? m.label : 'custom'
})
</script>

<style scoped>
.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: #2b2b2b;
  border-bottom: 1px solid #444;

  /* temp width hack */
  overflow-x: auto;
  white-space: nowrap;
}

.field-group {
  display: flex;
  flex-direction: column;
  width: 150px;
}

.field-group label {
  font-size: 0.75rem;
  color: #ddd;
  margin-bottom: 4px;
}

.field-group select,
.field-group input {
  font-size: 0.9rem;
  padding: 6px 8px;
  background: #3a3a3a;
  color: #eee;
  border: 1px solid #555;
  border-radius: 4px;
}

/* lock-ratio area */
.lock-group {
  align-items: flex-start;
  width: auto;
}

.lock-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lock-header button {
  font-size: 1.2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.lock-header button.locked {
  color: #4caf50;
}

.lock-header button:not(.locked) {
  color: #aaa;
}

.ratio-display {
  font-size: 0.9rem;
  color: #ddd;
  min-width: 3em;
  text-align: right;
}

/* flip & fullscreen */
.button-group {
  margin-left: auto;
  display: flex;
  align-items: center; /* centers buttons vertically */
  gap: 0.5rem;
}

/* full control of size and alignment */
.button-group button {
  width: 50px;       /* set to whatever you prefer */
  height: 50px;      /* or any other height */
  font-size: 0.9rem;
  background: #444;
  color: #eee;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* optional hover/click effect */
.button-group button:hover {
  background: #555;
}
.button-group button:active {
  transform: scale(0.97);
}

.button-group button:hover {
  background: #555;
}

/* focus ring */
.field-group select:focus,
.field-group input:focus {
  outline: none;
  border-color: #6094f0;
  box-shadow: 0 0 0 2px rgba(96, 148, 240, 0.3);
}
</style>
