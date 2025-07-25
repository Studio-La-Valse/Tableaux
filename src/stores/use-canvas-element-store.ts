import type { Geometry } from '@/models/geometry/geometry'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasElementStore = defineStore('canvas-elements', () => {
  const elements: Ref<Geometry[]> = ref([])

  function setElements(_elements: Geometry[]) {
    elements.value = [..._elements]
  }

  return { elements, setElements }
})
