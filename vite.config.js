import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml';
import { globalVariablesText } from './theme/scss.js';

export default defineConfig({
  plugins: [
    react(),
    ViteYaml(),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@t": "/theme"
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: globalVariablesText,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://10.0.2.2',
        target: 'http://127.0.0.1:3100',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
      }
    },
  }
})
