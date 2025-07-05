<template>
  <div class="canvas-toolbar">
    <div class="button-group">
      <button type="button" @click="undo" title="Undo">
        ⏮️
      </button>
      <button type="button" @click="redo" title="Redo">
        ⏭️
      </button>
      <button type="button" @click="save" title="Save">
        💾
      </button>
      <button type="button" @click="load" title="Load">
        📂
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGraph } from '@/stores/graph-store';

const { toModel, fromModel, undo, redo } = useGraph()

const save = async () => {
  const model = toModel()
  const modelString = JSON.stringify(model, null, 2)
  await saveToFile('graph-model.json', modelString)
}

const load = async () => {
  const fileContent = await loadFromFile()
  if (!fileContent) return

  // Parse and use the loaded content
  const model = JSON.parse(fileContent)
  fromModel(model)
}

const saveToFile = async (filename: string, content: string) => {
  try {
    const opts: SaveFilePickerOptions = {
      types: [
        {
          description: 'JSON File',
          accept: { 'application/json': ['.json'] }
        }
      ],
      suggestedName: filename
    }

    // Show save file picker dialog
    const handle = await window.showSaveFilePicker(opts)

    // Create writable stream and write content
    const writable = await handle.createWritable()
    await writable.write(content)
    await writable.close()

    alert('File saved successfully!')
  } catch (err) {
    alert('Failed to save file:' + err)
  }
}

const loadFromFile = async () => {
  try {
    // Show open file picker
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON File',
          accept: { 'application/json': ['.json'] }
        }
      ],
      multiple: false
    })

    // Get file and read its contents
    const file = await fileHandle.getFile()
    const contents = await file.text()
    return contents
  } catch (err) {
    alert('Failed to load file:' + err)
  }
}

</script>

<style lang="css" scoped>
.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);

  /* temp width hack */
  overflow-x: auto;
  white-space: nowrap;
}

.field-group {
  display: flex;
  flex-direction: column;
  width: 150px;
  color: var(--color-text);
}

.field-group label {
  font-size: 0.75rem;
  color: var(--color-text);
  margin-bottom: 4px;
}

.field-group select,
.field-group input {
  font-size: 0.9rem;
  padding: 6px 8px;
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
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
  border-radius: 4px;
}

.lock-header button:hover {
  background: var(--color-border);
  transition: background 0.5s;
}

.ratio-display {
  font-size: 0.9rem;
  color: var(--color-text);
  min-width: 3em;
  text-align: right;
}

/* flip & fullscreen */
.button-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  /* centers buttons vertically */
  gap: 0.5rem;
  font-size: inherit;
}

/* full control of size and alignment */
.button-group button {
  width: 50px;
  /* set to whatever you prefer */
  height: 50px;
  /* or any other height */
  font-size: 1.2rem;
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* optional hover/click effect */
.button-group button:hover {
  background: var(--color-background-soft);
}

.button-group button:active {
  transform: scale(0.97);
}

.button-group button:disabled {
  background-color: #888c91;
  color: #d0d0d0;
  cursor: not-allowed;
  opacity: 0.7;
}

/* focus ring */
.field-group select:focus,
.field-group input:focus {
  outline: none;
  border-color: #6094f0;
  box-shadow: 0 0 0 2px rgba(96, 148, 240, 0.3);
}
</style>
