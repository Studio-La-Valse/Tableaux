<template>
  <div id="split-horizontal">
    <GraphCanvas class="graph">
      <div v-for="f of computedNodes" :key="f.graphNode.id">
        <p>{{ f.graphNode.path.at(-1) }} {{ f.position }}</p>
      </div>
    </GraphCanvas>

    <DesignCanvasPainter class="design" :elements="[]" />
  </div>
</template>

<script setup lang="ts">
import Split from "split.js";
import { computed, onMounted } from "vue";
import GraphCanvas from "@/components/graph/GraphCanvasV2.vue";
import DesignCanvasPainter from "@/components/design/DesignCanvasPainter.vue";
import { NumberEmitter } from "@/models/graph/graph-nodes/emitters/number-emitter";
import { Logger } from "@/models/graph/graph-nodes/generic/logger";
import { Merge } from "@/models/graph/graph-nodes/generic/merge";
import { TextEmitter } from "@/models/graph/graph-nodes/emitters/text-emitter";
import { useGraph } from "@/stores/graph-store";
import { useGraphNodeActivatorCollection } from "@/stores/graph-node-activator-store";

const { clear, addNode, nodes } = useGraph();
const computedNodes = computed(nodes);

const { register } = useGraphNodeActivatorCollection();
register(["Emitters", "Text"], () => new TextEmitter())
register(NumberEmitter.PATH, () => new NumberEmitter())
register(["Generic", "Merge"], () => new Merge())
register(["Generic", "Logger"], () => new Logger())

clear();

const text = addNode(["Emitters", "Text"], {x: 100, y:100})
const number1 = addNode(NumberEmitter.PATH, {x: 200, y: 50})
const number2 = addNode(NumberEmitter.PATH, {x: 200, y: 150})
const merge = addNode(["Generic", "Merge"], {x: 300, y: 100})
const logger = addNode(["Generic", "Logger"], {x: 300, y: 100})

merge.add();
merge.add();

merge.inputAt(0).subscribeTo(text.outputAt(0))
merge.inputAt(1).subscribeTo(number1.outputAt(0))
merge.inputAt(2).subscribeTo(number2.outputAt(0))
logger.inputAt(0).subscribeTo(merge.outputAt(0));

for (let i=0; i<10; i++){
  text.arm();
  number1.arm();
  number2.arm();

  text.next("Hello")
  text.next(", world!")

  number2.next(i)

  text.complete();
  number1.complete();
  number2.complete();
}



onMounted(() => {
  Split([".graph", ".design"], {
    direction: "horizontal",
    sizes: [50, 50],
    minSize: [150, 150],
    gutterSize: 6,
  });
});
</script>

<style lang="css" scoped>
#split-horizontal {
  display: flex;
  width: 100vw;
  height: 100vh;
}
</style>
