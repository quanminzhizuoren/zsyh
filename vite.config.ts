import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import toPages from './page.config';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    toPages()
  ],
  base: '/',
  root: 'src',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      // input: resolve(__dirname, 'src/index.html'),
    }
  }
})
