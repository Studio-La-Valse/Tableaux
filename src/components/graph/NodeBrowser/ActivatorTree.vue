<template>
  <div
    v-if="menu.visible"
    class="tree-container"
    @mousedown.stop
    @wheel.capture="onWheel"
    :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
  >
    <input
      ref="inputRef"
      v-model="search"
      class="tree-filter"
      type="text"
      placeholder="Filter nodes…"
    />

    <ul class="tree-root" v-if="filteredGroup">
      <ActivatorNode
        v-for="child in filteredGroup.children"
        :key="child.name"
        :group="child"
        :parentPath="[]"
        :forceExpand="search !== ''"
      />

      <!-- leaf items emit the full path -->
      <li
        v-for="act in filteredGroup.activators"
        :key="act.name"
        class="leaf"
        @click.stop="(evt) => clickNode(evt, act.name)"
      >
        {{ act.name + (act.definition.customTemplate ? ' [C]' : '') }}
      </li>
    </ul>

    <div class="no-results" v-else>No matching nodes found.</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
  import ActivatorNode from '@/components/graph/NodeBrowser/ActivatorNode.vue';
  import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry';
  import { useContextMenuStore } from '@/stores/use-context-menu-store';

  const menu = useContextMenuStore();
  const { filterTree } = useGraphNodeRegistry();

  const rootGroup = useGraphNodeRegistry().activatorTree;

  const search = ref('');
  const inputRef = ref<HTMLInputElement | null>(null);

  const filteredGroup = computed(() => {
    return search.value.trim() ? filterTree(rootGroup, search.value.trim()) : rootGroup;
  });

  const clickNode = (evt: MouseEvent, nodeName: string) => {
    menu.onActivate([nodeName]);
  };

  const onWheel = (evt: WheelEvent) => {
    evt.stopPropagation();
  };

  const close = (e: KeyboardEvent) => {
    if (e.key == 'Escape') menu.close();
  };

  onMounted(() => {
    watch(
      () => menu.visible,
      (newValue: boolean) => {
        if (newValue) {
          nextTick(() => {
            inputRef.value?.focus();
          });
        } else {
          search.value = '';
        }
      }
    );

    window.addEventListener('keydown', close);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', close);
  });
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
