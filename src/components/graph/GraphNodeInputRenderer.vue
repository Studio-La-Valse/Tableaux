<!-- src/components/GraphNodeInputRenderer.vue -->
<template>
  <div class="node-port input-port" :style="{ top: positionY + 'px' }" @mousedown.stop @mouseup="handleMouseUp">
    <HandleRenderer :description="input.description" />
    <div class="label">
      <span>{{ input.description[0] }}</span>
    </div>
    <button class="remover fade-toggle" :class="{ show: scale >= 3 }" @click.stop="removerClick">-</button>

    <button class="extender fade-toggle" :class="{ show: scale >= 3 }" @click.stop="adderClick">+</button>

  </div>
</template>

<script setup lang="ts">
import HandleRenderer from '@/components/graph/HandleRenderer.vue';
import type { GraphNodeInput } from '@/models/graph/core/graph-node-input';
import { useEdgeDrag } from '@/composables/useEdgeDrag';
import { useGraph } from '@/stores/graph-store';
import { useCanvasTransform } from '@/composables/useCanvasTransform';
import { computed } from 'vue';

const props = defineProps<{
  input: GraphNodeInput;
  positionY: number;
}>();

const canvasTransform = useCanvasTransform()
const scale = computed(() => canvasTransform.scale.value)

const graph = useGraph();
const { finishEdgeDrag } = useEdgeDrag();
const { connect } = useGraph();
const handleMouseUp = () => {
  const prototype = finishEdgeDrag(props.input.graphNode.id, props.input.index)
  if (prototype) {
    connect(
      prototype.fromNodeId,
      prototype.fromOutputIndex,
      prototype.toNodeId,
      prototype.toInputIndex
    )
  }
}

const removerClick = () => {
  alert("Works.")
}

const adderClick = () => {
  alert("Works.")
}
</script>

<style scoped>
.node-port {
  position: absolute;
  transform: translate(0%, -50%);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.input-port {
  flex-direction: row;
}

.label {
  font-size: 10px;
  padding-left: 3px;
  color: var(--color-text);
}

.fade-toggle {
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fade-toggle.show {
  opacity: 1;
  pointer-events: auto;
}

.extender,
.remover {
  position: absolute;

  width: 10px;
  height: 10px;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  /* smooth interaction */
  cursor: pointer;
  /* makes it feel clickable */
}

.extender:hover,
.remover:hover {
  transform: scale(1.2);
  /* slight shrink on click */
  background-color: #ddd;
  /* darker shade for feedback */
  border-color: #999;
  /* emphasize edge */
}

.remover {
  left: 15px;
  top: -2px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.extender {
  left: 5px;
  top: 18px;
  background-color: var(--color-text);
  border: 1px solid var(--color-background-soft);
  color: var(--color-border);
}
</style>
