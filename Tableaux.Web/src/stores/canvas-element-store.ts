import type { DrawableElement } from '@/models/drawable-elements/drawable-element'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasElementStore = defineStore('canvas-elements', () => {
  const elements: Ref<DrawableElement[]> = ref([])

  return { elements }
})
