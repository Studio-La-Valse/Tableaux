<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="alert-overlay"
      @click.self="close"
    >
      <div class="alert-box">
        <p>{{ message }}</p>

        <button
          type="button"
          @click="close"
        >
          OK
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useAlert } from '@/composables/use-alert'

const { visible, message, close } = useAlert()
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.alert-box {
  background: var(--color-background);
  color: var(--color-text);
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  min-width: 300px;
  max-width: 80%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.alert-box button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background: var(--color-accent);
  color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
}

.alert-box button:hover {
  opacity: 0.9;
}

/* simple fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
