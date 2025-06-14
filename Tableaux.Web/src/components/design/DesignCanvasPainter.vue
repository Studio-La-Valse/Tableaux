<template>
  <div>
    <DesignCanvas class="canvas" :elements="drawableElements" />

  </div>

</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import DesignCanvas from "@/components/design/DesignCanvas.vue"
import type { DrawableElement } from "@/models/drawable-elements/drawable-element";


const drawableElementsBuffer: DrawableElement[] = [];

const drawableElements = ref<DrawableElement[]>([]);

onMounted(() => {

});
</script>
