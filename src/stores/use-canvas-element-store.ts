import type { DrawableGeometry } from '@/models/geometry/geometry'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasElementStore = defineStore('canvas-elements', () => {
  const elements: Ref<DrawableGeometry[]> = ref([])

  function setElements(_elements: DrawableGeometry[]) {
    elements.value = [..._elements]
  }

  return { elements, setElements }
})
