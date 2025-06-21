<template>
  <svg :style="svgStyle" class="edge-svg">
    <path :d="pathD" :stroke="stroke" :stroke-width="strokeWidth" :stroke-opacity="strokeOpacity" :pointer-events="pointerEvents" fill="none"
      @click="onClick" />
  </svg>
</template>

<script setup lang="ts">
import { computed, type PropType, type StyleValue } from 'vue';

const props = defineProps({
  x1: {
    type: Number,
    required: true
  },
  y1: {
    type: Number,
    required: true
  },
  x2: {
    type: Number,
    required: true
  },
  y2: {
    type: Number,
    required: true
  },
  stroke: String,
  strokeWidth: {
    type: Number,
    default: 2
  },
  strokeOpacity: {
    type: Number,
    default: 1
  },
  pointerEvents: {
    type: String,
    default: "none"
  },
  callback: {
    type: Function as PropType<(ev: MouseEvent) => void>,
    required: false
  }
});

const onClick = (ev: MouseEvent) => {
  if (props.callback) {
    props.callback(ev);
  }
};

// Use a fixed padding so that it’s easier to click the edge.
const padding = 10;

// Compute the bounding box of the edge:
const xMin = computed(() => Math.min(props.x1, props.x2));
const yMin = computed(() => Math.min(props.y1, props.y2));
const boxWidth = computed(() => Math.abs(props.x1 - props.x2));
const boxHeight = computed(() => Math.abs(props.y1 - props.y2));

// Position the SVG container only over the edge’s area (with padding)
const svgStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  left: `${xMin.value - padding}px`,
  top: `${yMin.value - padding}px`,
  width: `${boxWidth.value + padding * 2}px`,
  height: `${boxHeight.value + padding * 2}px`,
  overflow: 'visible'
}));

// Adjust the coordinates relative to the SVG container.
const adjustedStart = computed(() => ({
  x: props.x1 - (xMin.value - padding),
  y: props.y1 - (yMin.value - padding)
}));

const adjustedEnd = computed(() => ({
  x: props.x2 - (xMin.value - padding),
  y: props.y2 - (yMin.value - padding)
}));

const pathD = computed(() => {
  const x1 = adjustedStart.value.x;
  const x2 = adjustedEnd.value.x;
  const y1 = adjustedStart.value.y
  const y2 = adjustedEnd.value.y

  const offset = Math.abs(y1 - y2);
  return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
});
</script>

<style lang="css" scoped>
.edge-svg {
  pointer-events: none;
}

</style>
