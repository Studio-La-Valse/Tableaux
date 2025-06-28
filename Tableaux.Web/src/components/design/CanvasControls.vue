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
          <option value="50">50 %</option>
          <option value="75">75 %</option>
          <option value="100">100 %</option>
          <option value="150">150 %</option>
          <option value="200">200 %</option>
        </optgroup>
      </select>
    </div>

    <!-- Width input -->
    <div class="field-group">
      <label for="canvas-width">Width</label>
      <input id="canvas-width" type="number" min="1" v-model.number="innerWidth" />
    </div>

    <!-- Height input -->
    <div class="field-group">
      <label for="canvas-height">Height</label>
      <input id="canvas-height" type="number" min="1" v-model.number="innerHeight" />
    </div>

    <!-- Full-screen button -->
    <div class="field-group button-group">
      <button type="button" @click="onFullScreen">
        Full Screen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'

type optionItem = { label: string, w: number, h: number }
type option = { label: string, items: optionItem[] }
type ZoomMode = 'fit' | '50' | '75' | '100' | '150' | '200'

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

// same preset-groups from before
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

// flatten for lookup
const allPresets = computed(() =>
  presetGroups.flatMap(g => g.items)
)

const { width, height, zoomMode } = toRefs(props)

const innerWidth = ref(width.value)
const innerHeight = ref(height.value)
const mode = ref<ZoomMode>(zoomMode.value)
const selectedPreset = ref<string>('custom')

function onFullScreen() {
  emit('fullScreen')
}

// apply preset
watch(selectedPreset, label => {
  if (label === 'custom') return
  const p = allPresets.value.find(p => p.label === label)
  if (!p) return
  innerWidth.value = p.w
  innerHeight.value = p.h
})

// emit changes
watch(innerWidth, v => emit('update:width', v))
watch(innerHeight, v => emit('update:height', v))
watch(mode, v => emit('update:zoomMode', v))

// keep in sync if parent changes
watch(width, v => {
  if (v !== innerWidth.value) {
    innerWidth.value = v
    selectedPreset.value = 'custom'
  }
})
watch(height, v => {
  if (v !== innerHeight.value) {
    innerHeight.value = v
    selectedPreset.value = 'custom'
  }
})
watch(zoomMode, v => (mode.value = v))

// detect manual match
watch(
  [innerWidth, innerHeight],
  ([w, h]) => {
    const match = allPresets.value.find(p => p.w === w && p.h === h)
    selectedPreset.value = match ? match.label : 'custom'
  }
)
</script>

<style scoped>
.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: #2b2b2b;
  border-bottom: 1px solid #444;
}

.field-group {
  display: flex;
  flex-direction: column;
  width: 150px
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
  box-sizing: border-box;
}

/* focus styles */
.field-group select:focus,
.field-group input:focus {
  outline: none;
  border-color: #6094f0;
  box-shadow: 0 0 0 2px rgba(96, 148, 240, 0.3);
}

/* optgroup labels use browser default coloring */
/* push the button to the far right */
.button-group {
  margin-left: auto;
}

/* button style matches dark inputs */
.button-group button {
  font-size: 0.9rem;
  padding: 6px 12px;
  background: #444;
  color: #eee;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.button-group button:hover {
  background: #555;
}
</style>
