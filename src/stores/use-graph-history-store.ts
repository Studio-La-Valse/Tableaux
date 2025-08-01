import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GraphModel } from '@/graph/core/models/graph-model'

export type HistoryOptions = {
  maxHistory?: number
}

export const useGraphHistoryStore = defineStore('history', () => {
  // 1) reactive state
  const past = ref<GraphModel[]>([])
  const future = ref<GraphModel[]>([])
  const present = ref<GraphModel | null>(null)

  // 2) option with default
  const maxHistory = 100

  // 3) deep‐clone helper
  function duplicate(model: GraphModel): GraphModel {
    return JSON.parse(JSON.stringify(model))
  }

  // 4) initialize (or re‐initialize) history
  function init(initial: GraphModel) {
    present.value = duplicate(initial)
    past.value = []
    future.value = []
  }

  // 5) commit a new state
  function commit(model: GraphModel): GraphModel {
    if (present.value) {
      past.value.push(duplicate(present.value))
      if (past.value.length > maxHistory) {
        past.value.shift()
      }
    }
    present.value = duplicate(model)
    future.value.length = 0
    return duplicate(present.value)
  }

  // 6) undo
  function undo(): GraphModel | null {
    if (!present.value || past.value.length === 0) return null
    future.value.unshift(duplicate(present.value))
    const pastValue = past.value.pop()
    present.value = pastValue ? duplicate(pastValue) : null
    return present.value
  }

  // 7) redo
  function redo(): GraphModel | null {
    if (!present.value || future.value.length === 0) return null
    past.value.push(duplicate(present.value))
    if (past.value.length > maxHistory) past.value.shift()
    const futureValue = future.value.shift()
    present.value = futureValue ? duplicate(futureValue) : null
    return present.value
  }

  // 8) selectors
  const getPresent = computed(() => present)
  const hasUndo = computed(() => past.value.length > 0)
  const hasRedo = computed(() => future.value.length > 0)

  return {
    init,
    commit,
    undo,
    redo,
    getPresent,
    hasUndo,
    hasRedo,
  }
})
