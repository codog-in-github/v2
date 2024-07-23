import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml';
import { globalVariablesText } from './theme/scss.js';
import { env } from 'process';
import fs from 'fs'



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
    port: 443,
    proxy: {
      '/api': {
        target: 'http://10.0.2.2',
        changeOrigin: true,
      }
    },
    https: {
      key:  fs.readFileSync('certs/cert.key'),
      cert:  fs.readFileSync('certs/cert.crt'),
    }
  }
})
