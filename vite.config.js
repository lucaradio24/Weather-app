// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Weather-app/', // Nome del tuo repository GitHub
  build: {
    outDir: 'dist',
    target: 'esnext', // Supporta top-level await
    minify: 'esbuild'
  },
  esbuild: {
    target: 'esnext' // Supporta funzionalità moderne
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})