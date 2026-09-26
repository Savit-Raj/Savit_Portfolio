import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { subscribeToasts, type ToastMessage } from '@/lib/toast'

export function Toaster() {
  const [items, setItems] = useState<ToastMessage[]>([])
  useEffect(() => subscribeToasts(setItems), [])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-800/90 px-4 py-2.5 font-mono text-xs text-fog-200 shadow-2xl backdrop-blur-xl"
          >
            <span className="size-1.5 rounded-full bg-signal" />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
