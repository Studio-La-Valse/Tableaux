import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let resolveFn: (() => void) | null = null

export function useAlert() {
  function show(msg: string): Promise<void> {
    message.value = msg
    visible.value = true
    return new Promise<void>((resolve) => {
      resolveFn = resolve
    })
  }

  function close() {
    visible.value = false
    if (resolveFn) {
      resolveFn()
      resolveFn = null
    }
  }

  return {
    visible,
    message,
    show,
    close,
  }
}
