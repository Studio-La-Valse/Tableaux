<template>
  <div class="tree-container">
    <input ref="inputRef" v-model="search" class="tree-filter" type="text" placeholder="Filter nodes…" />

    <ul class="tree-root" v-if="filteredGroup">
      <ActivatorNode v-for="child in filteredGroup.children" :key="child.name" :group="child" :parentPath="[]"
        :forceExpand="search !== ''" @activate="$emit('activate', $event)" />
    </ul>

    <div class="no-results" v-else>
      No matching nodes found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ActivatorNode from '@/components/graph/NodeBrowser/ActivatorNode.vue'
import { useGraphNodeActivatorCollection, type ActivatorGroup } from '@/stores/graph-node-activator-store';

const { filterTree } = useGraphNodeActivatorCollection();

const props = defineProps<{ rootGroup: ActivatorGroup }>()
defineEmits<{ (e: 'activate', path: string[]): void }>()

const search = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const filteredGroup = computed(() => {
  return search.value.trim()
    ? filterTree(props.rootGroup, search.value.trim())
    : props.rootGroup
})

// Focus when tree mounts
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.tree-container {
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  width: 240px;
  overflow-y: auto;
  padding: 4px;
  user-select: none;
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
  border: 1px solid #ccc;
  font-size: 14px;
}

.no-results {
  padding: 8px;
  color: #777;
  font-style: italic;
}
</style>
