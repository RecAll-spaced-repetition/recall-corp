import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss()],
  server: {
    strictPort: true,
  },
  build: {
    outDir: `build`,
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
});
