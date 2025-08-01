import type { Shape } from '@/models/geometry/geometry'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasElementStore = defineStore('canvas-elements', () => {
  const elements: Ref<Shape[]> = ref([])

  function setElements(_elements: Shape[]) {
    elements.value = [..._elements]
  }

  return { elements, setElements }
})
