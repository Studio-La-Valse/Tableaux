<template>
  <GraphEdgesRenderer />
  <GraphNodesRenderer />
</template>


<script setup lang="ts">
import { useGraphNodeActivatorCollection } from '@/stores/graph-node-activator-store';
import { useGraph } from '@/stores/graph-store';
import GraphEdgesRenderer from './GraphEdgesRenderer.vue';
import GraphNodesRenderer from './GraphNodesRenderer.vue';
import { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter';
import { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter';
import { Logger } from '@/models/graph/graph-nodes/generic/logger';
import { Merge } from '@/models/graph/graph-nodes/generic/merge';
import { RepeatShortest } from '@/models/graph/graph-nodes/generic/repeat-shortest';
import { RepeatUntil } from '@/models/graph/graph-nodes/generic/repeat-until';
import { TrimLongest } from '@/models/graph/graph-nodes/generic/trim-longest';
import { WrapShortest } from '@/models/graph/graph-nodes/generic/wrap-shortest';
import { Add } from '@/models/graph/graph-nodes/math/add';
import { Multiply } from '@/models/graph/graph-nodes/math/square';
import { Sum } from '@/models/graph/graph-nodes/math/sum';
import { Range } from '@/models/graph/graph-nodes/math/range'
import { XY } from '@/models/graph/graph-nodes/geometry/xy'
import { Canvas } from '@/models/graph/graph-nodes/canvas/canvas';
import { Circle } from '@/models/graph/graph-nodes/canvas/circle';
import { CanvasProps } from '@/models/graph/graph-nodes/canvas/canvas-props';
import { Rectangle } from '@/models/graph/graph-nodes/canvas/rectangle';
import { Divide } from '@/models/graph/graph-nodes/math/divide';
import { SimpleRange } from '@/models/graph/graph-nodes/math/simple-range';

const { clear } = useGraph();
const { register } = useGraphNodeActivatorCollection();

register(['Emitters', 'Number'], (id, path) => new NumberEmitter(id, path))
register(['Emitters', 'Text'], (id, path) => new TextEmitter(id, path))

register(['Generic', 'Logger'], (id, path) => new Logger(id, path))
register(['Generic', 'Merge'], (id, path) => new Merge(id, path))
register(['Generic', 'Repeat Shortest'], (id, path) => new RepeatShortest(id, path))
register(['Generic', 'Trim Longest'], (id, path) => new TrimLongest(id, path))
register(['Generic', 'Wrap Shortest'], (id, path) => new WrapShortest(id, path))
register(['Generic', 'Repeat Until'], (id, path) => new RepeatUntil(id, path))

register(['Math', 'Add'], (id, path) => new Add(id, path))
register(['Math', 'Sum'], (id, path) => new Sum(id, path))
register(['Math', 'Square'], (id, path) => new Multiply(id, path))
register(['Math', 'Divide'], (id, path) => new Divide(id, path))
register(['Math', 'Range'], (id, path) => new Range(id, path))
register(['Math', 'Range (Simple)'], (id, path) => new SimpleRange(id, path))

register(['Geometry', 'XY'], (id, path) => new XY(id, path))

register(['Canvas', 'Canvas'], (id, path) => new Canvas(id, path))
register(['Canvas', 'Props'], (id, path) => new CanvasProps(id, path))
register(['Canvas', 'Circle'], (id, path) => new Circle(id, path))
register(['Canvas', 'Rectangle'], (id, path) => new Rectangle(id, path))

clear();

</script>
