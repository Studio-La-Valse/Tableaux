<template>
  <div>
    <DesignCanvas class="canvas" :elements="drawableElements" />

  </div>

</template>

<script setup lang="ts">
import { useDispatcherStore } from "@/stores/element-dispatcher-store";
import { nextTick, onMounted, ref } from "vue";
import DesignCanvas from "@/components/design/DesignCanvas.vue"
import type { DrawableElement } from "@/models/drawable-elements/drawable-element";

const dispatcherStore = useDispatcherStore();

const drawableElementsBuffer: DrawableElement[] = [];

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
      nextTick(() => {
        drawableElements.value = [...drawableElementsBuffer];
        drawableElementsBuffer.length = 0;
      });

    }
  });
});
</script>
