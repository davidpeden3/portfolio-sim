import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Ensure the build is optimized
    minify: 'terser',
    sourcemap: false
  },
  base: '/', // Use absolute paths for production
  resolve: {
    alias: {
      '@package': '/package.json',
    },
  },
  optimizeDeps: {
    include: ['@package'],
  },
});