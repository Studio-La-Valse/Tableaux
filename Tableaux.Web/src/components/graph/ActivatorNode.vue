<template>
  <li>
    <div class="node-header" @click.stop="toggle">
      <span class="toggle-icon">{{ expanded ? '▾' : '▸' }}</span>
      <span class="group-name">{{ group.name }}</span>
    </div>

    <ul v-if="expanded" class="node-children">
      <!-- recurse, passing down the path so far -->
      <ActivatorNode v-for="child in group.children" :key="child.name" :group="child" :parentPath="currentPath"
        @activate="$emit('activate', $event)" />

      <!-- leaf items emit the full path -->
      <li v-for="act in group.activators" :key="act.name" class="leaf"
        @click.stop="$emit('activate', [...currentPath, act.name])">
        {{ act.name }}
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { ActivatorGroup } from '@/stores/graph-node-activator-store'

const props = defineProps<{
  group: ActivatorGroup
  parentPath: string[]
}>()

defineEmits<{
  (e: 'activate', path: string[]): void
}>()

const expanded = ref(false)

// build the path array up to *this* group
const currentPath = computed(() => [...props.parentPath, props.group.name])

function toggle() {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.node-header {
  display: flex;
  align-items: center;
  padding: 2px 6px;
  cursor: pointer;
}

.node-header:hover {
  background: #636363;
}

.toggle-icon {
  width: 1em;
  display: inline-block;
}

.group-name {
  font-weight: 500;
}

.node-children {
  list-style: none;
  margin: 0;
  padding-left: 1.2em;
}

.leaf {
  padding: 2px 6px;
  cursor: pointer;
}

.leaf:hover {
  background: rgb(136, 136, 136);
}
</style>
