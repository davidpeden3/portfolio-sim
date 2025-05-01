import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Ensure proper MIME types for JavaScript modules
    rollupOptions: {
      output: {
        // Ensure proper file extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
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