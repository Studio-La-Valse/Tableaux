import './assets/main.css';

import App from './App.vue';
import router from './router';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import useGraphNodeRegistrar from './plugins/graph-node-registrar';

import { logError } from '@/stores/use-error-log-store';
import useGraphInitializer from './plugins/graph-node-initializer';

const app = createApp(App);

// catches runtime Vue errors
app.config.errorHandler = (err, vm, info) => {
  const _err = err as Error;
  logError(`[Vue Error] ${_err.message} — ${info}`);
};

// catches unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError(`[Unhandled Promise] ${event.reason}`);
});

// catches uncaught runtime JS errors
window.addEventListener('error', (event) => {
  logError(`[JS Error] ${event.message} @ ${event.filename}:${event.lineno}`);
});

app.use(router);

app.use(createPinia());

app.use(useGraphInitializer());

app.use(useGraphNodeRegistrar());

app.mount('#app');
