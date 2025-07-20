import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCanvasPropsStore = defineStore('canvas-props', () => {
  const dimensions = ref<{ x: number; y: number }>({ x: 1920, y: 1080 })

  return { dimensions }
})
