<template>
  <div class="example-thumbnails">
    <div
      v-for="(_, path) in exampleFiles"
      :key="path"
      class="thumbnail"
      @mousedown.stop
      @click.stop="loadExample(path)"
    >
      {{ path.split('/').pop() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GraphModel } from '@/graph/core/models/graph-model'
import { storeToRefs } from 'pinia'
import { useZoomToNodes } from '@/composables/use-zoom-to-nodes'
import { useGraphStore } from '@/stores/use-graph-store'

const emit = defineEmits<{
  (e: 'load'): void
}>()

const graph = useGraphStore()
const { nodes } = storeToRefs(graph)
const { fromModel } = graph

const { zoomToNodes } = useZoomToNodes()

// Load all JSON files from /public/examples/*.json
const exampleFiles = import.meta.glob('/src/assets/examples/*.json', {
  eager: false,
  import: 'default',
})

function loadExample(path: string) {
  exampleFiles[path]().then((data) => {
    fromModel(data as GraphModel) // or whatever your loader is called

    const allIds = nodes.value.map(v => v.modelId)
    if (allIds.length)
      zoomToNodes(allIds, 100)

    emit('load')
  })
}
</script>

<style>
/* thumbnails */
.example-thumbnails {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 999;
  background: rgba(0,0,0,0.4);
  padding: 12px;
  border-radius: 8px;
}

.thumbnail {
  background: white;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.thumbnail:hover {
  background: #eee;
}
</style>
