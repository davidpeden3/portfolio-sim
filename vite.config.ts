import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  base: '/', // Use absolute paths
  resolve: {
    alias: {
      // Allow importing package.json directly
      '@package': '/package.json',
    },
  },
  optimizeDeps: {
    include: ['@package'],
  },
});