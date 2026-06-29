import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Dev playground config for viewing components in the browser (tests/ as Vite root)
export default defineConfig({
  root: 'tests',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui8kit/core': path.resolve(__dirname, './src/index'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
  css: {
    postcss: './tests/config/postcss.config.js',
  },
  server: {
    port: 5174,
    host: true,
  },
});
