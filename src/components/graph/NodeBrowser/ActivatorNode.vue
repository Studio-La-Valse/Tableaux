<template>
  <li>
    <div class="node-header" @click.stop="toggle">
      <span class="toggle-icon">{{ expanded ? '▾' : '▸' }}</span>
      <span class="group-name">{{ group.name }}</span>
    </div>

    <ul v-if="expanded" class="node-children">
      <!-- recurse, passing down the path so far -->
      <ActivatorNode v-for="child in group.children" :key="child.name" :group="child" :parentPath="currentPath"
        :forceExpand="forceExpand" />

      <!-- leaf items emit the full path -->
      <li v-for="act in group.activators" :key="act.name" class="leaf" @click.stop="(evt) => clickNode(evt, act.name)">
        {{ act.name }}
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { ActivatorGroup } from '@/stores/use-graph-node-activator-store'
import { useContextMenuStore } from '@/stores/use-context-menu-store';

const menu = useContextMenuStore();

const props = defineProps<{
  group: ActivatorGroup
  parentPath: string[]
  forceExpand?: boolean
}>()

const expanded = ref(props.forceExpand ?? false)

// build the path array up to *this* group
const currentPath = computed(() => [...props.parentPath, props.group.name])

function toggle() {
  expanded.value = !expanded.value
}

const clickNode = (evt: MouseEvent, nodeName: string) => {
  menu.onActivate([...currentPath.value, nodeName])
}

onMounted(() => {
  watch(() => props.forceExpand, (val) => {
    expanded.value = val
  })
})
</script>

<style scoped>
.node-header {
  display: flex;
  align-items: center;
  padding: 2px 6px;
  cursor: pointer;
}

.node-header:hover {
  background: var(--color-background-soft)
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
  background: var(--color-background-mute)
}
</style>
