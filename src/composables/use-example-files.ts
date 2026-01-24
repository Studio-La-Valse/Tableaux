import type { GraphModel } from '@/graph/core/models/graph-model'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useGraphStore } from '@/stores/use-graph-store'
import { useZoomToNodes } from './use-zoom-to-nodes'

const show = ref(true)

// Load all JSON files from /public/examples/*.json
const exampleFiles = import.meta.glob('@/assets/examples/*.json', {
  eager: false,
  import: 'default',
})

const thumbs = import.meta.glob('/src/assets/examples/*.{jpg,jpeg,png,gif}', {
  eager: true,
  import: 'default',
})

// Build a map: "foo" → "/assets/foo.hash.ext"
const thumbMap = Object.fromEntries(
  Object.entries(thumbs).map(([key, value]) => {
    const base = key.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif)$/i, '')
    return [base, value]
  }),
)

const sortedExamplePaths = computed(() =>
  Object.keys(exampleFiles).sort((a, b) => {
    const nameA = a.split('/').pop()!.toLowerCase()
    const nameB = b.split('/').pop()!.toLowerCase()
    return nameA.localeCompare(nameB)
  }),
)

export function useExampleTiles() {
  const graph = useGraphStore()
  const { nodes } = storeToRefs(graph)
  const { fromModel } = graph

  const { zoomToNodes } = useZoomToNodes()

  function loadExample(path: string) {
    exampleFiles[path]().then((data) => {
      fromModel(data as GraphModel)

      const allIds = nodes.value.map(v => v.modelId)
      if (allIds.length)
        zoomToNodes(allIds, 100)

      show.value = false
    })
  }

  function getThumbnailFor(path: string) {
    const name = path.split('/').pop()?.replace('.json', '')
    return thumbMap[name!]
  }

  return {
    show,
    exampleFiles,
    sortedExamplePaths,
    loadExample,
    getThumbnailFor,
  }
}
