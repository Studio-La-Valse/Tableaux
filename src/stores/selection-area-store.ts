import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useSelectionAreaStore = defineStore('selectionArea', () => {
  const selecting: Ref<boolean> = ref(false)
  const start = { x: 0, y: 0 }
  const rect = ref({ x: 0, y: 0, width: 0, height: 0 })
  const threshold = 5

  function begin(x: number, y: number) {
    start.x = x; start.y = y
    rect.value = { x, y, width: 0, height: 0 }
    selecting.value = false
  }

  function update(x: number, y: number) {
    const dx = x - start.x, dy = y - start.y
    if (!selecting.value && Math.hypot(dx, dy) > threshold) {
      selecting.value = true
    }
    if (selecting.value) {
      rect.value = {
        x:      Math.min(start.x, x),
        y:      Math.min(start.y, y),
        width:  Math.abs(dx),
        height: Math.abs(dy),
      }
    }
  }

  function end() {
    selecting.value = false
    return rect.value
  }

  return { selecting, rect, begin, update, end }
})
