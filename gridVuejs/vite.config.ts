import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueGridJS',
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es' ? 'gridvuejs.js' : 'gridvuejs.cjs',
      cssFileName: 'style',
    },

    rolldownOptions: {
      external: ['vue'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
