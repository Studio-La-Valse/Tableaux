<template>
  <div v-if="menu.visible" class="tree-container" @wheel.capture="onWheel"
    :style="{ top: menu.y + 'px', left: menu.x + 'px' }">
    <input ref="inputRef" v-model="search" class="tree-filter" type="text" placeholder="Filter nodes…" />

    <ul class="tree-root" v-if="filteredGroup">
      <ActivatorNode v-for="child in filteredGroup.children" :key="child.name" :group="child" :parentPath="[]"
        :forceExpand="search !== ''" />
    </ul>

    <div class="no-results" v-else>
      No matching nodes found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import ActivatorNode from '@/components/graph/NodeBrowser/ActivatorNode.vue'
import { useGraphNodeActivatorStore } from '@/stores/graph-node-activator-store';
import { useContextMenuStore } from '@/stores/context-menu';

const menu = useContextMenuStore()
const { filterTree } = useGraphNodeActivatorStore();

const rootGroup = useGraphNodeActivatorStore().activatorTree;

const search = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const filteredGroup = computed(() => {
  return search.value.trim()
    ? filterTree(rootGroup, search.value.trim())
    : rootGroup
})

const onWheel = (evt: WheelEvent) => {
  evt.stopPropagation();
}

onMounted(() => {
  watch(() => menu.visible, (newValue: boolean) => {
    if (newValue) {
      nextTick(() => {
        inputRef.value?.focus()
      })
    } else {
      search.value = '';
    }
  })
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
  z-index: 1000;
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

.no-results {
  padding: 8px;
  color: var(--color-heading);
  font-style: italic;
}
</style>
