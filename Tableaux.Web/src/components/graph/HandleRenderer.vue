<template>
  <div class="handle"></div>
</template>

<script setup lang="ts">
// HandleRenderer is kept simple. Expand functionality later if needed.
</script>

<style scoped>
.handle {
  width: 200%;
  /* wider for pill shape */
  height: 12px;
  /* flatter shape */
  background-color: #555;
  border: 2px solid #e3dfdf;
  border-radius: 999px;
  /* ensures fully rounded ends */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
  cursor: auto;
}

.handle:hover {
  background-color: #d12a2a;
}
</style>
