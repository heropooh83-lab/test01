import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // 배포 위치에 따라 자산 경로의 기준이 달라진다.
    // Vercel은 도메인 루트에 올라가므로 '/', GitHub Pages는 /<저장소 이름>/ 아래에 올라간다.
    // Pages 워크플로가 BASE_PATH=/test01/ 을 넘겨 주고, 그 밖에는 루트를 쓴다.
    base: process.env.BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    build: {
      // 앱마다 진입 HTML이 하나씩이다.
      // index.html: AI 윤리 시뮬레이터 · shield.html: AI 안전 방패 메이커 · quiz.html: 딥페이크 판별 퀴즈
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          shield: path.resolve(__dirname, 'shield.html'),
          quiz: path.resolve(__dirname, 'quiz.html'),
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
