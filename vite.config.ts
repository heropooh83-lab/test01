import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      // 앱이 둘이므로 진입 HTML도 둘이다 (index.html: AI 윤리 시뮬레이터, shield.html: AI 안전 방패 메이커).
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          shield: path.resolve(__dirname, 'shield.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Set DISABLE_HMR=true to turn off hot reload and file watching.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
