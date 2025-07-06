<template>
  <div class="handle" @mouseenter="showTip = true" @mouseleave="showTip = false">
      <div v-show="showTip" class="tooltip">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ description: string }>();
const showTip = ref(false);
</script>


<style scoped>
.handle {
  width: 200%;
  /* wider for pill shape */
  height: 12px;
  /* flatter shape */
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-text);
  border-radius: 999px;
  /* ensures fully rounded ends */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
  cursor: auto;
}

.handle:hover {
  background-color: var(--color-accent);
}

.tooltip {
  position: absolute;
  left: 75%;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 99;
}
</style>
