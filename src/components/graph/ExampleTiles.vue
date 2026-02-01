<template>
  <div class="example-panel">
    <div class="welcome-banner">
      <h2>Welcome!</h2>

      <p>Click one of the examples to get started</p>
    </div>

    <div class="example-grid">
      <div
        v-for="path in sortedExamplePaths"
        :key="path"
        class="tile"
        @mousedown.stop
        @click.stop="loadExample(path)"
      >
        <div class="tile-image">
          <img
            :src="getThumbnailFor(path)"
            alt="Example thumbnail"
          >
        </div>

        <div class="tile-label">
          {{ path.split('/').pop()?.split('.').shift() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExampleTiles } from '@/composables/use-example-files'

const { sortedExamplePaths, loadExample, getThumbnailFor } = useExampleTiles()
</script>

<style scoped>
.example-panel {
  position: absolute;
  inset: 20px;
  z-index: 999;

  padding: 0;
  display: flex;
  flex-direction: column;

  pointer-events: none; /* panel is click-through */
}

.tile {
  pointer-events: auto; /* children can receive clicks */
}

/* Banner */
.welcome-banner {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 16px;
}

.welcome-banner h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.welcome-banner p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.85;
}

.example-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tile {
  width: 200px;        /* or any width you want */
  flex: 0 0 auto;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.3);
}

/* Image area */
.tile-image {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Label */
.tile-label {
  padding: 8px;
  font-size: 13px;
  color: var(--color-text);
  text-align: center;
  background: rgba(255,255,255,0.05);
}
</style>
