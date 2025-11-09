<template>
  <div
    v-if="menu.visible"
    class="tree-container"
    :style="{ top: `${menu.y}px`, left: `${menu.x}px` }"
    @mousedown.stop
    @wheel.capture="onWheel"
  >
    <input
      ref="inputRef"
      v-model="search"
      class="tree-filter"
      type="text"
      placeholder="Filter nodes…"
    >

    <ul
      v-if="filteredGroup"
      class="tree-root"
    >
      <ActivatorNode
        v-for="child in filteredGroup.children.values()"
        :key="child.name"
        :group="child"
        :parent-path="[]"
        :force-expand="search !== ''"
      />

      <!-- leaf items emit the full path -->
      <li
        v-for="act in filteredGroup.activators.values()"
        :key="act.name"
        class="leaf"
        @click.stop="(evt) => clickNode(evt, act.name)"
      >
        {{ act.name + (act.NodeClass.__customNodeDefinition ? " [C]" : "") }}
      </li>
    </ul>

    <div
      v-else
      class="no-results"
    >
      No matching nodes found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import ActivatorNode from '@/components/graph/NodeBrowser/ActivatorNode.vue'
import { useContextMenuStore } from '@/stores/use-context-menu-store'
import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry'

const menu = useContextMenuStore()
const { filterTree } = useGraphNodeRegistry()

const rootGroup = useGraphNodeRegistry().activatorTree

const search = ref('')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

const filteredGroup = computed(() => {
  return search.value.trim() ? filterTree(rootGroup, search.value.trim()) : rootGroup
})

function clickNode(evt: MouseEvent, nodeName: string) {
  menu.onActivate([nodeName], nanoid(11))
}

function onWheel(evt: WheelEvent) {
  evt.stopPropagation()
}

function close(e: KeyboardEvent) {
  if (e.key === 'Escape')
    menu.close()
}

onMounted(() => {
  watch(
    () => menu.visible,
    (newValue: boolean) => {
      if (newValue) {
        nextTick(() => {
          inputRef.value?.focus()
        })
      }
      else {
        search.value = ''
      }
    },
  )

  window.addEventListener('keydown', close)
})

onUnmounted(() => {
  window.removeEventListener('keydown', close)
})
</script>

<style scoped>
.tree-container {
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  width: 240px;
  overflow-y: auto;
  padding: 4px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-background-soft);
  pointer-events: all;
}

.tree-root {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tree-filter {
  margin-bottom: 6px;
  width: 100%;
  padding: 4px 8px;
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border-hover);
  font-size: 14px;
}

.leaf {
  padding: 2px 6px;
  cursor: pointer;
}

.no-results {
  padding: 8px;
  color: var(--color-heading);
  font-style: italic;
}
</style>
