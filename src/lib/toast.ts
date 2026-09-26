/** Minimal pub/sub toast store — no provider needed. */
export interface ToastMessage {
  id: number
  text: string
}

type Listener = (toasts: ToastMessage[]) => void

let toasts: ToastMessage[] = []
let nextId = 1
const listeners = new Set<Listener>()

const emit = () => listeners.forEach((l) => l(toasts))

export function toast(text: string, ttl = 2400) {
  const id = nextId++
  toasts = [...toasts, { id, text }]
  emit()
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  }, ttl)
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener)
  listener(toasts)
  return () => {
    listeners.delete(listener)
  }
}

export async function copyToClipboard(text: string, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text)
    toast(message)
  } catch {
    toast('Copy failed — select and copy manually')
  }
}
