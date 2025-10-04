import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  esbuild: {
    target: 'es2022', // Ensures ES2022 features like '.at()' are supported
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue-resizable-panels')) return 'resizable-panels'
            if (id.includes('vuedraggable')) return 'vuedraggable'
            if (id.includes('@heroicons')) return 'heroicons'
          }
        }
      }
    }
  }
})
