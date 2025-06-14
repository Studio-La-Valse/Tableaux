<template>
  <PanelRenderer :emitters="computedNodes.map(e => e.graphNode)" />
</template>


<script setup lang="ts">
import { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter';
import { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter';
import { Logger } from '@/models/graph/graph-nodes/generic/logger';
import { Merge } from '@/models/graph/graph-nodes/generic/merge';
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store';
import { useGraph } from '@/stores/graph-store';
import { computed, onMounted } from 'vue';
import PanelRenderer from './PanelRenderer.vue';


const { clear, addNode, nodes } = useGraph();
const { register } = useGraphNodeActivatorCollection();

const computedNodes = computed(nodes);

register(["Emitters", "Text"], () => new TextEmitter())
register(['Emitters', 'Number'], () => new NumberEmitter())
register(["Generic", "Merge"], () => new Merge())
register(["Generic", "Logger"], () => new Logger())

clear();

const text = addNode(["Emitters", "Text"], { x: 100, y: 100 })
const number1 = addNode(['Emitters', 'Number'], { x: 200, y: 50 })
const number2 = addNode(['Emitters', 'Number'], { x: 200, y: 150 })
const merge = addNode(["Generic", "Merge"], { x: 300, y: 100 }) as Merge
const logger = addNode(["Generic", "Logger"], { x: 300, y: 100 })

merge.add();
merge.add();

text.outputAt(0).connectTo(merge.inputAt(0));
number1.outputAt(0).connectTo(merge.inputAt(1))
number2.outputAt(0).connectTo(merge.inputAt(2))
merge.outputAt(0).connectTo(logger.inputAt(0));

onMounted(() => {
    nodes().map(n => n.graphNode).filter(n => n.numberOfInputs == 0).forEach(n => n.complete())
})
</script>
