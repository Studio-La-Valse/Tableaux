<template>
  <div
    class="panel"
    @dblclick.stop="dblclick"
  >
    <p>IIII</p>
  </div>

  <Teleport to="body">
    <CustomNodeComponent
      v-if="visible"
      :initial-def="initialData"
      mode="edit"
      @close="() => (visible = false)"
      @save="update"
    />
  </Teleport>
</template>

<script setup lang="ts">
import type { GraphNode } from '@/graph/core/graph-node'
import type { CustomNodeDefinition } from '@/graph/graph-nodes/json/dynamic-graph-node'
import { computed, ref } from 'vue'
import {
  createAndRegisterCustomNode,

} from '@/graph/graph-nodes/json/dynamic-graph-node'
import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry'
import { useGraphStore } from '@/stores/use-graph-store'
import CustomNodeComponent from '../CustomNode/CustomNodeModal.vue'

const props = defineProps<{
  graphNode: GraphNode
}>()
const graphNodeRegistry = useGraphNodeRegistry()
const graph = useGraphStore()

const visible = ref(false)
const initialData = computed(
  () => graphNodeRegistry.getDefinition(props.graphNode.nodePath)?.__customNodeDefinition,
)

function dblclick() {
  visible.value = true
}

function update(def: CustomNodeDefinition) {
  createAndRegisterCustomNode(def)

  const model = graph.toModel()
  graph.fromModel(model)
}
</script>

<style lang="css" scoped></style>
