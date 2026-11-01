import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ===== GitHub Pages 프로젝트 하위 경로 설정 시작 =====
  base: '/codyssey-b1-2/',
  // ===== GitHub Pages 프로젝트 하위 경로 설정 끝 =====
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true
  }
})
