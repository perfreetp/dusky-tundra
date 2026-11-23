import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5180,
    host: '127.0.0.1'
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000
  }
});
