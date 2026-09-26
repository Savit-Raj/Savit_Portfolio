import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // Keep the animation runtime in its own long-cached chunk.
        manualChunks: (id) =>
          id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')
            ? 'motion'
            : undefined,
      },
    },
  },
})
