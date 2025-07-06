// stores/errorLog.ts
import { ref, computed } from 'vue'

export const errorMessages = ref<string[]>([])

// only expose the last one
export const lastError = computed(() =>
  errorMessages.value.length
    ? errorMessages.value[errorMessages.value.length - 1]
    : ''
)

export function logError(message: string) {
  errorMessages.value.push(message)
  console.error(message)
}
