<template>
  <div class="handle"></div>
</template>

<script setup lang="ts">
// HandleRenderer is kept simple. Expand functionality later if needed.
</script>

<style scoped>
.handle {
  width: 12px;
  height: 12px;
  background-color: #555;
  border: 2px solid #e3dfdf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
}
.handle:hover {
  background-color: #666;
}
</style>
