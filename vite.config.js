import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../static',
  server: {
    open: true,
    port: 5173 // change to 5174 or 5175 for the others
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
