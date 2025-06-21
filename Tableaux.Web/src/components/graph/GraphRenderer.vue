<template>
  <GraphEdgesRenderer />


  <GraphNodesRenderer />

</template>


<script setup lang="ts">
import { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter';
import { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter';
import { Logger } from '@/models/graph/graph-nodes/generic/logger';
import { Merge } from '@/models/graph/graph-nodes/generic/merge';
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store';
import { useGraph } from '@/stores/graph-store';
import { onMounted } from 'vue';
import GraphEdgesRenderer from './GraphEdgesRenderer.vue';
import GraphNodesRenderer from './GraphNodesRenderer.vue';

const { clear, addNode, connect, tick } = useGraph();
const { register } = useGraphNodeActivatorCollection();

register(["Emitters", "Text"], () => new TextEmitter())
register(['Emitters', 'Number'], () => new NumberEmitter())
register(["Generic", "Merge"], () => new Merge())
register(["Generic", "Logger"], () => new Logger())

clear();

const text = addNode(["Emitters", "Text"], { x: 0, y: 0 })
const number1 = addNode(['Emitters', 'Number'], { x: 0, y: 100 })
const number2 = addNode(['Emitters', 'Number'], { x: 0, y: 200 })
const merge = addNode(["Generic", "Merge"], { x: 200, y: 100 }) as Merge
const logger = addNode(["Generic", "Logger"], { x: 400, y: 100 })

merge.add();
merge.add();

connect(text.id, 0, merge.id, 0)
connect(number1.id, 0, merge.id, 1)
connect(number2.id, 0, merge.id, 2)
connect(merge.id, 0, logger.id, 0)

onMounted(() => {
  tick()
})
</script>
