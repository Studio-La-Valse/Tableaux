import type { GraphModel } from '@/graph/core/models/graph-model'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cloneFrozen } from '@/graph/core/models/json-value'

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
    return cloneFrozen(model)
  }

  // 4) initialize (or re‐initialize) history
  function init(initial: GraphModel) {
    present.value = duplicate(initial)
    past.value = []
    future.value = []
  }

  // 5) commit a new state
  function commit(model: GraphModel): GraphModel {
    if (!present.value)
      throw new Error('History was not correctly initialized because it has no present state.')

    // Add the current state to the end of the history
    past.value.push(present.value)

    // make sure the history is not longer than maxHistory
    while (past.value.length > maxHistory) past.value.shift()

    // the new present is a duplicate of the provided model
    present.value = duplicate(model)

    // Clear the future
    future.value.length = 0

    // return the original model used for the commit
    return model
  }

  // 6) undo
  function undo(): GraphModel | null {
    if (!present.value)
      throw new Error('History was not correctly initialized because it has no present state.')

    // the new state will be the last item of the history
    const pastValue = past.value.pop()

    // nothing to undo
    if (!pastValue)
      return null

    // insert the current state to the futures
    future.value.unshift(present.value)

    // duplicate if exists
    present.value = pastValue
    return duplicate(present.value)
  }

  // 7) redo
  function redo(): GraphModel | null {
    if (!present.value)
      throw new Error('History was not correctly initialized because it has no present state.')

    // the new state is the first item of the futures
    const futureValue = future.value.shift()

    // nothing to redo
    if (!futureValue)
      return null

    // add the current state to the end of the past states
    past.value.push(present.value)

    // Make sure at most maxHistory items in history by removing first
    while (past.value.length > maxHistory) past.value.shift()

    // Set the present state to the retrieved future state
    present.value = futureValue

    // return a duplicate of the current state
    return duplicate(present.value)
  }

  // 8) selectors
  const hasUndo = computed(() => past.value.length > 0)
  const hasRedo = computed(() => future.value.length > 0)

  return {
    init,
    commit,
    undo,
    redo,
    hasUndo,
    hasRedo,
  }
})
