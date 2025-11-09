// stores/use-graph-layout-store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type GraphLayoutMode = 'split' | 'graph' | 'controls'

export const useGraphLayoutStore = defineStore('graphLayout', () => {
  const mode = ref<GraphLayoutMode>('split')
  return { mode }
})
