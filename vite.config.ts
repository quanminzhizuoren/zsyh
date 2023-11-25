import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import toPages from './page.plugin';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    toPages()
  ],
  base: './',
  root: 'src',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  publicDir: resolve(__dirname, './public'),
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      // input: getInput(),
    },
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
  }
})
