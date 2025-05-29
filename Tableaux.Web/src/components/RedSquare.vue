<template>
  <g>
    <rect
        width="100"
        height="100"
        :x="x"
        :y="y"
        fill="red"
      />
  </g>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useDispatcherStore } from "@/stores/element-dispatcher-store";
import { DrawableRectangle } from '@/models/drawable-elements/drawable-rectangle';

const x = ref(Math.random() * 700);
const y = ref(Math.random() * 700);

const dispatcherStore = useDispatcherStore();
const componentId = crypto.randomUUID();

const centerX = Math.random() * 300;
const centerY = Math.random() * 300;
const radius = 350;

let intervalId: number | undefined;
let angle = 0;

onMounted(() => {
  dispatcherStore.registerEmitter(componentId);

  intervalId = setInterval(() => {

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    angle += 0.05; // Adjust rotation speed

    const element = new DrawableRectangle(x, y, 100, 100, 'red')
    dispatcherStore.queueElement(element);
    dispatcherStore.markEmitterComplete(componentId);
  }, 16);
})

onUnmounted(() => {
    clearInterval(intervalId);
    dispatcherStore.unregisterEmitter(componentId);  // Mark as done when unmounted
});

</script>
