<template>
  <DesignCanvas class="canvas" :elements="drawableElements" />
</template>

<script setup lang="ts">
import { useDispatcherStore } from "@/stores/element-dispatcher-store";
import { onMounted, ref } from "vue";
import DesignCanvas from "@/components/DesignCanvas.vue"
import type { DrawableElement } from "@/models/drawable-elements/drawable-element";

const dispatcherStore = useDispatcherStore();

const drawableElementsBuffer: DrawableElement[] = [];

// Reactive list of drawable elements.
const drawableElements = ref<DrawableElement[]>([]);

onMounted(() => {
  dispatcherStore.subscribe({
    onNext(element) {
      drawableElementsBuffer.push(element);
    },
    onError(error) {
      console.error("Error:", error);
    },
    onComplete() {
      drawableElements.value.length = 0;

      for (const item of drawableElementsBuffer) {
        drawableElements.value.push(item);
      }

      drawableElementsBuffer.length = 0;
    }
  });
});
</script>
