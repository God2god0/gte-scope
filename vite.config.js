import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      external: [
        'puppeteer',
        'puppeteer-core',
        '@puppeteer/browsers'
      ]
    }
  },
  optimizeDeps: {
    exclude: [
      'puppeteer',
      'puppeteer-core',
      '@puppeteer/browsers'
    ]
  }
})
