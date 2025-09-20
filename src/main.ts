import './assets/main.css'

import App from './App.vue'
import router from './router'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { logError } from '@/stores/use-error-log-store'
import { useGraphNodeActivatorStore } from '@/stores/use-graph-node-activator-store'

import { graphNodeTypes } from '@/graph/graph-nodes/decorators'
import { useGraphNodePanelStore } from './stores/use-graph-node-panel-store'
import { useEmitterInputStore } from './stores/use-emitter-input-store'
import.meta.glob('@/graph/graph-nodes/**/*.ts', { eager: true })

const app = createApp(App)

// catches runtime Vue errors
app.config.errorHandler = (err, vm, info) => {
  const _err = err as Error
  logError(`[Vue Error] ${_err.message} — ${info}`)
}

// catches unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError(`[Unhandled Promise] ${event.reason}`)
})

// catches uncaught runtime JS errors
window.addEventListener('error', (event) => {
  logError(`[JS Error] ${event.message} @ ${event.filename}:${event.lineno}`)
})

app.use(router)

app.use(createPinia())

const { register } = useGraphNodeActivatorStore()
const { registerPanel } = useGraphNodePanelStore()
const { registerInput } = useEmitterInputStore()

for (const { category, ctor } of graphNodeTypes) {
  register(category, (id, path) => new ctor(id, path))

  if (ctor.__graphNodePanel) {
    registerPanel(ctor, ctor.__graphNodePanel);
  }

  if (ctor.__emitterInput) {
    registerInput(ctor, ctor.__emitterInput)
  }
}

app.mount('#app')
