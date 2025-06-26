<template>
  <div class="tree-container" @click.self="$emit('close')">
    <ul class="tree-root">
      <!-- now render only the root’s children -->
      <ActivatorNode v-for="child in rootGroup.children" :key="child.name" :group="child" :parentPath="[]"
        @activate="$emit('activate', $event)" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ActivatorGroup } from '@/stores/graph-node-activator-store'
import ActivatorNode from '@/components/graph/ActivatorNode.vue'

defineProps<{ rootGroup: ActivatorGroup }>()
defineEmits<{
  (e: 'activate', path: string[]): void
  (e: 'close'): void
}>()
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
</style>
