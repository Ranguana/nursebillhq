import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 17839,
    strictPort: true,  // fail fast if port is taken, don't silently use another
  },
  resolve: {
    alias: {
      sheetjs: 'xlsx',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './app.html',  // Electron app entry — index.html is the Vercel marketing page
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
