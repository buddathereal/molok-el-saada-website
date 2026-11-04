import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const isSandboxPreview = Boolean(process.env.E2B_SANDBOX || process.env.E2B_SANDBOX_ID);

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true,
    ...(isSandboxPreview ? { hmr: { protocol: 'wss', clientPort: 443 } } : {}),
    warmup: {
      clientFiles: ['./index.html', './index.tsx', './App.tsx'],
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return;
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
          if (/\/node_modules\/(motion|motion-dom|motion-utils)\//.test(id)) return 'vendor-motion';
          if (id.includes('/node_modules/gsap/')) return 'vendor-gsap';
        },
      },
    },
  },
});
