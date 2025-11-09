<!-- src/components/GraphNodeInputRenderer.vue -->
<template>
  <div
    class="node-port input-port"
    :style="{ top: positionY + 'px' }"
    @mousedown.stop
    @mouseup.stop="handleMouseUp"
  >
    <button
      v-if="
        graphNode.paramsInputOrigin?.index == input.index && graphNode.canInsertInput(input.index)
      "
      class="prepender fade-toggle"
      :class="{ show: scale >= 3 }"
      @mouseup.stop
      @click.stop="prependerClick"
    >
      +
    </button>

    <HandleRenderer :description="input.description" />
    <div class="label">
      <span>{{ input.description[0] }}</span>
    </div>
    <button
      v-if="graphNode.canRemoveInput(input.index)"
      class="remover fade-toggle"
      :class="{ show: scale >= 3 }"
      @mouseup.stop
      @click.stop="removerClick"
    >
      -
    </button>

    <button
      v-if="graphNode.canInsertInput(input.index + 1)"
      class="extender fade-toggle"
      :class="{ show: scale >= 3 }"
      @mouseup.stop
      @click.stop="adderClick"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
  import HandleRenderer from '@/components/graph/HandleRenderer.vue';
  import type { IGraphNodeInput } from '@/graph/core/graph-node-input';
  import { useEdgeDrag } from '@/composables/use-edge-drag';
  import { useGraphStore } from '@/stores/use-graph-store';
  import { useCanvasTransform } from '@/composables/use-canvas-transform';
  import { computed } from 'vue';
  import type { IGraphNodeWrapper } from '@/graph/core/graph-node-wrapper';

  const props = defineProps<{
    graphNode: IGraphNodeWrapper;
    input: IGraphNodeInput;
    positionY: number;
  }>();

  const canvasTransform = useCanvasTransform();
  const scale = computed(() => canvasTransform.scale.value);

  const { removeInput, insertInput } = useGraphStore();
  const { startConnect, finishConnect, tempEdge } = useEdgeDrag();

  const handleMouseUp = (e: MouseEvent) => {
    if (tempEdge.value) {
      finishConnect(props.input.graphNodeId, props.input.index, e);
    } else {
      startConnect('reverse', props.input.graphNodeId, props.input.index, e);
    }
  };

  const removerClick = () => {
    removeInput(props.graphNode.modelId, props.input.index);
  };

  const adderClick = () => {
    insertInput(props.graphNode.modelId, props.input.index + 1);
  };

  const prependerClick = () => {
    insertInput(props.graphNode.modelId, props.input.index);
  };
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

  .prepender,
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

  .prepender:hover,
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

  .prepender {
    left: 5px;
    top: -12px;
    background-color: var(--color-text);
    border: 1px solid var(--color-background-soft);
    color: var(--color-border);
  }
</style>
